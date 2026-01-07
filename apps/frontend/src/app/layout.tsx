import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
	title: "Parking Management",
	description: "Premium parking management dashboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
				suppressHydrationWarning
			>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
