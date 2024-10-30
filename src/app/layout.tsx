import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {MonthProvider} from "@/app/shared/components/context/ui/MonthContext";
import {DataProvider} from "@/app/shared/components/context/ui/movements-context";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Personal finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <MonthProvider>
            <DataProvider>
                {children}
            </DataProvider>
        </MonthProvider>
        </body>
        </html>
    );
}
