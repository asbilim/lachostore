import { getTranslations } from "next-intl/server";
import { Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TermsOfUse() {
  const t = await getTranslations("terms");

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">{t("termsOfUse")}</h1>
        <Button className="print:hidden">
          <Printer className="mr-2 h-4 w-4" /> {t("print")}
        </Button>
      </div>

      <div className="space-y-8 mb-12">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("introduction.title")}
          </h2>
          <p className="mb-4">{t("introduction.description")}</p>
          <p className="mb-4">
            <strong>{t("introduction.lastUpdated")}</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("definitions.title")}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("definitions.platform")}</li>
            <li>{t("definitions.user")}</li>
            <li>{t("definitions.vendor")}</li>
            <li>{t("definitions.customer")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("accountSecurity.title")}
          </h2>
          <p className="mb-4">{t("accountSecurity.description")}</p>
          <p className="mb-4">
            <strong>{t("accountSecurity.commitment")}</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            {t.raw("accountSecurity.measures").map((measure, index) => (
              <li key={index}>{measure}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("vendorResponsibilities.title")}
          </h2>
          <p className="mb-4">{t("vendorResponsibilities.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t
              .raw("vendorResponsibilities.responsibilities")
              .map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
          </ul>
          <p className="mt-4">
            <strong>{t("vendorResponsibilities.fee")}</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("orderTracking.title")}
          </h2>
          <p className="mb-4">{t("orderTracking.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t.raw("orderTracking.features").map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="mt-4">
            <strong>{t("orderTracking.note")}</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("customerRights.title")}
          </h2>
          <p className="mb-4">{t("customerRights.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t.raw("customerRights.rights").map((right, index) => (
              <li key={index}>{right}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("prohibitedActivities.title")}
          </h2>
          <p className="mb-4">{t("prohibitedActivities.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t.raw("prohibitedActivities.activities").map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("disputeResolution.title")}
          </h2>
          <p className="mb-4">{t("disputeResolution.description")}</p>
          <ol className="list-decimal pl-6 space-y-2">
            {t.raw("disputeResolution.steps").map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("limitationOfLiability.title")}
          </h2>
          <p className="mb-4">{t("limitationOfLiability.description")}</p>
          <ul className="list-disc pl-6 space-y-2">
            {t
              .raw("limitationOfLiability.limitations")
              .map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("modifications.title")}
          </h2>
          <p className="mb-4">{t("modifications.description")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {t("contactInformation.title")}
          </h2>
          <p className="mb-4">{t("contactInformation.description")}</p>
          <p className="font-semibold">
            {t("contactInformation.support")}
            <br />
            {t("contactInformation.email")}
            <br />
            {t("contactInformation.phone")}
          </p>
        </section>
      </div>

      {/* <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-center print:hidden">
        <Button
          onClick={() => setAccepted(true)}
          disabled={accepted}
          className="w-full max-w-md">
          {accepted ? (
            <span className="flex items-center">
              {t("termsAccepted")} <Check className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span>{t("acceptTerms")}</span>
          )}
        </Button>
      </div> */}
    </div>
  );
}
