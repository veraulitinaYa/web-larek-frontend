import { IOrderData } from "../types";

type TOrderPaymentAddressForm = {
  paymentType: string;
  address: string;
};

type TOrderContactsForm = {
  email: string;
  phone: string; // именно так в форме
};

export class OrderInfoAggregator implements IOrderData {
  private data: {
    paymentType?: string;
    address?: string;
    email?: string;
    telephone?: string; // внутри всегда telephone
  } = {};

  // ===== Методы для работы с оплатой и адресом =====
  setPaymentData(payload: TOrderPaymentAddressForm) {
    this.data.paymentType = payload.paymentType;
    this.data.address = payload.address;
  }

  // ===== Методы для работы с email + phone =====
  setContactsData(payload: TOrderContactsForm) {
    this.data.email = payload.email;
    this.data.telephone = payload.phone; // маппим phone → telephone
  }

  // ===== Реализация интерфейса IOrderData =====
  getPaymentType(): string {
    return this.data.paymentType;
  }

  setPaymentType(paymentType: string): void {
    this.data.paymentType = paymentType;
  }

  getAddress(): string {
    return this.data.address;
  }

  setAddress(address: string): void {
    this.data.address = address;
  }

  getEmail(): string {
    return this.data.email;
  }

  setEmail(email: string): void {
    this.data.email = email;
  }

  getTelephone(): string {
    return this.data.telephone;
  }

  setTelephone(telephone: string): void {
    this.data.telephone = telephone;
  }

  clearData(): void {
    this.data = {};
  }

  validateData(): boolean {
    return Boolean(this.data.paymentType && this.data.address && this.data.email && this.data.telephone);
  }

  // удобно отдать все данные одной пачкой
  getData() {
    return this.data;
  }
}