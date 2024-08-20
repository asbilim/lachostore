"use client";
import { useEffect } from "react";
import {
  CardHeader,
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "../ui/card";
import RevenueChart from "./revenue-chart";
import ShopVisitsChart from "./visit-chart";

export const SalesAnalyticsTab = ({ shop, texts }) => {
  useEffect(() => {
    console.log(`Fetching sales analytics for shop ID: ${shop.id}`);
  }, [shop]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.dashboard.salesAnalytics.title}</CardTitle>
        <CardDescription>
          {texts.dashboard.salesAnalytics.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for actual charts/graphs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <RevenueChart shop={shop} />
            <div className="bg-gray-100 p-4 rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Analytics data for visits</h3>
            <ShopVisitsChart shop={shop} />
            <div className="bg-gray-100 p-4 rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Recent Sales</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {texts.dashboard.salesAnalytics.placeholders.recentSalesTable}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
