export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface IOrder {
  payment: 'card' | 'cash' | ''; // варианты оплаты, расширяем при необходимости
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
export interface IStore{
  //total?: number;
  products: IProduct[]; 
  previewSelectedProductId?: string | null;
}

export interface ICart {
  products: TProductIdModalCart[];
  totalCost: number;
}

export interface IStoreData{
  getCatalog(): IProduct[];
  fillCatalog(products: IProduct[]): void;
}


export interface ICartData{
  addProduct(product: TProductIdModalCart): void;
  deleteProduct(product: TProductIdModalCart): void;
  calculateTotalCost(): void;
  setTotalCost(): void;
  getTotalCost(): number;
  clearCart(): void;
  getCart(): ICart;
}


export interface IOrderData {
  getPaymentType(payment: string): void;
  setPaymentType(payment: string): void;
  getAddress(): string;
  setAddress(address: string): void;
  getEmail(): string;
  setEmail(email: string): void;
  getTelephone(): string;
  setTelephone(telephone: string): void;
  getItems(): string[];
  setItems(items: string[]): void;
  getTotal(): number;
  setTotal(total: number): void;
  clearData(): void;
  validateData(): boolean;
  getOrder(): IOrder;
}

export type TProductCardMain = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>;
export type TProductIdModalCart = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TProductCardCart = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TProductCardDescription = Pick<IProduct, 'id' | 'title' | 'description' | 'image' | 'category' | 'price'>;
export type TOrderPaymentAddressForm = Pick<IOrder, 'payment' | 'address'>;
export type TOrderEmailTelephoneForm = Pick<IOrder, 'email' | 'phone'>;
export type TFinalizeOrderModal = Pick<ICart, 'totalCost'>; 
export type TAllDataFromFroms = TOrderPaymentAddressForm & TOrderEmailTelephoneForm;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}