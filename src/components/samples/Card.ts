import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Card {
  private _productsList: IProduct[];

  constructor(private _eventBroker: IEvents, productsList: IProduct[] = []) {
    this._productsList = productsList;
  }

  get products(): IProduct[] {
    return this._productsList;
  }

  get size(): number {
    return this._productsList.length;
  }

  get total(): number {
    return this._productsList.reduce((accum, product) => {
      return (accum += product.price ?? 0);
    }, 0);
  }

  addProduct(product: IProduct): void {
    this._productsList.push(product);
    this._eventBroker.emit("cart:changed");
  }

  deleteProduct(productId: string): void {
    this._productsList = this._productsList.filter((p) => p.id !== productId);
    this._eventBroker.emit("cart:changed");
  }

  isExist(productId: string): boolean {
    return this._productsList.some((n) => n.id === productId);
  }

  clearCart(): void {
    this._productsList = [];
  }
}