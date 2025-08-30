import { Form, FormField } from "./Form";
import { IEvents } from "./base/events";

export class PaymentDataAddressForm extends Form<{ paymentType: string; address: string }> {
  private currentPayment: string = "";
  private buttons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.buttons = this.container.querySelectorAll(".order__buttons .button");
    this.buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        this.currentPayment = btn.name;
        this.validate();
      })
    );
  }

protected getFields(): Record<string, FormField> {
  return {
    address: this.container.querySelector("input[name='address']")! as HTMLInputElement
  };
}

  protected validate(): boolean {
    const address = (this.fields.address as HTMLInputElement).value;

    if (!this.currentPayment || !address) {
      this.showError("Выберите способ оплаты и введите адрес");
      return false;
    }
    this.clearError();
    return true;
  }

  protected onSubmit() {
    const address = (this.fields.address as HTMLInputElement).value;
    this.events.emit("order:paymentAddressEntered", {
      paymentType: this.currentPayment,
      address
    });
  }
}