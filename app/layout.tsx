'use client'
import { ToastContextProvider } from "@/providers/Toast";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

type ToastSeverity = "success" | "info" | "warn" | "error";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const toastRef = useRef<Toast>(null);

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toastRef.current?.show({ severity, summary, detail, life: 3000 });
  };

  showToast("success", "Welcome", "Welcome to the application");
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/flood-aid.png" type="image/png" />
      </head>
      <body>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <PrimeReactProvider>
          <QueryClientProvider client={queryClient}>
            <ToastContextProvider>
              {children}
              </ToastContextProvider>
          </QueryClientProvider>
        </PrimeReactProvider>
      </APIProvider>
      </body>
    </html>
  );
}
