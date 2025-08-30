import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { CartData } from './components/CartData';
import { StoreData } from './components/StoreData';
import { ProductCard } from './components/ProductCard';
import {
	IApi,
	IProduct,
	IStore,
	IOrder,
  IOrderData,
	ICart,
	TOrderEmailTelephoneForm,
	TOrderPaymentAddressForm,
	TProductIdModalCart,
	TProductCardMain,
	TProductCardDescription,
} from './types';
import { ProductData } from './components/ProductData';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { LarekApi } from './components/LarekApi';
import { CardsContainer } from './components/CardsContainer';
import { CartView } from './components/CartView';
import { PaymentDataAddressForm } from './components/PaymentDataAddressForm';
import { EmailTelephoneForm } from './components/EmailTelephoneForm';
import { SuccessView } from './components/SuccessView';
import { Modal } from './components/common/Modal';
import { OrderData } from './components/OrderData';




//----------------------------------------------------------------------------
// 0 - get entities
//----------------------------------------------------------------------------
const testSection = document.querySelector('.gallery') as HTMLElement;
const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;
const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const cartIcon = document.querySelector('.header__basket') as HTMLElement;
const formOneTemplate = document.getElementById('order') as HTMLTemplateElement;
const formTwoTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const cartCounter = cartIcon.querySelector('.header__basket-counter') as HTMLElement;

//----------------------------------------------------------------------------
// 1 - initialize entities
//----------------------------------------------------------------------------
const baseApi: IApi = new Api(API_URL, settings);
const larekApi = new LarekApi(baseApi);
const events = new EventEmitter();
const modal = new Modal(modalContainer, events);
const cardsContainer = new CardsContainer(testSection);
const basketEl = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cartView = new CartView(basketEl, events);
let store: IStore;
let cart: TProductCardMain[] = []; // логическая корзина




//----------------------------------------------------------------------------
// 2 - subscribe to all events and show them in console
//----------------------------------------------------------------------------

events.onAll(({ eventName, data }) => {
	console.log(`🔥 Event triggered: ${eventName}`, data);
});




//----------------------------------------------------------------------------
// 3 - load catalog and open-card-preview feature.
//----------------------------------------------------------------------------



async function loadCatalog() {
	store = await larekApi.getProducts(); // загружаем каталог

	// создаём карточки каталога

	const cards = store.products.map((product) => {
		const card = new ProductCard(cardTemplate, 'catalog', events);
		card.setData(product);

		// подписка на клик по карточке для открытия превью
		card.element.addEventListener('click', () => {
			const previewCard = new ProductCard(previewTemplate, 'preview', events);

			const inCart = cart.some((p) => p.id === product.id);

			previewCard.setData(product, undefined, inCart); // передаём данные продукта

			modal.renderContent(previewCard);
		});

		return card.render();
	});

	// вставляем карточки на страницу
	cardsContainer.catalog = cards;

	// эмитим событие о загрузке каталога
	events.emit('catalog:loaded', { products: store.products });
}

// запускаем
loadCatalog();





//---------------------------------------------------------------------------
// 4 - create cart
//----------------------------------------------------------------------------



// добавление товара
events.on('product:add-to-cart', ({ card }: { card: ProductCard }) => {
	const product = store.products.find((p) => p.id === card.id);
	if (!product) return;

	cart.push(product);

	const totalCost = cart.reduce((sum, item) => sum + item.price, 0);

	events.emit('cart:updated', { cart, totalCost });
});

// обновление CartView при изменении корзины
events.on<{ cart: TProductCardMain[]; totalCost: number }>(
	'cart:updated',
	({ cart, totalCost }) => {
		cartView.products = cart;
		cartView.totalCost = totalCost;
	}
);





//----------------------------------------------------------------------------
// 5 - открытие корзины
//----------------------------------------------------------------------------
cartIcon.addEventListener('click', () => {
	events.emit('cart:open');
});

events.on('cart:open', () => {
	modal.renderContent(cartView); // тут всегда актуальное содержимое
	modal.open();
});




//----------------------------------------------------------------------------
// 6 - удаление товара из корзины
//----------------------------------------------------------------------------
events.on(
	'product:remove-from-cart',
	(payload: { id?: string; card?: ProductCard }) => {
		const id = payload.id ?? payload.card?.id;
		if (!id) return;
		cart = cart.filter((p) => p.id !== id);
		const totalCost = cart.reduce((s, i) => s + i.price, 0);
		events.emit('cart:updated', { cart, totalCost });
	}
);




//----------------------------------------------------------------------------
// 8 - process product card click event - 'product:select'
//----------------------------------------------------------------------------

events.on('product:select', ({ card }: { card: ProductCard }) => {
	const product = store.products.find((p) => p.id === card.id);
	if (!product) return;

	const previewCard = new ProductCard(previewTemplate, 'preview', events);
	previewCard.setData(product);

	modal.renderContent(previewCard);
});


//---------------------------------------------------------------------------
// 9 - process order
//----------------------------------------------------------------------------

const orderData: IOrderData = new OrderData(events);


events.on('cart:checkout', () => {
	events.emit('order:paymentAddressRequested');


	// const formOneTemplate = document.getElementById(
	// 	'order'
	// ) as HTMLTemplateElement;

	// клонируем содержимое шаблона
	const formNode = formOneTemplate.content.firstElementChild.cloneNode(
		true
	) as HTMLElement;

	// передаем в компонент уже клон, а не template
	const paymentAddressForm = new PaymentDataAddressForm(formNode, events);


  orderData.setItems(cart.map(product => product.id));
    console.log(orderData.getItems());

  const cartItems: string[] = cart.map(p => p.id);
  orderData.setItems(cartItems);

  orderData.setTotal(cart.reduce((s, i) => s + i.price, 0));

	modal.renderContent(paymentAddressForm);
});


//---------------------------------------------------------------------------
// 10 - process payment and address (form one)
//----------------------------------------------------------------------------

events.on(
  'order:paymentAddressEntered',
  ({ paymentType, address }: { paymentType: string; address: string }) => {

	events.emit('order:paymentAddressRequested');
	// const formOneTemplate = document.getElementById(
	// 	'order'
	// ) as HTMLTemplateElement;

	// клонируем содержимое шаблона
	const formNode = formOneTemplate.content.firstElementChild.cloneNode(
		true
	) as HTMLElement;

	// передаем в компонент уже клон, а не template
	const paymentAddressForm = new PaymentDataAddressForm(formNode, events);

    orderData.setPaymentType(paymentType);
    orderData.setAddress(address);



    //const formTwoTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const formNodeTwo = formTwoTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;

    const emailTelephoneForm = new EmailTelephoneForm(formNodeTwo, events);
    modal.renderContent(emailTelephoneForm);
  }
);



//--------------------------------------------------------------------------
// 11 - process email and telephone (form two)
//----------------------------------------------------------------------------


events.on(
  'order:emailTelephoneEntered',
  async ({ email, phone }: { email: string; phone: string }) => {
    orderData.setEmail(email);
    orderData.setTelephone(phone);

    try {
      // сервер вернёт { id, total }

      //const successTemplate = document.getElementById('success') as HTMLTemplateElement;
      const successNode = successTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;

      const successView = new SuccessView(successNode, events);
const result = await larekApi.createOrder(orderData.getOrder()) as { id: string; total: number };

successView.totalCost = result.total;

      modal.renderContent(successView);
      events.emit('order:successful');
    } catch (err) {
      console.error('Ошибка при создании заказа', err);
    }
  }
);

//--------------------------------------------------------------------------
// 12 - process successful order
//--------------------------------------------------------------------------      

events.on('order:successful', () => {
const successConfirmButton = document.querySelector('.order-success__close') as HTMLElement;
successConfirmButton.addEventListener('click', () => {
	events.emit('order:confirmationAvailable');
});

events.on('confirmationAvailable', () => {
	modal.close();
});
});


//--------------------------------------------------------------------------
// 13 - cart counter
//--------------------------------------------------------------------------


events.on<{ cart: TProductCardMain[]; totalCost: number }>(
  'cart:updated',
  ({ cart, totalCost }) => {
    // обновляем саму корзину
    cartView.products = cart;
    cartView.totalCost = totalCost;

    // обновляем счётчик
    cartCounter.textContent = String(cart.length);
  }
);