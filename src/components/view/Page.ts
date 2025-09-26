import { IGallery } from "../../types";
import { Component } from "../base/Component";

export class Page extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  lock() {
    this.container.classList.add("page__wrapper_locked");
  }

  unlock() {
    this.container.classList.remove("page__wrapper_locked");
  }
}