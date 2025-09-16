import {
  IOrder,
  IOrderFailed,
  IOrderResult,
  IProductsAPIResponse
} from "../../types";
import { Api } from "../base/Api";

export class APIManager {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  fetchProducts(): Promise<IProductsAPIResponse> {
    return this._api.get<IProductsAPIResponse>("/product/");
  }

  async submitOrder(order: IOrder): Promise<IOrderResult | IOrderFailed> {
    return await this._api.post<IOrderResult | IOrderFailed>("/order/", order);
  }
}