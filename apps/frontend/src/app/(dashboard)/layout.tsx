import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen bg-muted/20">
			<AppSidebar />
			<main className="flex-1 md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
				<div className="container py-8 md:py-10 px-6 md:px-10 max-w-[1920px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					{children}
				</div>
			</main>
		</div>
	);
}
