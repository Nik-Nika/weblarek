import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected makeOrderButton: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.makeOrderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.totalPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );

    this.makeOrderButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("cart:make-order");
    });
  }

  set items(items: HTMLElement[]) {
    if (!items || items.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "basket__empty";
      emptyItem.textContent = "Корзина пуста";
      this.listElement.replaceChildren(emptyItem);
      this.makeOrderButton.disabled = true;
      this.makeOrderButton.classList.add("button_disabled");
      this.total = 0;
    } else {
      this.listElement.replaceChildren(...items);
      this.makeOrderButton.disabled = false;
      this.makeOrderButton.classList.remove("button_disabled");
    }
  }

  set total(value: number | null) {
    this.totalPrice.textContent = value !== null ? `${value} синапсисов` : "Бесценно";
  }
}