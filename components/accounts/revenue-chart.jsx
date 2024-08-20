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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/providers/currency";

export default function RevenueChart({ shop }) {
  const [revenueData, setRevenueData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dateRange, setDateRange] = useState("30");
  const { data: session } = useSession();
  const { currency, convertCurrency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate start and end dates based on the selected date range
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(
          new Date().setDate(new Date().getDate() - parseInt(dateRange))
        )
          .toISOString()
          .split("T")[0];

        // Fetch the data from the backend API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/stores/${shop.id}/daily-revenue/?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }

        const data = await response.json();
        console.log(data);
        setRevenueData(data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange, shop.id, session.accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!revenueData || !revenueData.revenue_data) {
    return <div>No data available</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Revenue Chart</CardTitle>
        <CardDescription>
          Revenue breakdown by order status for Store ID: {revenueData.store_id}
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
          <LineChart
            data={revenueData.revenue_data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              name="Total Revenue"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#82ca9d"
              name="Completed Orders"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#ffc658"
              name="Pending Orders"
            />
            <Line
              type="monotone"
              dataKey="canceled"
              stroke="#ff8042"
              name="Canceled Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
