import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Printer, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadButton } from "@/components/terms/button";
import logo from "@/public/lachostore.png";

export default async function TermsOfUse() {
  const t = await getTranslations("terms");

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Image
        src={logo}
        alt="LaChoStore Logo"
        width={150}
        height={50}
        className="mr-4"
      />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {t("termsOfUse")}
          </h1>
        </div>
        <div className="flex space-x-2">
          <PDFDownloadButton className="print:hidden">
            <Download className="mr-2 h-4 w-4" /> {t("print")}
          </PDFDownloadButton>
        </div>
      </div>

      <div id="terms-content" className="space-y-8 mb-12">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
            {t("introduction.title")}
          </h2>
          <p className="mb-4">{t("introduction.description")}</p>
          <p className="mb-4">
            <strong>{t("introduction.lastUpdated")}</strong>{" "}
            {new Date().toLocaleDateString()}
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
            {t("modifications.title")}
          </h2>
          <p className="mb-4">{t("modifications.description")}</p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">
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
    </div>
  );
}
