// app/api/currency/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/iron-session-config";

const API_KEY = "bbe0c69e14cf485c83e8cab0";
const BASE_CURRENCY = "XAF";

// We'll use this to store exchange rates outside of the session
let globalExchangeRates = null;
let globalExchangeRatesTimestamp = null;

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);

  try {
    let needsFetch =
      !globalExchangeRates ||
      !globalExchangeRatesTimestamp ||
      Date.now() - globalExchangeRatesTimestamp >= 3600000;

    if (needsFetch) {
      const apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error("API response not OK", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result !== "success") {
        console.error("API returned error", {
          result: data.result,
          errorType: data["error-type"],
        });
        throw new Error(`API error: ${data["error-type"]}`);
      }

      globalExchangeRates = {
        XAF: 1,
        ...data.conversion_rates,
      };
      globalExchangeRatesTimestamp = Date.now();
    } else {
    }

    // Ensure currency is always set
    if (!session.currency) {
      session.currency = BASE_CURRENCY;
      await session.save();
    }

    console.log("Returning currency data", {
      currency: session.currency,
      ratesCount: Object.keys(globalExchangeRates).length,
    });

    return NextResponse.json({
      rates: globalExchangeRates,
      currency: session.currency,
    });
  } catch (error) {
    console.error("Error in GET /api/currency:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to fetch exchange rates: " + error.message },
      { status: 500 }
    );
  } finally {
  }
}

export async function POST(request) {
  const session = await getIronSession(cookies(), sessionOptions);

  try {
    const body = await request.json();

    const { currency } = body;

    if (!currency) {
      console.error("Currency not provided in request body");
      return NextResponse.json(
        { error: "Currency not provided" },
        { status: 400 }
      );
    }

    session.currency = currency;
    await session.save();

    return NextResponse.json({ currency: session.currency });
  } catch (error) {
    console.error("Error in POST /api/currency:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to update currency: " + error.message },
      { status: 500 }
    );
  } finally {
  }
}
