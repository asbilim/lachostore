// app/api/currency/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/iron-session-config";

const API_KEY = "db8d251a1ff106b91a619f32";
const BASE_CURRENCY = "XAF";

// We'll use this to store exchange rates outside of the session
let globalExchangeRates = null;
let globalExchangeRatesTimestamp = null;

export async function GET() {
  console.log("GET /api/currency - Start");
  const session = await getIronSession(cookies(), sessionOptions);

  try {
    let needsFetch =
      !globalExchangeRates ||
      !globalExchangeRatesTimestamp ||
      Date.now() - globalExchangeRatesTimestamp >= 3600000;

    if (needsFetch) {
      console.log("Fetching fresh exchange rates");
      const apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error("API response not OK", {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

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
      console.log("Exchange rates updated globally");
    } else {
      console.log("Using cached exchange rates");
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
    console.log("GET /api/currency - End");
  }
}

export async function POST(request) {
  console.log("POST /api/currency - Start");
  const session = await getIronSession(cookies(), sessionOptions);

  try {
    const body = await request.json();
    console.log("Request body:", body);

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

    console.log(`Currency updated to ${currency} and saved to session`);
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
    console.log("POST /api/currency - End");
  }
}
