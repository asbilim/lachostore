import UserDashboard from "@/components/accounts/dash";
import { getTranslations } from "next-intl/server";

export default async function UserAccount({ params }) {
  const { locale } = params;
  const t = await getTranslations("accounts", locale);

  const staticText = {
    noStoreAvailable: {
      title: t("noStoreAvailable.title"),
      description: t("noStoreAvailable.description"),
    },
    storeNotActive: {
      title: t("storeNotActive.title"),
      description: t("storeNotActive.description"),
      selectPlaceholder: t("storeNotActive.selectPlaceholder"),
    },
    welcome: t("welcome"),
    dashboard: {
      title: t("dashboard.title"),
      personalInfo: {
        title: t("dashboard.personalInfo.title"),
        description: t("dashboard.personalInfo.description"),
        labels: {
          name: t("dashboard.personalInfo.labels.name"),
          email: t("dashboard.personalInfo.labels.email"),
          phone: t("dashboard.personalInfo.labels.phone"),
        },
        buttonText: t("dashboard.personalInfo.buttonText"),
      },
      password: {
        title: t("dashboard.password.title"),
        description: t("dashboard.password.description"),
        labels: {
          currentPassword: t("dashboard.password.labels.currentPassword"),
          newPassword: t("dashboard.password.labels.newPassword"),
          confirmPassword: t("dashboard.password.labels.confirmPassword"),
        },
        buttonText: t("dashboard.password.buttonText"),
      },
      orders: {
        title: t("dashboard.orders.title"),
        description: t("dashboard.orders.description"),
        tableHeaders: {
          orderNumber: t("dashboard.orders.tableHeaders.orderNumber"),
          date: t("dashboard.orders.tableHeaders.date"),
          status: t("dashboard.orders.tableHeaders.status"),
          total: t("dashboard.orders.tableHeaders.total"),
          actions: t("dashboard.orders.tableHeaders.actions"),
        },
        actions: {
          view: t("dashboard.orders.actions.view"),
          return: t("dashboard.orders.actions.return"),
        },
        status: {
          fulfilled: t("dashboard.orders.status.fulfilled"),
          pending: t("dashboard.orders.status.pending"),
          cancelled: t("dashboard.orders.status.cancelled"),
        },
      },
      products: {
        title: t("dashboard.products.title"),
        description: t("dashboard.products.description"),
        addProductButton: t("dashboard.products.addProductButton"),
        addProductDialog: {
          title: t("dashboard.products.addProductDialog.title"),
          description: t("dashboard.products.addProductDialog.description"),
          labels: {
            name: t("dashboard.products.addProductDialog.labels.name"),
            category: t("dashboard.products.addProductDialog.labels.category"),
            price: t("dashboard.products.addProductDialog.labels.price"),
            stock: t("dashboard.products.addProductDialog.labels.stock"),
          },
          buttonText: t("dashboard.products.addProductDialog.buttonText"),
        },
        tableHeaders: {
          name: t("dashboard.products.tableHeaders.name"),
          category: t("dashboard.products.tableHeaders.category"),
          price: t("dashboard.products.tableHeaders.price"),
          stock: t("dashboard.products.tableHeaders.stock"),
          actions: t("dashboard.products.tableHeaders.actions"),
        },
        actions: {
          edit: t("dashboard.products.actions.edit"),
          delete: t("dashboard.products.actions.delete"),
        },
        pagination: {
          previous: t("dashboard.products.pagination.previous"),
          next: t("dashboard.products.pagination.next"),
        },
      },
      storeInfo: {
        title: t("dashboard.storeInfo.title"),
        description: t("dashboard.storeInfo.description"),
        labels: {
          storeName: t("dashboard.storeInfo.labels.storeName"),
          storeAddress: t("dashboard.storeInfo.labels.storeAddress"),
          storeAvatar: t("dashboard.storeInfo.labels.storeAvatar"),
          storeDescription: t("dashboard.storeInfo.labels.storeDescription"),
          socialMediaLinks: t("dashboard.storeInfo.labels.socialMediaLinks"),
        },
        buttonText: t("dashboard.storeInfo.buttonText"),
      },
      salesAnalytics: {
        title: t("dashboard.salesAnalytics.title"),
        description: t("dashboard.salesAnalytics.description"),
        placeholders: {
          revenueChart: t("dashboard.salesAnalytics.placeholders.revenueChart"),
          topProductsList: t(
            "dashboard.salesAnalytics.placeholders.topProductsList"
          ),
          recentSalesTable: t(
            "dashboard.salesAnalytics.placeholders.recentSalesTable"
          ),
        },
      },
    },
  };

  return <UserDashboard texts={staticText} />;
}
