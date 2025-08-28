import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export abstract class Form<T> extends Component<T> {
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.container.addEventListener("submit", (e) => {
            e.preventDefault();
            this.events.emit("form:submit", this.collectData());
        });
    }

    // метод для сбора данных из конкретной формы
    abstract collectData(): Partial<T>;
}