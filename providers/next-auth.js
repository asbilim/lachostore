"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children, session, pageProps }) => {
  return (
    <SessionProvider session={session} {...pageProps}>
      {children}
    </SessionProvider>
  );
};
