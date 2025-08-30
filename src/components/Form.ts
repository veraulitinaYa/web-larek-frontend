import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export abstract class Form<T> extends Component<T> {
  protected submit: HTMLButtonElement;
  protected error: HTMLElement;
  protected fields: Record<string, FormField>;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.submit = this.container.querySelector("button[type='submit']")!;
    this.error = this.container.querySelector(".form__errors")!;
    this.fields = this.getFields();

    this.container.addEventListener("input", () => this.validate());
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) this.onSubmit();
    });
  }

  // Метод для получения всех полей формы
  protected abstract getFields(): Record<string, FormField>;

  // Метод валидации, должен возвращать true/false
  protected abstract validate(): boolean;

  // Метод сабмита, вызывается при успешной валидации
  protected abstract onSubmit(): void;

  protected showError(message: string) {
    this.submit.disabled = true;
    this.error.textContent = message;
  }

  protected clearError() {
    this.submit.disabled = false;
    this.error.textContent = "";
  }
}