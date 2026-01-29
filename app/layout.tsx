import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "费用 Dashboard",
  description: "多品牌费用数据可视化仪表板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased min-h-screen bg-gray-900">
        {children}
      </body>
    </html>
  );
}
