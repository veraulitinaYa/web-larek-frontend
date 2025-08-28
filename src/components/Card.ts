import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/Component';
import { 
  TProductCardMain, 
  TProductCardDescription, 
  TProductIdModalCart 
} from '../types';

type CardType = 'catalog' | 'preview' | 'basket';
type ProductDataType = TProductCardMain | TProductCardDescription | TProductIdModalCart;

export class ProductCard extends Component<ProductDataType> {
  protected events: IEvents;
  protected type: CardType;
  protected cardId: string;

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
    super(element);  // 👈 теперь element хранится в this.container

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
        this.addToCartButton.addEventListener('click', () =>
          this.events.emit('product:add-to-cart', { card: this })
        );
      }
    }

if (type === 'basket') {
  this.cardPrice = this.container.querySelector('.card__price');
  this.basketIndex = this.container.querySelector('.basket__item-index');
  this.deleteButton = this.container.querySelector('.basket__item-delete'); // ← правильный селектор

  if (this.deleteButton) {
    this.deleteButton.addEventListener('click', () => {
      // Всегда эмитим единый формат: { id }
      this.events.emit('product:remove-from-cart', { id: this.id });
    });
  }
}

    if (this.cardImage) {
      // клик по картинке для всех типов
      this.cardImage.addEventListener('click', () =>
        this.events.emit('product:select', { card: this })
      );
    }
  }

  setData(data: ProductDataType, index?: number) {
    this.cardId = data.id;
    this.cardTitle.textContent = data.title;

    if ('image' in data && this.cardImage instanceof HTMLDivElement) {
      this.cardImage.style.backgroundImage = `url(${data.image})`;
    }

    if (this.cardCategory && 'category' in data) {
      this.cardCategory.textContent = data.category;
    }
    if (this.cardPrice && 'price' in data) {
      this.cardPrice.textContent = `${data.price} синапсов`;
    }

    if (this.cardDescription && 'description' in data) {
      this.cardDescription.textContent = data.description;
    }

    if (this.basketIndex && typeof index === 'number') {
      this.basketIndex.textContent = String(index + 1);
    }
  }

  get id() {
    return this.cardId;
  }

  deleteCard() {
    this.container.remove();
  }
}