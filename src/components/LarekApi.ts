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

  createOrder(order: IOrder) {
    return this._baseApi.post('/order', order);
  }

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

 }