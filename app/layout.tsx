'use client'
import { ToastContextProvider } from "@/providers/Toast";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { TutorialProvider } from "@/providers/TutorialProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/flood-aid.png" type="image/png" />
      </head>
      <body>
        <PrimeReactProvider>
          <QueryClientProvider client={queryClient}>
            <TutorialProvider>
              <ToastContextProvider>
                {children}
              </ToastContextProvider>
            </TutorialProvider>
          </QueryClientProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
