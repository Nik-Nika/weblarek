import { IProduct } from "../../types";

export class Catalog {
  private _productsList: IProduct[];
  private _selectedProduct: IProduct | null = null;

  constructor(productsList: IProduct[] = []) {
    this._productsList = productsList;
  }

  get products(): IProduct[] {
    return this._productsList;
  }

  set products(productsList: IProduct[]) {
    this._productsList = productsList;
  }

  get selectedProduct(): IProduct | null {
    return this._selectedProduct;
  }

  set selectedProduct(product: IProduct | null) {
    this._selectedProduct = product;
  }

  getProductById(id: string): IProduct | undefined {
    return this._productsList.find((p) => p.id === id);
  }
}