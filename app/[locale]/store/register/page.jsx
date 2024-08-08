import MainRegistration from "@/components/store/main";
import { getTranslations } from "next-intl/server";
export default async function Store({ params }) {
  const { locale } = params;
  const t = await getTranslations("register_store", locale);
  const staticText = {
    cardTitle: t("cardTitle"),
    steps: [
      t("steps.0"),
      t("steps.1"),
      t("steps.2"),
      t("steps.3"),
      t("steps.4"),
      t("steps.5"),
    ],
    labels: {
      storeName: t("labels.storeName"),
      slug: t("labels.slug"),
      contactEmail: t("labels.contactEmail"),
      contactPhone: t("labels.contactPhone"),
      address: t("labels.address"),
      website: t("labels.website"),
      facebook: t("labels.facebook"),
      instagram: t("labels.instagram"),
      twitter: t("labels.twitter"),
      operatingHours: t("labels.operatingHours"),
      description: t("labels.description"),
      avatar: t("labels.avatar"),
      geoLocation: t("labels.geoLocation"),
    },
    placeholders: {
      storeName: t("placeholders.storeName"),
      slug: t("placeholders.slug"),
      contactEmail: t("placeholders.contactEmail"),
      contactPhone: t("placeholders.contactPhone"),
      address: t("placeholders.address"),
      website: t("placeholders.website"),
      facebook: t("placeholders.facebook"),
      instagram: t("placeholders.instagram"),
      twitter: t("placeholders.twitter"),
      operatingHours: t("placeholders.operatingHours"),
      description: t("placeholders.description"),
      avatar: t("placeholders.avatar"),
    },
    buttons: {
      previous: t("buttons.previous"),
      next: t("buttons.next"),
      submit: t("buttons.submit"),
    },
    messages: {
      fetchingLocation: t("messages.fetchingLocation"),
      locationDescription: t("messages.locationDescription"),
      validationError: t("messages.validationError"),
      locationError: t("messages.locationError"),
      successTitle: t("messages.successTitle"),
      successDescription: t("messages.successDescription"),
      errorTitle: t("messages.errorTitle"),
      errorDescription: t("messages.errorDescription"),
      imageUploadedTitle: t("messages.imageUploadedTitle"),
      imageUploadedDescription: t("messages.imageUploadedDescription"),
    },
  };

  return <MainRegistration texts={staticText} />;
}
