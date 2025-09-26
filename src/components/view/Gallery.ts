import { IGallery } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Gallery extends Component<IGallery> {
  protected list: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.list = ensureElement<HTMLElement>(".gallery");
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}