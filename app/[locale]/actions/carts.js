"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/iron-session-config";

export async function getServerCart() {
  const session = await getIronSession(cookies(), sessionOptions);
  return session.cart || { items: [] };
}

export async function addToServerCart(item) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.cart) {
    session.cart = { items: [] };
  }
  session.cart.items.push(item);
  await session.save();
  return session.cart;
}

export async function updateServerCartItem(itemId, updates) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (session.cart) {
    session.cart.items = session.cart.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    await session.save();
  }
  return session.cart || { items: [] };
}

export async function removeFromServerCart(itemId) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (session.cart) {
    session.cart.items = session.cart.items.filter(
      (item) => item.id !== itemId
    );
    await session.save();
  }
  return session.cart || { items: [] };
}

export async function clearServerCart() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.cart = { items: [] };
  await session.save();
  return session.cart;
}
