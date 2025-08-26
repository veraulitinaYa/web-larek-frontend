import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { CartData } from './components/CartData';
import { OrderData } from './components/OrderData';
import { StoreData } from './components/StoreData';
import { IProduct } from './types';
import { ProductData } from './components/ProductData';

const product: IProduct = 
    
        {
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        

};

const product2: IProduct= 
    
        {
            "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
            "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
            "image": "/Shell.svg",
            "title": "HEX-леденец",
            "category": "другое",
            "price": 1450

};

const product3: IProduct = {
            "id": "b06cde61-912f-4663-9751-09956c0eed67",
            "description": "Будет стоять над душой и не давать прокрастинировать.",
            "image": "/Asterisk_2.svg",
            "title": "Мамка-таймер",
            "category": "софт-скил",
            "price": null
};


const someProducts = [product, product2];

const events: IEvents = new EventEmitter();


const catalog = document.querySelector('.catalog');
const cartContainer = document.querySelector('.cart');
const orderContainer = document.querySelector('.order');

// достать карточки с сервера
// отображить массив в контейнере

console.log(someProducts.includes(product3));

const store = new StoreData(events, someProducts);
console.log(store.getCatalog());

const order = new OrderData(events);
order.setAddress('abc');
console.log(order.getAddress());


const cart = new CartData(events);
cart.addProduct(product);
cart.addProduct(product2);
cart.addProduct(product3);
console.log(cart.getCart());


