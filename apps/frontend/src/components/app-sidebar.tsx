"use client";

import {
	CreditCard,
	LayoutDashboard,
	Menu,
	Settings,
	SquareParking,
	Ticket,
	LogOut,
	ChevronsUpDown,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const sidebarItems = [
	{
		title: "Dashboard",
		href: "/",
		icon: LayoutDashboard,
	},
	{
		title: "Parking Lots",
		href: "/parking-lots",
		icon: SquareParking,
	},
	{
		title: "Tickets",
		href: "/tickets",
		icon: Ticket,
	},
	{
		title: "Subscriptions",
		href: "/subscriptions",
		icon: CreditCard,
	},
	{
		title: "Admins",
		href: "/admins",
		icon: Users,
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const { user, logout } = useAuth();

	return (
		<>
			{/* Mobile Menu Button */}
			<Button
				variant="ghost"
				size="icon"
				className="md:hidden fixed top-4 right-4 z-50"
				onClick={() => setIsMobileOpen(!isMobileOpen)}
			>
				<Menu className="h-6 w-6" />
			</Button>

			{/* Sidebar Container */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card/80 backdrop-blur-xl transition-transform duration-200 ease-in-out md:translate-x-0 theme-transition",
					isMobileOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex h-16 items-center px-6 border-b bg-card/50 backdrop-blur-sm">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-xl tracking-tight"
					>
						<div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
							<SquareParking className="h-5 w-5" />
						</div>
						<span>ParkManager</span>
					</Link>
				</div>

				<nav className="flex-1 space-y-1.5 px-3 py-6">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsMobileOpen(false)}
								className={cn(
									"group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
									isActive
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
								)}
							>
								<Icon
									className={cn(
										"mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
										isActive
											? "text-primary-foreground"
											: "text-muted-foreground group-hover:text-foreground"
									)}
								/>
								{item.title}
							</Link>
						);
					})}
				</nav>

				<div className="p-4 border-t bg-card/50 backdrop-blur-sm">
					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
									<div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
										<span className="text-sm font-bold text-primary-foreground">
											{user.name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
										</span>
									</div>
									<div className="flex flex-col flex-1 min-w-0">
										<span className="text-sm font-semibold truncate">
											{user.name || "User"}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											{user.email}
										</span>
									</div>
									<ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[--radix-dropdown-menu-trigger-width]"
							>
								<DropdownMenuItem
									onClick={logout}
									className="text-destructive focus:text-destructive cursor-pointer"
								>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</aside>
		</>
	);
}
