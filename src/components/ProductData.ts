import { IEvents } from './base/events';
import { IProduct, IStore, IStoreData} from '../types';

export class ProductData implements IProduct{
    private events: IEvents;
     id: string;
    title: string;
     description: string;
     image: string;
     category: string;
     price: number| null;

    constructor(productData: IProduct, events: IEvents) {
        
        this.id = productData.id;
        this.title = productData.title;
        this.description = productData.description;
        this.image = productData.image;
        this.category = productData.category;
        this.price = productData.price ?? null;
    }}

