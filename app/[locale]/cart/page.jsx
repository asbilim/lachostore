import CheckoutPage from "../../../components/forms";
import { getTranslations } from "next-intl/server";

export default async function Cart() {
  const t = await getTranslations("Cart");

  const validationMessages = {
    fullName: t("validation_fullName"),
    email: t("validation_email"),
    address: t("validation_address"),
    city: t("validation_city"),
    postalCode: t("validation_postalCode"),
    phoneNumber: t("validation_phoneNumber"),
    cardNumber: t("validation_cardNumber"),
    cardExpiry: t("validation_cardExpiry"),
    cardCVC: t("validation_cardCVC"),
  };

  const labels = {
    fullName: t("labels_fullName"),
    email: t("labels_email"),
    address: t("labels_address"),
    city: t("labels_city"),
    postalCode: t("labels_postalCode"),
    paymentMethod: t("labels_paymentMethod"),
    creditCard: t("labels_creditCard"),
    orangeMoney: t("labels_orangeMoney"),
    mtnMobileMoney: t("labels_mtnMobileMoney"),
    cardNumber: t("labels_cardNumber"),
    cardExpiry: t("labels_cardExpiry"),
    cardCVC: t("labels_cardCVC"),
    phoneNumber: t("labels_phoneNumber"),
    phoneNumberPlaceholder: t("labels_phoneNumberPlaceholder"),
  };

  return (
    <CheckoutPage
      checkout={t("checkout")}
      cart_text={t("your_cart")}
      description={t("description")}
      empty={t("empty")}
      empty_description={t("empty_description")}
      subtotal_text={t("subtotal")}
      shipping_text={t("shipping")}
      total_text={t("total")}
      button={t("button")}
      shipping_payment={t("shipping_payment")}
      shipping_description={t("shipping_description")}
      last_button={t("last_button")}
      validationMessages={validationMessages}
      labels={labels}
      promo={t("promo")}
      promo_button={t("promo_button")}
    />
  );
}
