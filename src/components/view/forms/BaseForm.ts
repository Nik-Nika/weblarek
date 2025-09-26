import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IBaseForm {}

export class BaseForm extends Component<IBaseForm> {
  protected errorsElement: HTMLElement;
  protected submitElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected eventBroker: IEvents) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);
    this.submitElement = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );

    this.container.addEventListener("input", () => {
      eventBroker.emit("order:form:changed");
    });
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set valid(value: boolean) {
    this.submitElement.disabled = !value;
  }
}