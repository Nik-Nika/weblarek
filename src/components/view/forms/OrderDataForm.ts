import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BaseForm } from "./BaseForm";

export class OrderDataForm extends BaseForm {
  protected paymentTypeButton: HTMLButtonElement[];
  protected addressElement: HTMLInputElement;
  protected nextButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container, eventBroker);

    this.paymentTypeButton = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container
    );
    this.addressElement = ensureElement<HTMLInputElement>(
      ".order__field input",
      this.container
    );
    this.nextButton = ensureElement<HTMLButtonElement>(
      ".order__button",
      this.container
    );

    this.paymentTypeButton.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.paymentTypeButton.forEach((b) => {
          b.classList.add("button_alt");
          b.classList.remove("button_alt-active");
        });
        btn.classList.remove("button_alt");
        btn.classList.add("button_alt-active");
        this.eventBroker.emit("order:payment:changed", { payment: btn.name });
        this.eventBroker.emit("order:form:changed");
      });
    });

    this.addressElement.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.eventBroker.emit("order:address:changed", { address: target.value });
    });

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.eventBroker.emit("cart:fill-contacts");
    });
  }

  set payment(value: "cash" | "card" | "") {
    this.paymentTypeButton.forEach((b) => {
      const isActive = value && b.name === value;
      b.classList.toggle("button_alt", !isActive);
      b.classList.toggle("button_alt-active", !!isActive);
    });
  }

  set address(value: string) {
    this.addressElement.value = value ?? "";
  }
}