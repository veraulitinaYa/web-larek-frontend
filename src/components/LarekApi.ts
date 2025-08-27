import { IApi, ICart, IOrder, IProduct, IStore, TOrderEmailTelephoneForm, TOrderPaymentAddressForm } from '../types';
import { ApiListResponse } from './base/api';

export class LarekApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

// ===================
// ПОЛУЧИТЬ ТОВАРЫ  
// ===================

// получить товары из магазина

getProducts(): Promise<IStore> {
  return this._baseApi
    .get<ApiListResponse<IProduct>>('/product')
    .then((res) => ({
      products: res.items,
      //previewSelectedProductId: null
    }));
}

//получить товар по id
	getProductById(id: string): Promise<IProduct> {
		return this._baseApi.get<IProduct>(`/product/${id}`).then((res) => res);
	}

	// ===================
	// РАБОТА С ЗАКАЗОМ
	// ===================

submitOrder(
  paymentAddress: TOrderPaymentAddressForm,
  contact: TOrderEmailTelephoneForm,
  cart: ICart
): Promise<{ id: string; total: number }> {

  //объект для отправки
  const orderToSend = {
    payment: paymentAddress.paymentType,  
    address: paymentAddress.address,
    email: contact.email,
    phone: contact.telephone,          
    total: cart.totalCost,
    items: cart.products.map(p => p.id)
  };

  return this._baseApi.post<{ id: string; total: number }>('/order', orderToSend, 'POST');
} }