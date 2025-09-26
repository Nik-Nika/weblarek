import { ensureElement } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class CartPreviewCard extends BaseCard {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete?: (id: string) => void) {
    super(container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    if (onDelete) {
      this.deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(this.container.id);
      });
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}