import { ICustomer } from "../../types";

export class Customer implements ICustomer {
  private _email: string;
  private _phone: string;
  private _address: string;
  private _payment: "cash" | "card" | "";

  constructor(
    payment: "cash" | "card" | "",
    address: string,
    email: string,
    phone: string
  ) {
    this._email = email ?? "";
    this._address = address ?? "";
    this._phone = phone ?? "";
    this._payment = payment ?? "";
  }

  get userInfo(): ICustomer {
    return {
      email: this._email,
      phone: this._phone,
      address: this._address,
      payment: this._payment
    };
  }

  set userInfo(info: ICustomer) {
    this._email = info.email;
    this._address = info.address;
    this._phone = info.phone;
    this._payment = info.payment;
  }

  set phone(value: string) {
    this._phone = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set address(value: string) {
    this._address = value;
  }

  set payment(value: "cash" | "card" | "") {
    this._payment = value;
  }

  clearInfo(): void {
    this._email = "";
    this._address = "";
    this._phone = "";
    this._payment = "";
  }

  isValid(): {
    email: boolean;
    phone: boolean;
    address: boolean;
    payment: boolean;
  } {
    return {
      email: this._email.trim() !== "",
      phone: this._phone.trim() !== "",
      address: this._address.trim() !== "",
      payment: this._payment !== ""
    };
  }
}