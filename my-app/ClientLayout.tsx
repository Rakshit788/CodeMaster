"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import AuthWrapper from "./CheckLogin";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (

    <SessionProvider>
      <NextUIProvider>
        <AuthWrapper>
 {children}
 </AuthWrapper>
      </NextUIProvider>
     
    </SessionProvider>
  );
}
