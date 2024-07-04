export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "lachostore",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const defaultSession = {
  cart: [],
  shippingAddress: [],
};
