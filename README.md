# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

В приложении используется архитектура <b>MVP</b> (Model-View-Presenter).
Как и требует модель, код делится на три основные части. 

<b>Слой/модель данных</b> отвечает за обработку, хранение и управление данными. Элементы этого слоя самостоятельны и не зависят от отображения или презентера.
<b>Слой представления/отображения</b> - это пользовательский интерфейс. От отвечает за отображение данных. 
<b>Презентер</b> отвечает за связь данных и представления.

В приложении используется событийно-ориентированный подход. Слои взаимодействуют через события. Слой/модель данных инициализирует события. Слушатели событий передают данные модели в слой отображения.

Также описаны данные и типы данных, используемые в приложении. Они выделены в раздел <b>Данные и типы данных, используемые в приложении</b>. Их будут имплементировать классы модели данных.

Также описаны классы, которые поддерживают функциональность приложения. Они выделены в раздел <b>Базовый код</b>.



## Данные и типы данных, используемые в приложении

<b>Продукт:</b>

```
interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}
```

<b>Заказ: </b>

```
interface IOrder {
  paymentType: string;
  address: string;
  email: string;
  telephone: string;
}
```

<b>Коллекция продуктов, доступных в магазине:</b>

``` 
interface IStore {
  products: IProduct[]; 
  previewSelectedProductId: string | null;
} 
```


<b>Коллекция продуктов, помещенных в корзину:</b>
``` 
interface ICart {
  products: IProduct[];
  totalCost: number;
}
```

<b>Модель данных коллекции товаров, доступных в магазине:</b>

```
interface IStoreData{
  getCatalog(): IProduct[];
  fillCatalog(products: IProduct[]): void;
}
```

<b>Модель данных коллекции продуктов, помещенных в корзину:</b>
``` 
interface ICartData{
  addProduct(product: TProductIdModalCart): void;
  deleteProduct(product: TProductIdModalCart): void;
  getTotalCost(): number;
}
```

<b>Модель данных заказа:</b>

```
interface IOrderData {
  choosePaymentType(paymentType: string): void;
  getAddress(): string;
  getEmail(): string;
  getTelephone(): string;
  clearData(): void;
  validateData(): boolean;
}
```




<b>Данные карточки продукта, отображающиеся на главной странице:</b>
```
type TProductCardMain = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>;
```
<b>Данные карточки продукта для отображения в превью:</b>
```
type TProductCardModalPreview = Pick<IProduct, 'id' >;
```
<b>Данные карточки продукта, отображающиеся в строке корзины:</b>
```
type TProductCardCart = Pick<IProduct, 'id' | 'title' | 'price'>;
```

<b>Данные заказа, отображающиеся в корзине:</b>
```
type TOrderCartContents = Pick<IOrder, 'orderList'>;
```
<b>Данные заказа, вносимые в форму, которая принимает тип платежа и адрес: </b>
```
type TOrderPaymentAddressForm = Pick<IOrder, 'paymentType' | 'address'>;
```
<b>Данные заказа, вносимые в форму, которая принимает email и телефон: </b>
```
type TOrderEmailTelephoneForm = Pick<IOrder, 'email' | 'telephone'>;
```
<b>Данные заказа, выводящиеся в закрывающем модальном окне после успешного заказа:</b>
```
export type TFinalizeOrderModal = Pick<ICartData, 'totalCost'>;
```

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. 

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

Поля:
- `readonly baseUrl: string` - базовый URL API.

Методы: 
- `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponseprotected handleResponse(response: Response): Promise<object>` - выполняет обработку ответов от сервера после HTTP-запросов.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Конструктор:
- `constructor()` - конструктор не принимает данные, создает хранилище событий.

Методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` - подписка на событие.
- `off(eventName: EventName, callback: Subscriber): void` - отписка от события.
- `emit<T extends object>(eventName: string, data?: T): void` - инициализация события. 
- `onAll(callback: (event: EmitterEvent) => void): void` - подписка на все события.
- `offAll(): void` - очищает все подписки на события.
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` - создание функции, которая при вызове автоматически генерирует событие с определенными настройками

### Слой/модель данных
#### Класс ProductData
Класс отвечает за хранение и логику работы с данными карточек товара.

Конструктор:
- `constructor(eventEmitter: IEvents)` - принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

- `productList: IProduct[]` - массив объектов карточек товара.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

#### Класс StoreData
Класс отвечает за хранение и логику работы с данными магазина.

Конструктор:
- `constructor(eventEmitter: IEvents)` - принимает инстанс брокера событий.

Класс предоставляет набор методов для взаимодействия с данными магазина:

- `getCatalog(): IProduct[];` - возвращает каталог продуктов магажина.
- `fillCatalog(products: IProduct[]): void` - получает каталог продуктов с сервера.

#### Класс CartData
Класс отвечает за хранение и логику работы с данными товаров в корзине.

Конструктор:
- `constructor(eventEmitter: IEvents)` - принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

- `products: TProductIdModalCart[]` - массив карточек товара в корзине.
- `totalCost: number` - сумма стоимости товаров в корзине.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Класс предоставляет набор методов для взаимодействия с данными магазина:

- `addProduct(product: TProductIdModalCart): void` - добавить продукт в корзину. 
- `deleteProduct(product: TProductIdModalCart): void` - удалить продукт из корзины. 
- `calculateTotalCost(): void` - посчитать суммарную стоимость товаров в корзине.
- `setTotalCost(): number` - записать полную стоимость всех товаров.
- `getTotalCost(): number` - получить суммарную стоимость всех товаров в корзине. 
- `clearCart(): void` - очистить корзину. 
- `getCart(): ICart` - получить массив товаров в корзине. 

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.

Конструктор:
- `constructor(eventEmitter: IEvents)` - принимает инстанс брокера событий.

В полях класса хранятся следующие данные:
- `paymentType: string` - тип оплаты.
- `address: string`- адрес.
- `email: string` - почта.
- `telephone: string` - номер телефона.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Класс предоставляет набор методов для взаимодействия с данными заказа:
- `getPaymentType(paymentType: string): void` - получить тип оплаты.
- `setPaymentType(paymentType: string): void` - записать тип оплаты.
- `getAddress(): string` - получить адрес.
- `setAddress(address: string): void` - записать адрес.
- `getEmail(): string` - получить почту.
- `setEmail(email: string): void` - записать почту.
- `getTelephone(): string` - получить номер телефона.
- `setTelephone(telephone: string): void` - записать номер телефона.
- `clearData(): void` - очистить данные.
- `validateData(): boolean` - валидировать данные.

### Слой представления/отображения
Все классы представления отвечают за отображение внутри контейнера передаваемых в них данных.



#### Класс Modal
Реализует модальное окно. Служит родителем для специфичных модальных окон.

Конструктор:
- `constructor(container: HTMLElement, events: IEvents)` Принимает `container`, в котором будет разметка содержимого модального окна и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `modal: HTMLElement` - элемент модального окна.
- `events: IEvents` - брокер событий.

Методы:
- `open(): void` - позволяет управлять открытием модального окна.
- `close(): void` - позволяет установить действия, которые происходят при азкрытии окна, а также установить слушатели на клик на оверлей и на кнопку-крестик для закрытия модального окна.


#### Класс Card

Предназначен для реализации карточек, необходимых для главной страницы.

Конструктор:
- `constructor(cardTemplate: HTMLElement, productData: TProductCardMain, events: IEvents)` - принимает `container`, который будет показывать карточки, данные продуктов для отображения на главной странице и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `id: string` - id продукта.
- `title: string` - элемент карточки с названием продукта.
- `image: string` - элемент карточки с изображением продукта.
- `category: string` - элемент карточка с категорией продукта.
- `price: number` - элемент карточки с ценой продукта.

Методы класса:
- `renderCard(): void` - отображает полученные данные в карточках.
- `returnCards(): Card[]` - возвращает массив карточек.

#### Класс Store
Реализует отображение массива карточек на странице магазина.

Конструктор:
- `constructor(container: HTMLElement, cards: Card[], events: IEvents)` - принимает html-элемент, который нужно наполнить карточками, массив карточек продуктов, которые нужно показать на главной странице, и брокер событий.

Поля класса:
- `modal: HTMLElement` - контейнер для карточек.
- `events: IEvents` - брокер событий.

Методы класа:
- `fillCatalog(products: Card[]): void` - заполнить контейнер для карточек карточками.

#### Класс ModalWithCardPreview

Расширяет класс Modal. Предназначен для реализации модального окна, которое показывает подробности товара. 

Конструктор:
- `constructor(container: HTMLElement, productData: IProductIdModalCart, events: IEvents)` - принимает `container`, в котором будет разметка содержимого модального окна, выбранную карточку, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `id: string` - id продукта.
- `title: string` - элемент карточки с названием продукта.
- `description: string` - элемент карточки с описанием продукта.
- `image: string` - элемент карточки с изображением продукта.
- `category: string` - элемент карточка с категорией продукта.
- `price: number` - элемент карточки с ценой продукта.

Методы:
- `render(): void` - отображает карточку в модальном окне.
- `handleAddToCart(event: Event): void` - Обработчик нажания на кнопку "Добавить в корзину".


#### Класс ModalFinalizeOrder
Расширяет класс Modal. Предназначен для реализации модального окна финализации заказа.

Конструктор:
- `constructor(container: HTMLElement, productData: TFinalizeOrderModal, events: IEvents)` - принимает `container`, в котором будет разметка содержимого модального окна, информацию о финализации заказа, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `orderTotal: number` - хранит сумму заказа.
- `submitButton: HTMLButtonElement` - кнопка подтверждения.

Методы класа:
- `render():` - отображает данные финализации заказа. 
- `handleSubmit(event: Event): void` - обработать нажатие кнопки подтверждения.

#### Класс ModalWithForm
Расширяет класс Modal. Предназначен для реализации модального окна с формами.

Конструктор:
- `constructor(container: HTMLElement, form: Form, events: IEvents)` - принимает модальное окно, которое будет показывать форму, форму, которая будет отображаться в модальном окне, и экземпляр класса `EventEmitter` для возможности инициации событий.

Методы класса:
- `showForm: void` - показать форму в модальном окне.
- `handleSubmit(event: Event): void` - обработать нажатие кнопки подтверждения.

#### Класс Form
Реализует форму. Иницилизирует событие, оповещающее об изменении полей. Отправляет данные в модель по нажатию кнопки sumbit. Изменят состояние кнопки sumbit, в зависимости от валидности полей.

Конструктор:
- `constructor(events: IEvents)` - принимает экземпляр класса `EventEmitter` для возможности инициации событий.


Поля класса:
- `_submit: HTMLButtonElement` - кнопка отправки данных формы
- `_errors: HTMLElement` - элемент, в котором отображаются ошибки при не валидности полей

Методы:
- `onInputChange(field: keyof T, value: string)` - защещенной метод. Инициализирует событие, при котором передаются данный поля и введенных в него данных.
- `validateForm(): void` - валидация формы.

#### Класс FormPaymentAddress

Расширяет класс Form. Реализует форму заказа с выбором оплаты и введением адреса. 

Конструктор:
- `constructor(orderData: TOrderPaymentAddressForm, events: IEvents)` - принимает объект данных о заказе, которые потребуется сохранить, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `paymentButtonOnline: HTMLButtonElement` - оплата онлайн.
- `paymentButtonOnReception: HTMLButtonElement` - оплата при получении.
- `selectedPayment: string` - переменная, хранящая выбранный метод оплаты.
- `address: string` - переменная, хранящая адрес.

Методы:
- `setPaymentType: string` - записать тип оплаты.
- `setAddress: string` - записать адрес.

#### Класс FormEmailPhone
Расширяет класс Form. Реализует форму заказа. Устанавливает значение полей. 

- `constructor(orderData: TOrderEmailTelephoneForm, events: IEvents)` - принимает объект данных о заказе, которые потребуется сохранить, и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `email: string` - переменная, хранящая email.
- `phone: string` - переменная, хранящая телефон.

Методы:
- `setEmail: string` - записать email.
- `setPhone: string` - записать телефон.

#### Класс CartModal
Расширяет класс Modal. Предназначен для реализации модального окна корзины.

Конструктор:
- `constructor(container: HTMLElement, productData:TProductCardCart[], events: IEvents)` - модальное окно, которое будет показывать содержимое корзины, список продуктов, отобранных в корзину,  и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `products: TProductCardCart[]` - показывает массив карточек продуктов.
- `totalCost: number` - показывает общую стоимость.
- `orderButton: HTMLButtonElement` - показывает кнопку заказа.

Методы: 
- `renderCart(): void` - отображает содержимое корзины.
- `handleOrderButton(): void` - обрабатывает нажатие кнопки заказа.

### Презентер

Так как приложение сравнительно небольшое, отдельный компонент для презентера не создается. Код, отвечающий за взаимодействие отображения и данных помещен в index.ts.

#### Класс LarekApi
Позволяет взаимодействовать с сервером.
Используется событийно-ориентированный подход.

Конструктор:
- `constructor(private api: Api)` - принимает инстанс класса Api.

В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.
