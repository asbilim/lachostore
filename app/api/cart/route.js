// app/api/cart/route.js
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/iron-session-config";

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    return Response.json({
      cart: session.cart || [],
      referral_code: session.referral_code || null,
    });
  } catch (error) {
    console.error("Error in GET /api/cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    const { action, product } = await request.json();

    if (!session.cart) {
      session.cart = [];
    }

    switch (action) {
      case "add":
        addToCart(session.cart, product);

        // If a valid referral code exists, store it at the session level, too
        if (product.referred_by) {
          updateReferralCode(session, product.referred_by);
        }
        break;
      case "remove":
        removeFromCart(session.cart, product.id);
        break;
      case "update":
        updateQuantity(session.cart, product.id, product.quantity);
        break;
      case "clear":
        session.cart = [];
        session.referral_code = null; // Clear referral code on cart reset
        break;
      default:
        return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    await session.save();
    return Response.json({
      cart: session.cart,
      referral_code: session.referral_code || null,
      message: `Cart ${action} successful`,
    });
  } catch (error) {
    console.error(`Error in POST /api/cart:`, error);
    return Response.json(
      { error: `Failed to update cart: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Adds an item to the cart. Each cart item can carry its own referral code.
 */
function addToCart(cart, product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // If the item is already in the cart, just increment its quantity
    existingItem.quantity += 1;

    // If the product arrives with a referral code, update the cart item
    if (product.referred_by) {
      existingItem.referral_code = product.referred_by;
    }
  } else {
    // Otherwise, create a new cart item
    cart.push({
      ...product,
      quantity: 1,
      // Store the referral code at the item level (if provided)
      referral_code: product.referred_by ?? null,
    });
  }
}

function removeFromCart(cart, productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

function updateQuantity(cart, productId, quantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity;
  }
}

/**
 * Sets the referral code at the session (cart) level.
 */
function updateReferralCode(session, referred_by) {
  if (isValidReferralCode(referred_by)) {
    session.referral_code = referred_by;
  }
}

function isValidReferralCode(code) {
  return typeof code === "string" && code.trim().length > 0;
}
