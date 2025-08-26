import { IOrder, IOrderData } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
    private paymentType: 'card' | 'cash' | '' = '';
    private address: string = '';
    private email: string = '';
    private telephone: string = '';
    private events: IEvents;

 constructor(events: IEvents) {
    this.events = events;
 }

    // Получение и установка типа оплаты
    getPaymentType(): 'card' | 'cash' | '' {
        return this.paymentType;
    }
    setPaymentType(paymentType: 'card' | 'cash'): void {
        this.paymentType = paymentType;
        this.events.emit('order:paymentTypeChanged', paymentType as any);
        this.events.emit('order:updated', this.getOrder());
    }

    // Получение и установка адреса
    getAddress(): string {
        return this.address;
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('order:addressChanged', address as any);
        this.events.emit('order:updated', this.getOrder());
    }

    // Получение и установка email
    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('order:emailChanged', email as any);
        this.events.emit('order:updated', this.getOrder());
    }

    // Получение и установка телефона
    getTelephone(): string {
        return this.telephone;
    }

    setTelephone(telephone: string): void {
        this.telephone = telephone;
        this.events.emit('order:telephoneChanged', telephone as any);
        this.events.emit('order:updated', this.getOrder());
    }

    // Очистка всех данных
    clearData(): void {
        this.paymentType = '';
        this.address = '';
        this.email = '';
        this.telephone = '';
        this.events.emit('order:cleared');
        this.events.emit('order:updated', this.getOrder());

    }

    // Простая валидация: проверка, что все поля заполнены
    validateData(): boolean {
        const isPaymentValid = this.paymentType === 'card' || this.paymentType === 'cash';
        const areFieldsFilled =
            this.address.trim() !== '' &&
            this.email.trim() !== '' &&
            this.telephone.trim() !== '';

        return isPaymentValid && areFieldsFilled;
    }

    // Метод для получения полного объекта заказа (опционально)
    getOrder(): IOrder {
        return {
            paymentType: this.paymentType,
            address: this.address,
            email: this.email,
            telephone: this.telephone,
        };
    }
}