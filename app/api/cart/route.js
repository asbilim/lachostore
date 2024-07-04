// app/api/cart/route.js
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, defaultSession } from "@/lib/iron-session-config";

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);
  return Response.json(session.cart || defaultSession.cart);
}

export async function POST(request) {
  const session = await getIronSession(cookies(), sessionOptions);
  const { action, product } = await request.json();

  if (!session.cart) {
    session.cart = [];
  }

  switch (action) {
    case "add":
      const existingItem = session.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        session.cart.push({ ...product, quantity: 1 });
      }
      break;
    case "remove":
      session.cart = session.cart.filter((item) => item.id !== product.id);
      break;
    case "update":
      const itemToUpdate = session.cart.find((item) => item.id === product.id);
      if (itemToUpdate) {
        itemToUpdate.quantity = product.quantity;
      }
      break;
    case "clear":
      session.cart = [];
      break;
    default:
      return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  await session.save();
  return Response.json(session.cart);
}
