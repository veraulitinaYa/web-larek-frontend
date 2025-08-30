import { IOrder, IOrderData } from "../types";

type TOrderPaymentAddressForm = {
  paymentType: 'card' | 'cash' | '';
  address: string;
};

type TOrderContactsForm = {
  email: string;
  phone: string; // именно так приходит из формы
};

export class OrderInfoAggregator implements IOrderData {
  private data: {
    payment: 'card' | 'cash' | '';
    address: string;
    email: string;
    telephone: string;
    items: string[];
    total: number;
  } = {
    payment: '',
    address: '',
    email: '',
    telephone: '',
    items: [],
    total: 0,
  };

  // ===== Методы для удобного заполнения =====
  setPaymentData(payload: TOrderPaymentAddressForm) {
    this.data.payment = payload.paymentType;
    this.data.address = payload.address;
  }

  setContactsData(payload: TOrderContactsForm) {
    this.data.email = payload.email;
    this.data.telephone = payload.phone; // маппим phone → telephone
  }

  // ===== Реализация интерфейса IOrderData =====
  getPaymentType(): 'card' | 'cash' | '' {
    return this.data.payment;
  }

  setPaymentType(payment: 'card' | 'cash' | ''): void {
    this.data.payment = payment;
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

  getItems(): string[] {
    return this.data.items;
  }

  setItems(items: string[]): void {
    this.data.items = items;
  }

  getTotal(): number {
    return this.data.total;
  }

  setTotal(total: number): void {
    this.data.total = total;
  }

  clearData(): void {
    this.data = {
      payment: '',
      address: '',
      email: '',
      telephone: '',
      items: [],
      total: 0,
    };
  }

  validateData(): boolean {
    return (
      (this.data.payment === 'card' || this.data.payment === 'cash') &&
      this.data.address.trim() !== '' &&
      this.data.email.trim() !== '' &&
      this.data.telephone.trim() !== '' &&
      this.data.items.length > 0 &&
      this.data.total > 0
    );
  }

  getOrder(): IOrder {
    return {
      payment: this.data.payment,
      address: this.data.address,
      email: this.data.email,
      phone: this.data.telephone,
      items: this.data.items,
      total: this.data.total,
    };
  }

  // Дополнительно — удобно отдать «сырые» данные
  getData() {
    return this.data;
  }
}