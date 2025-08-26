import { ICart, ICartData, TProductIdModalCart } from '../types';
import { IEvents } from './base/events';

export class CartData implements ICart, ICartData {
    public products: TProductIdModalCart[] = [];
    public totalCost: number = 0;
    private events: IEvents

    constructor(events: IEvents) {
    this.events = events;
    }

    addProduct(product: TProductIdModalCart): void {
        const existing = this.products.find(p => p.id === product.id);
        if (!existing) {
            this.products.push(product);
        }
        this.calculateTotalCost();
        this.events.emit("cart:updated", this.getCart());
        this.events.emit("cart:product:added", product); // событие при добавлении товара
    }

    deleteProduct(product: TProductIdModalCart): void {
        this.products = this.products.filter(p => p.id !== product.id);
        this.calculateTotalCost();
        this.events.emit("cart:updated", this.getCart());
        this.events.emit("cart:product:removed", product); // событие при удалении товара
    }

    setTotalCost(): void {
        this.calculateTotalCost();
        this.events.emit("cart:updated", this.getCart());
    }

    calculateTotalCost(): void {
        this.totalCost = this.products.reduce((sum, p) => sum + p.price, 0);
    }

    getTotalCost(): number {
        return this.totalCost;
    }

    clearCart(): void {
        const clearedProducts = [...this.products]; // сохраняем для события
        this.products = [];
        this.totalCost = 0;
        this.events.emit("cart:cleared", clearedProducts);
        this.events.emit("cart:updated", this.getCart());
    }

    getCart(): ICart {
        return {
            products: [...this.products], // возвращаем копию массива
            totalCost: this.totalCost
        };
    }
}