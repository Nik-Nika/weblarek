import { ensureElement, toCdnImage, applyCategoryClass } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class GalleryCard extends BaseCard {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onSelect?: (id: string) => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if (onSelect) {
      this.container.addEventListener("click", (e) => {
        e.preventDefault();
        onSelect(this.container.id);
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
}