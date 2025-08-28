import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class SuccessView extends Component<{ totalCost: number }> {
  protected title: HTMLElement;
  protected description: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.title = this.container.querySelector(".order-success__title");
    this.description = this.container.querySelector(".order-success__description");
    this.button = this.container.querySelector(".order-success__close");

    this.button.addEventListener("click", () => {
      this.events.emit("order:successful");
    });
  }

 

  set totalCost(cost: number) {
    this.description.textContent = `Списано ${cost} синапсов`;
  }

  
}

