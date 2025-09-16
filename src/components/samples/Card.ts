import { IProduct } from "../../types";

export class Cart {
  private _productsList: IProduct[];

  constructor(productsList: IProduct[] = []) {
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
  }

  deleteProduct(productId: string): void {
    this._productsList = this._productsList.filter((p) => p.id !== productId);
  }

  isExist(productId: string): boolean {
    return this._productsList.some((n) => n.id === productId);
  }
}