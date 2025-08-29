import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ICart, TProductCardMain } from "../types";
import { ProductCard } from "./ProductCard";

export class CartView extends Component<ICart> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected price: HTMLElement;
  protected events: IEvents;
  protected basketTemplate: HTMLTemplateElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.list = this.container.querySelector(".basket__list")!;
    this.button = this.container.querySelector(".basket__button")!;
    this.price = this.container.querySelector(".basket__price")!;

    // шаблон карточки корзины
    this.basketTemplate = document.getElementById("card-basket") as HTMLTemplateElement;

    this.button.addEventListener("click", () => {
      this.events.emit("cart:checkout");
    });

    // Слушаем событие обновления корзины, чтобы всегда синхронизировать кнопку
    this.events.on<{ cart: TProductCardMain[]; totalCost: number }>(
      "cart:updated",
      ({ cart }) => {
        this.updateButtonState(cart);
      }
    );
        const currentCart: ICart = { products: [], totalCost: 0 }; // сюда нужно передать актуальный CartData.getCart() при инициализации
    this.products = currentCart.products as TProductCardMain[];
    this.totalCost = currentCart.totalCost;
  }

  set products(products: TProductCardMain[]) {
    this.list.replaceChildren(
      ...products.map((p, index) => {
        const card = new ProductCard(this.basketTemplate, "basket", this.events);
        card.setData(p, index);
        return card.render();
      })
    );

    if (products.length === 0) {
      const emptyNode = document.createElement("li");
      emptyNode.className = "basket__empty";
      emptyNode.textContent = "Корзина пуста";
      this.list.appendChild(emptyNode);
    }

    this.updateButtonState(products);
  }

  set totalCost(cost: number) {
    this.price.textContent = `${cost} синапсов`;
  }

  private updateButtonState(products: TProductCardMain[] | ICart) {
    const count = Array.isArray(products)
      ? products.length
      : products.products.length;

    this.button.disabled = count === 0;
  }
}