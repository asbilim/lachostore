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
} from "recharts";
import { useSession } from "next-auth/react";

export default function ShopVisitsChart({ shop }) {
  const [visitData, setVisitData] = useState(null);
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/store-visits-stats/?store_id=${shop.id}&start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            next: { cache: "no-store", revalidate: 10 },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch visit data");
        }

        const data = await response.json();
        setVisitData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, shop.id, session?.accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!visitData) {
    return <div>No data available</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Shop Visits by Day of Week</CardTitle>
        <CardDescription>
          Number of visits received for Store : {shop.name}
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={visitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
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
              dataKey="visit_count"
              fill="hsl(var(--primary))"
              name="Visit Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
