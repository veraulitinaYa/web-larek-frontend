import { IEvents } from './base/events';
import {IProduct, IStore, IStoreData} from '../types';



export class StoreData implements IStore, IStoreData {
    public products: IProduct[];
    public previewSelectedProductId: string | null = null;
    private events: IEvents;

    constructor(events: IEvents, products: IProduct[]) {
        this.events = events;
        this.products = products;
    }

    getCatalog(): IProduct[] {
        return this.products;
    }

    fillCatalog(products: IProduct[]): void {
        this.products = products;
        //заполнение каталога триггерит событие catalog:updated
        this.events.emit("catalog:updated", this.products);
    }

    setPreviewProduct(productId: string | null): void {
        this.previewSelectedProductId = productId;
        //непонятно, нужно ли это событие
        this.events.emit("preview:changed" , productId as any || null);
    }

    getPreviewProduct(): IProduct | null {
        if (!this.previewSelectedProductId) return null;
        return this.products.find(p => p.id === this.previewSelectedProductId) || null;
    }
}