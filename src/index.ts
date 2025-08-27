import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { CartData } from './components/CartData';
import { OrderData } from './components/OrderData';
import { StoreData } from './components/StoreData';
import { ProductCard } from './components/Card';
import { IApi, IProduct, IStore, IOrder, ICart, TOrderEmailTelephoneForm, TOrderPaymentAddressForm, TProductIdModalCart, TProductCardMain, TProductCardDescription } from './types';
import { ProductData } from './components/ProductData';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { LarekApi } from './components/LarekApi';






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

// const events: IEvents = new EventEmitter();


// const catalog = document.querySelector('.catalog');
// const cartContainer = document.querySelector('.cart');
// const orderContainer = document.querySelector('.order');

// // достать карточки с сервера
// // отображить массив в контейнере

// console.log(someProducts.includes(product3));

// const store = new StoreData(events, someProducts);
// console.log(store.getCatalog());

// const order = new OrderData(events);
// order.setAddress('abc');
// console.log(order.getAddress());


// const cart = new CartData(events);
// cart.addProduct(product);
// cart.addProduct(product2);
// cart.addProduct(product3);
// console.log(cart.getCart());


const baseApi: IApi = new Api(API_URL, settings);
const larekApi = new LarekApi(baseApi);

//test1 модели
larekApi.getProducts().then(console.log);



//test2 модели
async function loadSecondProduct() {
  const store: IStore = await larekApi.getProducts();

  console.log("Второй продукт:", store.products[1]);
}

loadSecondProduct();

//getproductbyid модели
async function loadSecondProductById() {
  const store: IStore = await larekApi.getProducts();

  if (!store.products[1]) {
    console.error("В массиве нет второго продукта");
    return;
  }
  const secondProductId = store.products[1].id;
  const product = await larekApi.getProductById(secondProductId);
  console.log("Второй продукт по id:", product);
}

loadSecondProductById();

//тестирование API
const paymentAddress: TOrderPaymentAddressForm = {
  paymentType: 'online',
  address: 'Spb Vosstania 1'
};

const contact: TOrderEmailTelephoneForm = {
  email: 'test@test.ru',
  telephone: '+71234567890'
};

const cart: ICart = {
  products: [
    { id: '854cef69-976d-4c2a-a18c-2aa45046c390', title: 'Товар 1', price: 1200 },
    { id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9', title: 'Товар 2', price: 1000 }
  ],
  totalCost: 2200
};

larekApi.submitOrder(paymentAddress, contact, cart)
  .then(res => {
    console.log('Заказ подтверждён:', res.id, 'Сумма:', res.total);
  })
  .catch(err => {
    console.error('Ошибка при оформлении заказа:', err);
  });


  //
//   // Допустим, у нас есть массив продуктов
// const catalogProducts: TProductCardMain[] = [
//   { id: '1', title: 'Товар 1', image: 'img1.jpg', category: 'софт-скил', price: 750 },
//   { id: '2', title: 'Товар 2', image: 'img2.jpg', category: 'другое', price: 1200 }
// ];

// const previewProduct: TProductCardDescription = {
//   id: '2',
//   title: 'Товар 2',
//   description: 'Описание товара для превью',
//   image: 'img2.jpg',
//   category: 'другое',
//   price: 1200
// };

// const basketProducts: TProductIdModalCart[] = [
//   { id: '1', title: 'Товар 1', price: 750 },
//   { id: '2', title: 'Товар 2', price: 1200 }
// ];

// // Объект событий
// const events: IEvents = {
//   emit: (event: string, data?: any) => console.log('Событие:', event, data)
// };

// // ======= Каталог =======
// const catalogContainer = document.querySelector('.catalog-container');

// catalogProducts.forEach(productData => {
//   const template = document.getElementById('card-catalog') as HTMLTemplateElement;
//   const card = new ProductCard(template, 'catalog', events);
//   card.setData(productData);
//   catalogContainer.appendChild(card.render());
// });

// // ======= Превью =======
// const previewContainer = document.querySelector('.preview-container');
// const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
// const previewCard = new ProductCard(previewTemplate, 'preview', events);
// previewCard.setData(previewProduct);
// previewContainer.appendChild(previewCard.render());

// // ======= Корзина =======
// const basketContainer = document.querySelector('.basket-container');

// basketProducts.forEach((productData, index) => {
//   const template = document.getElementById('card-basket') as HTMLTemplateElement;
//   const card = new ProductCard(template, 'basket', events);
//   card.setData(productData, index);
//   basketContainer.appendChild(card.render());
// });



//const testButton = document.getElementById('test-card') as HTMLElement;
// if (testButton) {
//   testButton.addEventListener('click', () => {
//     testSection.classList.toggle('active');
//   });
// }
const testSection = document.querySelector('.gallery');
const events: IEvents = new EventEmitter();
const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

const card = new ProductCard(cardTemplate, 'basket', events);
card.setData(someProducts[1], 0);

testSection.appendChild(card.render());



//
// events.on('product:select', (card) => {
//   console.log('Открыть превью для:', card.id);

//   // создаём карточку-превью
//   const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
//   const previewCard = new ProductCard(previewTemplate, 'preview', events);

//   previewCard.setData({
//     id: card.id,
//     title: 'Тестовый товар',
//     description: 'Описание товара',
//     image: 'https://via.placeholder.com/150',
//     category: 'Категория',
//     price: 1000
//   });

//   // допустим, показываем в модалке
//   document.body.appendChild(previewCard.render());
// });