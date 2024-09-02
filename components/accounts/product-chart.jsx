"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { useSession } from "next-auth/react";

export default function ProductInsightsChart({ shopId }) {
  const [insightsData, setInsightsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("30");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(
          new Date().setDate(new Date().getDate() - parseInt(dateRange))
        )
          .toISOString()
          .split("T")[0];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/shop/insights/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify({
              store_id: shopId,
              start_date: startDate,
              end_date: endDate,
            }),
            next: { cache: "no-store", revalidate: 10 },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product insights");
        }

        const data = await response.json();
        setInsightsData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, shopId, session?.accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!insightsData || !insightsData.product_insights.length) {
    return <div>No data available</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Product Insights</CardTitle>
        <CardDescription>
          Performance metrics for products in Shop ID: {shopId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bar Chart for comparing products */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={insightsData.product_insights}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="product_name"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Bar
              dataKey="total_views"
              fill="hsl(var(--primary))"
              name="Total Views"
            />
            <Bar
              dataKey="order_count"
              fill="hsl(var(--secondary))"
              name="Order Count"
            />
            <Bar
              dataKey="completed_orders_count"
              fill="hsl(var(--accent))"
              name="Completed Orders"
            />
            <Bar
              dataKey="delivered_orders_count"
              fill="hsl(var(--muted))"
              name="Delivered Orders"
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Scatter Plot for Views vs Orders */}
        <ResponsiveContainer width="100%" height={400} className="mt-8">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="total_views" name="Total Views" />
            <YAxis dataKey="order_count" name="Order Count" />
            <ZAxis dataKey="conversion_rate" name="Conversion Rate" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Scatter
              name="Products"
              data={insightsData.product_insights}
              fill="hsl(var(--primary))"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
