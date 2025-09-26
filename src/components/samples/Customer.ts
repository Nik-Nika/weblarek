import { ICustomer } from "../../types";
import { IEvents } from "../base/Events";

export class Customer implements ICustomer {
  private _email: string;
  private _phone: string;
  private _address: string;
  private _payment: "cash" | "card" | "";

  constructor(
    private _eventBroker: IEvents,
    payment: "cash" | "card" | "" = "",
    address: string = "",
    email: string = "",
    phone: string = ""
  ) {
    this._email = email;
    this._address = address;
    this._phone = phone;
    this._payment = payment;
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
    this._eventBroker.emit("user:changed");
  }

  set phone(value: string) {
    this._phone = value;
    this._eventBroker.emit("user:changed");
  }

  set email(value: string) {
    this._email = value;
    this._eventBroker.emit("user:changed");
  }

  set address(value: string) {
    this._address = value;
    this._eventBroker.emit("user:changed");
  }

  set payment(value: "cash" | "card" | "") {
    this._payment = value;
    this._eventBroker.emit("user:changed");
  }

  clearInfo(): void {
    this._email = "";
    this._address = "";
    this._phone = "";
    this._payment = "";
    this._eventBroker.emit("user:changed");
  }

  isValid(): {
    email: boolean;
    phone: boolean;
    address: boolean;
    payment: boolean;
  } {
    const emailRegex = /.+@.+\..+/;
    const phoneRegex = /\+?\d[\d\s()\-]{8,}/;
    return {
      email: emailRegex.test(this._email.trim()),
      phone: phoneRegex.test(this._phone.trim()),
      address: this._address.trim().length > 2,
      payment: this._payment !== ""
    };
  }

  getOrderValidation(): { valid: boolean; error: string } {
    const v = this.isValid();
    const valid = v.address && v.payment;
    return { valid, error: valid ? "" : "Выберите оплату и введите адрес" };
  }

  getContactsValidation(): { valid: boolean; error: string } {
    const v = this.isValid();
    const valid = v.email && v.phone;
    return { valid, error: valid ? "" : "Введите корректные Email и телефон" };
  }
}