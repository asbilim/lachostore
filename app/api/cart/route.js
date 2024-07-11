// app/api/cart/route.js
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/iron-session-config";

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    return Response.json({ cart: session.cart || [] });
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
        break;
      case "remove":
        removeFromCart(session.cart, product.id);
        break;
      case "update":
        updateQuantity(session.cart, product.id, product.quantity);
        break;
      case "clear":
        session.cart = [];
        break;
      default:
        return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    await session.save();
    return Response.json({
      cart: session.cart,
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

function addToCart(cart, product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
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
