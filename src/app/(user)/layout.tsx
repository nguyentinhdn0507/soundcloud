import AppFooter from "@/components/Footer/app.footer";
import AppHeader from "@/components/Header/app.header";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Clone Sound Cloud",
  description: "Cửu Vân Hội",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <> 
      <AppHeader />
      {children}
      <div style={{ marginTop: "100px" }}></div>
      <AppFooter />
    </>
  );
}
