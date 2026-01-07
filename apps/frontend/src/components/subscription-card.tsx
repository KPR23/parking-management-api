"use client";

import { queryOptions } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, CreditCard, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/hooks/use-subscriptions";

interface SubscriptionCardProps {
	subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
	const isExpired = new Date(subscription.endDate) < new Date();

	// Determine card style based on type
	const getTypeStyles = (type: string) => {
		switch (type) {
			case "lifetime":
				return "bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white border-slate-700";
			case "yearly":
				return "bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-indigo-500";
			case "monthly":
				return "bg-gradient-to-br from-white to-slate-50 border-slate-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
			default:
				return "bg-card";
		}
	};

	const isActiveStyle = !isExpired && "ring-2 ring-primary ring-offset-2";

	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl aspect-[1.586/1]", // Credit card ratio
				getTypeStyles(subscription.type),
				isActiveStyle
			)}
		>
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
			<div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

			<CardContent className="h-full flex flex-col justify-between p-6 relative z-10">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-2">
						<ShieldCheck className="w-6 h-6 opacity-80" />
						<span className="font-bold tracking-wider uppercase text-sm opacity-90">
							Park<span className="text-primary-foreground/80">Manager</span>
						</span>
					</div>
					<Badge
						variant="outline"
						className="bg-white/10 border-white/20 backdrop-blur-sm text-current uppercase tracking-widest text-[10px]"
					>
						{subscription.type}
					</Badge>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-70">
						<CreditCard className="w-3 h-3" /> License Plate
					</div>
					<div className="font-mono text-2xl font-bold tracking-widest shadow-black/10 drop-shadow-sm">
						{subscription.car?.plateNumber}
					</div>
				</div>

				<div className="flex justify-between items-end">
					<div className="flex flex-col gap-1">
						<span className="text-[10px] uppercase tracking-widest opacity-70">
							Valid Until
						</span>
						<span className="font-mono text-sm font-medium flex items-center gap-2">
							<CalendarDays className="w-3 h-3" />
							{format(new Date(subscription.endDate), "MM/yy")}
						</span>
					</div>

					{isExpired && (
						<Badge variant="destructive" className="animate-pulse">
							Expired
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
