import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class EmailTelephoneForm extends Component<{ email: string; phone: string }> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.emailInput = this.container.querySelector("input[name='email']");
    this.phoneInput = this.container.querySelector("input[name='phone']");
    this.submit = this.container.querySelector("button[type='submit']");
    this.error = this.container.querySelector(".form__errors");

    this.container.addEventListener("input", () => this.validate());

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.events.emit("order:contacts", {
          email: this.emailInput.value,
          phone: this.phoneInput.value
        });
      }
    });
  }

  private validate(): boolean {
    const emailValid = this.emailInput.value.includes("@");
    const phoneValid = this.phoneInput.value.length >= 7;

    if (!emailValid || !phoneValid) {
      this.submit.disabled = true;
      this.error.textContent = "Введите корректные данные";
      return false;
    }
    this.submit.disabled = false;
    this.error.textContent = "";
    return true;
  }
}