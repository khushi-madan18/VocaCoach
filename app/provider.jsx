"use client"
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import React, { Suspense } from 'react'
import AuthProvider from "./AuthProvider";

function Provider({children}) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL );
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <ConvexProvider client={convex}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ConvexProvider>
     </Suspense>
  )
}

export default Provider