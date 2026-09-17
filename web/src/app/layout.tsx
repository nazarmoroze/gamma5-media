import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gamma5 Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
