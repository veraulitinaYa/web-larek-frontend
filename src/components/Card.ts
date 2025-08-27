import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { 
  TProductCardMain, 
  TProductCardDescription, 
  TProductIdModalCart 
} from '../types';

type CardType = 'catalog' | 'preview' | 'basket';
type ProductDataType = TProductCardMain | TProductCardDescription | TProductIdModalCart;

export class ProductCard {
  protected element: HTMLElement;
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
    this.events = events;
    this.type = type;
    this.element = cloneTemplate<HTMLElement>(template);
    //console.log(this.element.outerHTML);

    // общие элементы
    this.cardTitle = this.element.querySelector('.card__title');
    this.cardImage = this.element.querySelector('.card__image');

    if (type === 'catalog') {
      this.cardCategory = this.element.querySelector('.card__category');
      this.cardPrice = this.element.querySelector('.card__price');
    }

    if (type === 'preview') {
      this.cardCategory = this.element.querySelector('.card__category');
      this.cardPrice = this.element.querySelector('.card__price');
      this.cardDescription = this.element.querySelector('.card__text');
      this.addToCartButton = this.element.querySelector('.card__button');
      if (this.addToCartButton) {
        this.addToCartButton.addEventListener('click', () =>
          this.events.emit('product:add-to-cart', { card: this })
        );
      }
    }

    if (type === 'basket') {
      this.cardPrice = this.element.querySelector('.card__price');
      this.basketIndex = this.element.querySelector('.basket__item-index');
      this.deleteButton = this.element.querySelector('.basket__item-delete');
      if (this.deleteButton) {
        //console.log(this.deleteButton);
               this.deleteButton.addEventListener('click', () =>
          this.events.emit('product:remove-from-cart', { card: this })
      );
      }
    }
    if (this.cardImage){
    // клик по картинке для всех типов
    this.cardImage.addEventListener('click', () =>
      this.events.emit('product:select', { card: this })
    );}
  }

  setData(data: ProductDataType, index?: number) {
    this.cardId = data.id;
    this.cardTitle.textContent = data.title;

    // image только если есть
    if ('image' in data && this.cardImage instanceof HTMLDivElement) {
      this.cardImage.style.backgroundImage = `url(${data.image})`;
    }

    // category и price для catalog и preview
    if (this.cardCategory && 'category' in data) {
      this.cardCategory.textContent = data.category;
    }
    if (this.cardPrice && 'price' in data) {
      this.cardPrice.textContent = `${data.price} синапсов`;
    }

    // description только для preview
    if (this.cardDescription && 'description' in data) {
      this.cardDescription.textContent = data.description;
    }

    // индекс только для basket
    if (this.basketIndex && typeof index === 'number') {
      this.basketIndex.textContent = String(index + 1);
    }
  }

  get id() {
    return this.cardId;
  }

  deleteCard() {
    this.element.remove();
    this.element = null;
  }

  render() {
    return this.element;
  }
}