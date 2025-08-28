import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ICart, TProductCardMain } from "../types";
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

    this.list = this.container.querySelector(".basket__list")!;
    this.button = this.container.querySelector(".basket__button")!;
    this.price = this.container.querySelector(".basket__price")!;

    // шаблон карточки корзины
    this.basketTemplate = document.getElementById("card-basket") as HTMLTemplateElement;

    this.button.addEventListener("click", () => {
      this.events.emit("cart:checkout");
    });
  }

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Set products in the cart
   * @param products list of products in the cart
   * @remarks
   * This method will replace all children of the cart list element with new
   * ProductCard instances corresponding to the products in the list.
   * The index of each product in the list is also passed to the ProductCard
   * constructor, so that it can display the correct index in the cart.
   * The ProductCard instances are responsible for setting up their own event
   * listeners, so this method does not return anything.
   */
/*******  9fedc1c1-6170-40da-8fee-e12a07ed0cc1  *******/
set products(products: TProductCardMain[]) {
  this.list.replaceChildren(
    ...products.map((p, index) => {
      const card = new ProductCard(this.basketTemplate, 'basket', this.events);
      card.setData(p, index);
      return card.render(); // обработчик удаления уже повешен внутри ProductCard
    })
  );
}

  set totalCost(cost: number) {
    this.price.textContent = `${cost} синапсов`;
  }
}