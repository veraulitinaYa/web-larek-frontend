import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class PaymentDataAddressForm extends Component<{ paymentType: string; address: string }> {
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;
  protected events: IEvents;

  private currentPayment: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.buttons = this.container.querySelectorAll(".order__buttons .button");
    this.addressInput = this.container.querySelector("input[name='address']");
    this.submit = this.container.querySelector(".order__button");
    this.error = this.container.querySelector(".form__errors");

    this.buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        this.currentPayment = btn.name;
        this.validate();
      })
    );

    this.addressInput.addEventListener("input", () => this.validate());

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.events.emit("order:paymentAddress", {
          paymentType: this.currentPayment,
          address: this.addressInput.value
        });
      }
    });
  }

  private validate(): boolean {
    if (!this.currentPayment || !this.addressInput.value) {
      this.submit.disabled = true;
      this.error.textContent = "Выберите способ оплаты и введите адрес";
      return false;
    }
    this.submit.disabled = false;
    this.error.textContent = "";
    return true;
  }
}