import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Modal<T> extends Component<T> {
  protected modalContent: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    const closeButtonElement = this.container.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });

    this.modalContent = this.container.querySelector(".modal__content");
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  open() {
    this.container.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
  }

  close() {
    this.container.classList.remove("modal_active");
    document.removeEventListener("keyup", this.handleEscUp);
    this.modalContent.replaceChildren(); // чистим при закрытии
  }

  renderContent(component: Component<any>) {
    this.modalContent.replaceChildren(component.element);
    this.open();
  }

  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  }
}