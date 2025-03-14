import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starcar",
  description: "Website for displaying and analyzing data from my car.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
