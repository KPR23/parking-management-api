import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<AppSidebar />
			<main className="flex-1 md:pl-64 min-h-screen bg-muted/10">
				<div className="container py-6 md:py-8 px-4 md:px-8 max-w-7xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	);
}
