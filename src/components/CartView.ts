import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ICart } from "../types";
import { ProductCard } from "./Card";

export class CartView extends Component<ICart> {
  protected list: HTMLElement;
  protected button: HTMLButtonElement;
  protected price: HTMLElement;
  protected events: IEvents;
  protected basketTemplate: HTMLTemplateElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.list = this.container.querySelector(".basket__list");
    this.button = this.container.querySelector(".basket__button");
    this.price = this.container.querySelector(".basket__price");

    // найдем шаблон карточки корзины
    this.basketTemplate = document.getElementById("card-basket") as HTMLTemplateElement;

    this.button.addEventListener("click", () => {
      this.events.emit("cart:checkout");
    });
  }

  set products(products: { id: string; title: string; price: number }[]) {
    // очищаем список
    this.list.replaceChildren(
      ...products.map((p, index) => {
        const card = new ProductCard(this.basketTemplate, "basket", this.events);
        card.setData(p, index);
        return card.render();
      })
    );
  }

  set totalCost(cost: number) {
    this.price.textContent = `${cost} синапсов`;
  }
}