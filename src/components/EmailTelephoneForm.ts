import { Form, FormField } from "./Form";
import { IEvents } from "./base/events";

export class EmailTelephoneForm extends Form<{ email: string; phone: string }> {
protected getFields(): Record<string, FormField> {
  return {
    email: this.container.querySelector("input[name='email']")! as HTMLInputElement,
    phone: this.container.querySelector("input[name='phone']")! as HTMLInputElement
  };
}

  protected validate(): boolean {
    const email = (this.fields.email as HTMLInputElement).value;
    const phone = (this.fields.phone as HTMLInputElement).value;

    if (!email.includes("@") || phone.length < 7) {
      this.showError("Введите корректные данные");
      return false;
    }
    this.clearError();
    return true;
  }

  protected onSubmit() {
    const email = (this.fields.email as HTMLInputElement).value;
    const phone = (this.fields.phone as HTMLInputElement).value;

    this.events.emit("order:emailTelephoneEntered", { email, phone });
  }
}