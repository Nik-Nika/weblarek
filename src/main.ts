import { Api } from "./components/base/Api";
import { APIManager } from "./components/communication/API";
import { Customer } from "./components/samples/Customer";
import { Catalog } from "./components/samples/Catalog";
import { Card } from "./components/samples/Card";
import { Header } from "./components/view/Header";


import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

import { EventEmitter } from "./components/base/Events";
import { GalleryCard } from "./components/view/cards/GalleryCard";
import { Gallery } from "./components/view/Gallery";
import { ModalDialog } from "./components/view/ModalDialog";
import { PreviewCard } from "./components/view/cards/PreviewCard";
import { CartPreviewCard } from "./components/view/cards/CartPreviewCard";
import { Basket } from "./components/view/Basket";
import { SuccessOrderForm } from "./components/view/forms/SuccessOrderForm";
import { ContactDataForm } from "./components/view/forms/ContactDataForm";
import { OrderDataForm } from "./components/view/forms/OrderDataForm";
import { Page } from "./components/view/Page";
import { IProduct } from "./types";


const eventBroker = new EventEmitter();

const API = new Api(API_URL);
const apiManager = new APIManager(API);

const page = ensureElement(".page__wrapper");
const header = ensureElement(".header");
const gallery = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const tplCatalog = ensureElement<HTMLTemplateElement>("#card-catalog");
const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
const tplOrder = ensureElement<HTMLTemplateElement>("#order");
const tplContacts = ensureElement<HTMLTemplateElement>("#contacts");
const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

const FormOrder = modalContainer.querySelector('form[name="order"]');
const FormContacts = modalContainer.querySelector('form[name="contacts"]')

const productsCatalog = new Catalog(eventBroker);
const cart = new Card(eventBroker);
const buyer = new Customer(eventBroker);

const pageView = new Page(page);
const galleryView = new Gallery(gallery);
const headerView = new Header(eventBroker, header);
const modalView = new ModalDialog(modalContainer, eventBroker);


function updateHeaderCounter() {
  headerView.counter = cart.size;
  headerView.render();
}

function buildPreviewContent(product: IProduct): HTMLElement {
  const contentTpl = cloneTemplate<HTMLElement>(tplPreview);
  const previewContent = new PreviewCard(contentTpl, (id) => {
    cart.isExist(id)
      ? eventBroker.emit("product:deleted", { id })
      : eventBroker.emit("product:added", { id });
  });
  previewContent.category = product.category;
  previewContent.description = product.description;
  previewContent.id = product.id;
  previewContent.title = product.title;
  previewContent.image = product.image;
  previewContent.inCart = cart.isExist(product.id);
  if (product.price) {
    previewContent.price = product.price;
  } else {
    previewContent.zeroPrice = true;
    previewContent.price = null;
  }
  return previewContent.render();
}

function openPreview(product: IProduct, shouldOpen: boolean = true) {
  modalView.content = buildPreviewContent(product);
  if (shouldOpen) modalView.open();
}

function buildBasketContent(): HTMLElement {
  const items = cart.products;
  const nodes = items.map((p, index) => {
    const node = cloneTemplate<HTMLElement>(tplBasketItem);
    const cardItem = new CartPreviewCard(node, (id) =>
      eventBroker.emit("card:product:delete", { id })
    );
    cardItem.index = ++index;
    cardItem.id = p.id;
    cardItem.title = p.title;
    cardItem.price = p.price;
    return cardItem.render();
  });
  const basketTpl = cloneTemplate<HTMLElement>(tplBasket);
  const basketView = new Basket(basketTpl, eventBroker);
  basketView.items = nodes;
  basketView.total = cart.total;
  return basketView.render();
}

function openBasketModal() {
  modalView.content = buildBasketContent();
  modalView.open();
}

function refreshBasketInModal() {
  modalView.content = buildBasketContent();
}

function openOrderForm() {
  const orderTpl = cloneTemplate<HTMLElement>(tplOrder);
  const orderContent = new OrderDataForm(orderTpl, eventBroker);
  orderContent.address = buyer.userInfo.address;
  orderContent.payment = buyer.userInfo.payment;
  const v = buyer.getOrderValidation();
  orderContent.valid = v.valid;
  orderContent.errors = v.error;
  modalView.content = orderContent.render();
  modalView.open();
}

function openContactsForm() {
  const contactsTpl = cloneTemplate<HTMLElement>(tplContacts);
  const contactsContent = new ContactDataForm(contactsTpl, eventBroker);
  const v = buyer.getContactsValidation();
  contactsContent.valid = v.valid;
  contactsContent.errors = v.error;
  modalView.content = contactsContent.render();
  modalView.open();
}

function validateAndUpdateActiveForm() {
  const isOrderFormOpen = !!FormOrder;
  const isContactsFormOpen = !!FormContacts;
  if (isOrderFormOpen) {
    const orderFormEl = FormOrder!;
    const orderForm = new OrderDataForm(orderFormEl as unknown as HTMLElement, eventBroker);
    const v = buyer.getOrderValidation();
    orderForm.valid = v.valid;
    orderForm.errors = v.error;
  }
  if (isContactsFormOpen) {
    const contactsFormEl = FormContacts!;
    const contactsForm = new ContactDataForm(contactsFormEl as unknown as HTMLElement, eventBroker);
    const v = buyer.getContactsValidation();
    contactsForm.valid = v.valid;
    contactsForm.errors = v.error;
  }
}

function showSuccessModal() {
  const successTpl = cloneTemplate<HTMLElement>(tplSuccess);
  const successContent = new SuccessOrderForm(successTpl, eventBroker);
  successContent.total = cart.total;
  modalView.content = successContent.render();
  modalView.open();
}

function createOrderPayload() {
  return {
    total: cart.total,
    items: cart.products.map((p) => p.id),
    ...buyer.userInfo
  };
}

apiManager
  .fetchProducts()
  .then((products) => {
    productsCatalog.products = products.items;
    console.log(`Products loaded. Total count = ${products.items.length}`);
  })
  .catch((err) => {
    console.error("Server Error", err);
  });

eventBroker.on("catalog:loaded", () => {
  const items = productsCatalog.products;
  const nodes = items.map((p) => {
    const node = cloneTemplate<HTMLElement>(tplCatalog);
    const card = new GalleryCard(node, (id) =>
      eventBroker.emit("card:selected", { id })
    );
    card.id = p.id;
    card.image = p.image;
    card.title = p.title;
    card.category = p.category;
    card.price = p.price;
    return card.render();
  });
  galleryView.items = nodes;
});

eventBroker.on("card:selected", (obj: { id: string }) => {
  const { id } = obj;
  const selectedProduct = productsCatalog.getProductById(id);
  if (selectedProduct) {
    productsCatalog.selectedProduct = selectedProduct ?? null;
    openPreview(selectedProduct);
  }
});

eventBroker.on("product:added", (obj: { id: string }) => {
  const { id } = obj;
  const selectedProduct = productsCatalog.selectedProduct;
  if (selectedProduct && !cart.isExist(id)) {
    cart.addProduct(selectedProduct);
    openPreview(selectedProduct, false);
    modalView.close();
  }
});

eventBroker.on("product:deleted", (obj: { id: string }) => {
  const { id } = obj;
  const selectedProduct = productsCatalog.selectedProduct;
  if (selectedProduct && cart.isExist(id)) {
    cart.deleteProduct(id);
    openPreview(selectedProduct, false);
    modalView.close();
  }
});

eventBroker.on("cart:changed", () => {
  updateHeaderCounter();
});

eventBroker.on("basket:open", () => {
  openBasketModal();
});

eventBroker.on("card:product:delete", (obj: { id: string }) => {
  const { id } = obj;
  if (cart.isExist(id)) {
    cart.deleteProduct(id);
    refreshBasketInModal();
  }
});

eventBroker.on("cart:make-order", () => {
  openOrderForm();
});

eventBroker.on("cart:fill-contacts", () => {
  openContactsForm();
});

eventBroker.on("order:success", () => {
  showSuccessModal();
});

eventBroker.on("order:new", () => {
  cart.clearCart();
  updateHeaderCounter();
  buyer.clearInfo();
  modalView.close();
});

eventBroker.on("order:payment:changed", (data: { payment: "cash" | "card" }) => {
  buyer.payment = data.payment;
});

eventBroker.on("order:address:changed", (data: { address: string }) => {
  buyer.address = data.address;
});

eventBroker.on("order:email:changed", (data: { email: string }) => {
  buyer.email = data.email;
});

eventBroker.on("order:phone:changed", (data: { phone: string }) => {
  buyer.phone = data.phone;
});

eventBroker.on("order:form:changed", () => {
  validateAndUpdateActiveForm();
});

eventBroker.on("order:submit", async () => {
  const validity = buyer.isValid();
  if (!(validity.email && validity.phone && validity.address && validity.payment)) {
    return;
  }
  const order = createOrderPayload();
  try {
    const res = await apiManager.submitOrder(order);
    if ((res as any).error) {
      console.error("Order failed", res);
      return;
    }
    eventBroker.emit("order:success");
    buyer.clearInfo();
  } catch (e) {
    console.error("Order error", e);
  }
});

eventBroker.on("modal:open", () => {
  pageView.lock();
});

eventBroker.on("modal:close", () => {
  pageView.unlock();
  modalView.close();
});