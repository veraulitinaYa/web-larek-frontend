export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export interface IOrder {
  paymentType: string;
  address: string;
  email: string;
  telephone: string;
}

export interface IStore{
  products: IProduct[]; 
  previewSelectedProductId: string | null;
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
  getPaymentType(paymentType: string): void;
  setPaymentType(paymentType: string): void;
  getAddress(): string;
  setAddress(address: string): void;
  getEmail(): string;
  setEmail(email: string): void;
  getTelephone(): string;
  setTelephone(telephone: string): void;
  clearData(): void;
  validateData(): boolean;
}

export type TProductCardMain = Pick<IProduct, 'id' | 'title' | 'image' | 'category' | 'price'>;
export type TProductIdModalCart = Pick<IProduct, 'id' >;
export type TProductCardCart = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TOrderPaymentAddressForm = Pick<IOrder, 'paymentType' | 'address'>;
export type TOrderEmailTelephoneForm = Pick<IOrder, 'email' | 'telephone'>;
export type TFinalizeOrderModal = Pick<ICart, 'totalCost'>; 