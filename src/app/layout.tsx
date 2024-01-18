import * as React from "react";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import AppHeader from "./components/Header/app.header";
import AppFooter from "./components/Footer/app.footer";

export const metadata = {
  title: "Next.js App Router + Material UI v5",
  description: "Next.js App Router + Material UI v5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <ThemeRegistry>{children}</ThemeRegistry>
        <AppFooter />
      </body>
    </html>
  );
}
