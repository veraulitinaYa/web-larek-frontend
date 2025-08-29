import { IOrder, IOrderData } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
  private payment: 'card' | 'cash' | '' = '';
  private address: string = '';
  private email: string = '';
  private telephone: string = '';
  private items: string[] = [];
  private total: number = 0;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // --- getters & setters ---
  getPaymentType(): 'card' | 'cash' | '' {
    return this.payment;
  }

  setPaymentType(payment: 'card' | 'cash' | '' ): void {
    this.payment = payment;
    this.events.emit('order:updated', this.getOrder());
  }

  getAddress(): string {
    return this.address;
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('order:updated', this.getOrder());
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('order:updated', this.getOrder());
  }

  getTelephone(): string {
    return this.telephone;
  }

  setTelephone(telephone: string): void {
    this.telephone = telephone;
    this.events.emit('order:updated', this.getOrder());
  }

  getItems(): string[] {
    return this.items;
  }

  setItems(items: string[]): void {
    this.items = items;
    this.events.emit('order:updated', this.getOrder());
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(total: number): void {
    this.total = total;
    this.events.emit('order:updated', this.getOrder());
  }

  // --- utils ---
  clearData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.telephone = '';
    this.items = [];
    this.total = 0;
    this.events.emit('order:cleared');
    this.events.emit('order:updated', this.getOrder());
  }

  validateData(): boolean {
    const isPaymentValid =
      this.payment === 'card' || this.payment === 'cash';
    const areFieldsFilled =
      this.address.trim() !== '' &&
      this.email.trim() !== '' &&
      this.telephone.trim() !== '' &&
      this.items.length > 0 &&
      this.total > 0;

    return isPaymentValid && areFieldsFilled;
  }

  // --- финальная сборка заказа ---
  getOrder(): IOrder {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.telephone,
      items: this.items,
      total: this.total,
    };
  }
}