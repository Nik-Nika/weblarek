import { IModal } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class ModalDialog extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected isOpen = false;

  constructor(container: HTMLElement, private eventBroker: IEvents) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      this.eventBroker.emit("modal:close");
    });

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.eventBroker.emit("modal:close");
      }
    });
  }

  set content(node: HTMLElement) {
    this.contentElement.replaceChildren(node);
  }

  open(): void {
    this.container.classList.add("modal_active");
    this.isOpen = true;
    this.eventBroker.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.isOpen = false;
  }
}