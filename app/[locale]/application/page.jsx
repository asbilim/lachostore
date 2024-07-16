import React from "react";
import NutritionistShowcase from "@/components/nutrition";
import { useTranslations } from "next-intl";

export default function Page({ locale }) {
  const t = useTranslations("NutritionistShowcase");

  const getTranslatedItems = (path) => {
    const length = t.raw(`${path}.length`);
    const items = [];
    for (let i = 0; i < length; i++) {
      items.push(t(`${path}.${i}`));
    }
    return items;
  };

  const translations = {
    title: t("title"),
    sections: {
      nutritionist: {
        title: t("sections.nutritionist.title"),
        cards: {
          education: {
            title: t("sections.nutritionist.cards.education.title"),
            items: getTranslatedItems(
              "sections.nutritionist.cards.education.items"
            ),
          },
          certifications: {
            title: t("sections.nutritionist.cards.certifications.title"),
            items: getTranslatedItems(
              "sections.nutritionist.cards.certifications.items"
            ),
          },
          publications: {
            title: t("sections.nutritionist.cards.publications.title"),
            items: getTranslatedItems(
              "sections.nutritionist.cards.publications.items"
            ),
          },
          specializations: {
            title: t("sections.nutritionist.cards.specializations.title"),
            items: getTranslatedItems(
              "sections.nutritionist.cards.specializations.items"
            ),
          },
        },
      },
      form: {
        title: t("sections.form.title"),
        fields: {
          height: {
            label: t("sections.form.fields.height"),
          },
          age: {
            label: t("sections.form.fields.age"),
          },
          gender: {
            label: t("sections.form.fields.gender.label"),
            options: {
              male: t("sections.form.fields.gender.options.male"),
              female: t("sections.form.fields.gender.options.female"),
              other: t("sections.form.fields.gender.options.other"),
            },
          },
          exerciseFrequency: {
            label: t("sections.form.fields.exerciseFrequency"),
          },
          alcoholConsumption: {
            label: t("sections.form.fields.alcoholConsumption.label"),
            options: {
              none: t("sections.form.fields.alcoholConsumption.options.none"),
              occasional: t(
                "sections.form.fields.alcoholConsumption.options.occasional"
              ),
              moderate: t(
                "sections.form.fields.alcoholConsumption.options.moderate"
              ),
              heavy: t("sections.form.fields.alcoholConsumption.options.heavy"),
            },
          },
          smokingStatus: {
            label: t("sections.form.fields.smokingStatus.label"),
            options: {
              non_smoker: t(
                "sections.form.fields.smokingStatus.options.non_smoker"
              ),
              former_smoker: t(
                "sections.form.fields.smokingStatus.options.former_smoker"
              ),
              current_smoker: t(
                "sections.form.fields.smokingStatus.options.current_smoker"
              ),
            },
          },
          pregnancyStatus: {
            label: t("sections.form.fields.pregnancyStatus"),
          },
          breastfeedingStatus: {
            label: t("sections.form.fields.breastfeedingStatus"),
          },
          digestiveIssues: {
            label: t("sections.form.fields.digestiveIssues.label"),
            options: getTranslatedItems(
              "sections.form.fields.digestiveIssues.options"
            ),
          },
          cookingSkills: {
            label: t("sections.form.fields.cookingSkills.label"),
            options: {
              beginner: t(
                "sections.form.fields.cookingSkills.options.beginner"
              ),
              intermediate: t(
                "sections.form.fields.cookingSkills.options.intermediate"
              ),
              advanced: t(
                "sections.form.fields.cookingSkills.options.advanced"
              ),
            },
          },
          mealPrepTime: {
            label: t("sections.form.fields.mealPrepTime.label"),
            options: {
              minimal: t("sections.form.fields.mealPrepTime.options.minimal"),
              moderate: t("sections.form.fields.mealPrepTime.options.moderate"),
              extensive: t(
                "sections.form.fields.mealPrepTime.options.extensive"
              ),
            },
          },
          budgetConstraints: {
            label: t("sections.form.fields.budgetConstraints.label"),
            options: {
              low: t("sections.form.fields.budgetConstraints.options.low"),
              medium: t(
                "sections.form.fields.budgetConstraints.options.medium"
              ),
              high: t("sections.form.fields.budgetConstraints.options.high"),
            },
          },
          foodPreferences: {
            label: t("sections.form.fields.foodPreferences.label"),
            options: getTranslatedItems(
              "sections.form.fields.foodPreferences.options"
            ),
          },
        },
        submitButton: t("sections.form.submitButton"),
      },
    },
  };

  return (
    <div>
      <NutritionistShowcase locale={locale} translations={translations} />
    </div>
  );
}
