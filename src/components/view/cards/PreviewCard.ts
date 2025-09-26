import { ensureElement, toCdnImage, applyCategoryClass } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class PreviewCard extends BaseCard {
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected actionButton: HTMLButtonElement;
  protected available: boolean = false;

  constructor(container: HTMLElement, onAction?: (id: string) => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    if (onAction) {
      this.actionButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAction(this.container.id);
      });
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, toCdnImage(value));
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    applyCategoryClass(this.categoryElement, value);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inCart(value: boolean) {
    this.available = value;
    this.actionButton.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  set zeroPrice(value: boolean) {
    this.actionButton.textContent = "Недоступно";
    this.actionButton.disabled = value;
  }
}