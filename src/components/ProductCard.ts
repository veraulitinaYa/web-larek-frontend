import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/Component';
import { 
  TProductCardMain, 
  TProductCardDescription, 
  TProductIdModalCart 
} from '../types';
import { CDN_URL } from '../utils/constants';

type CardType = 'catalog' | 'preview' | 'basket';
type ProductDataType = TProductCardMain | TProductCardDescription | TProductIdModalCart;

export class ProductCard extends Component<ProductDataType> {
  protected events: IEvents;
  protected type: CardType;
  protected cardId: string;

  // состояние
  protected inCart: boolean = false;

  // общие элементы
  protected cardTitle: HTMLElement;
  protected cardImage: HTMLImageElement | HTMLDivElement;

  // элементы для catalog и preview
  protected cardCategory?: HTMLElement;
  protected cardPrice?: HTMLElement;

  // элементы только для preview
  protected cardDescription?: HTMLElement;
  protected addToCartButton?: HTMLButtonElement;

  // элементы только для basket
  protected basketIndex?: HTMLElement;
  protected deleteButton?: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, type: CardType, events: IEvents) {
    const element = cloneTemplate<HTMLElement>(template);
    super(element);

    this.events = events;
    this.type = type;

    // общие элементы
    this.cardTitle = this.container.querySelector('.card__title');
    this.cardImage = this.container.querySelector('.card__image');

    if (type === 'catalog') {
      this.cardCategory = this.container.querySelector('.card__category');
      this.cardPrice = this.container.querySelector('.card__price');
    }

    if (type === 'preview') {
      this.cardCategory = this.container.querySelector('.card__category');
      this.cardPrice = this.container.querySelector('.card__price');
      this.cardDescription = this.container.querySelector('.card__text');
      this.addToCartButton = this.container.querySelector('.card__button');

      if (this.addToCartButton) {
        this.addToCartButton.addEventListener('click', () => {
          if (this.inCart) {
            this.events.emit('product:remove-from-cart', { id: this.id });
          } else {
            this.events.emit('product:add-to-cart', { card: this });
          }
        });
      }

      // следим за обновлением корзины
this.events.on<{ cart: TProductCardMain[]; totalCost: number }>(
  'cart:updated',
  ({ cart }) => {
    const inCart = cart.some((p: TProductCardMain) => p.id === this.id);
    this.updateButtonState(inCart);
  }
);
    }

    if (type === 'basket') {
      this.cardPrice = this.container.querySelector('.card__price');
      this.basketIndex = this.container.querySelector('.basket__item-index');
      this.deleteButton = this.container.querySelector('.basket__item-delete');

      if (this.deleteButton) {
        this.deleteButton.addEventListener('click', () => {
          this.events.emit('product:remove-from-cart', { id: this.id });
        });
      }
    }

    if (this.cardImage) {
      this.cardImage.addEventListener('click', () =>
        this.events.emit('product:select', { card: this })
      );
    }
  }

setData(data: ProductDataType, index?: number, inCart: boolean = false) {
  this.cardId = data.id;
  this.cardTitle.textContent = data.title;

    if ('image' in data && this.cardImage instanceof HTMLImageElement) {
      console.log(data.image);
      this.cardImage.src = `${CDN_URL}${data.image}`;
    }

    if (this.cardCategory && 'category' in data) {
      this.cardCategory.textContent = data.category;
    }

    if (this.cardPrice && 'price' in data) {
      if (data.price == null) {
        this.cardPrice.textContent = 'Бесценно';

        if (this.addToCartButton) {
          this.addToCartButton.disabled = true;
          this.addToCartButton.textContent = 'Недоступно';
        }
      } else {
        this.cardPrice.textContent = `${data.price} синапсов`;

        if (this.addToCartButton) {
          this.addToCartButton.disabled = false;
          this.updateButtonState(this.inCart);
        }
      }
    }

    if (this.cardDescription && 'description' in data) {
      this.cardDescription.textContent = data.description;
    }

    if (this.basketIndex && typeof index === 'number') {
      this.basketIndex.textContent = String(index + 1);
    }

      if (this.addToCartButton && data.price != null) {
    this.updateButtonState(inCart);
  }
  }

  protected updateButtonState(inCart: boolean) {
    this.inCart = inCart;
    if (this.addToCartButton) {
      if (inCart) {
        this.addToCartButton.textContent = 'Удалить из корзины';
      } else {
        this.addToCartButton.textContent = 'В корзину';
      }
    }
  }

  get id() {
    return this.cardId;
  }

  deleteCard() {
    this.container.remove();
  }
}
