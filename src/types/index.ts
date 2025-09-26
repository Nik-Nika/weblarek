export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}
export interface ICustomer {
    payment: "cash" | "card" | "";
    email: string;
    phone: string;
    address: string;
}

export interface IProductsAPIResponse {
    total: number;
    items: IProduct[];
}

export interface IOrder extends ICustomer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IOrderFailed {
    error: string;
}
export interface IModal {
  content: HTMLElement;
}

export interface IHeader {
  counter: number;
}

export interface IGallery {
  items: HTMLElement[];
}

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export interface IBaseCard {
  title: string;
  price: number | null;
  id: string;
}

export interface ICard {
  image: string;
  title: string;
  category: string;
  price: number | null;
  id: string;
}