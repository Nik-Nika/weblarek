import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IBaseForm {}

export class SuccessOrderForm extends Component<IBaseForm> {
  protected totalElement: HTMLElement;
  protected newOrderButton: HTMLButtonElement;

  constructor(container: HTMLElement, private eventBroker: IEvents) {
    super(container);

    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.newOrderButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.newOrderButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.eventBroker.emit("order:new");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсисов`;
  }
}