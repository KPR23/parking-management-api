"use client";

import { queryOptions } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	CalendarDays,
	CreditCard,
	Edit,
	MoreVertical,
	Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteSubscription } from "@/hooks/use-subscriptions";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/hooks/use-subscriptions";

interface SubscriptionCardProps {
	subscription: Subscription;
	onEdit?: () => void;
}

export function SubscriptionCard({
	subscription,
	onEdit,
}: SubscriptionCardProps) {
	const isExpired = new Date(subscription.endDate) < new Date();
	const deleteMutation = useDeleteSubscription();

	const handleDelete = () => {
		if (confirm("Are you sure you want to cancel this subscription?")) {
			deleteMutation.mutate(subscription.id);
		}
	};

	// Tier dots instead of full backgrounds
	const getTierColor = (type: string) => {
		switch (type) {
			case "lifetime":
				return "bg-slate-900 dark:bg-slate-100";
			case "yearly":
				return "bg-indigo-600";
			case "monthly":
				return "bg-slate-400";
			default:
				return "bg-slate-200";
		}
	};

	return (
		<Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border bg-card">
			<CardContent className="p-5 flex flex-col gap-4">
				{/* Header */}
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"w-2 h-2 rounded-full",
								getTierColor(subscription.type)
							)}
						/>
						<div className="flex flex-col">
							<span className="font-mono text-lg font-bold tracking-tight leading-none">
								{subscription.car?.plateNumber}
							</span>
							<span className="text-xs text-muted-foreground capitalize mt-1">
								{subscription.type} Plan
							</span>
						</div>
					</div>

					<div className="flex gap-2">
						<Badge
							variant="secondary"
							className={cn(
								"uppercase text-[10px] tracking-wider font-semibold",
								isExpired
									? "bg-destructive/10 text-destructive hover:bg-destructive/15"
									: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100"
							)}
						>
							{isExpired ? "Expired" : "Active"}
						</Badge>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-6 w-6 p-0">
									<MoreVertical className="h-4 w-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={onEdit}>
									<Edit className="mr-2 h-4 w-4" /> Edit / Extend
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleDelete}
									className="text-destructive focus:text-destructive"
								>
									<Trash className="mr-2 h-4 w-4" /> Cancel Subscription
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="h-px bg-border/50" />

				{/* Dates */}
				{subscription.type !== "lifetime" && (
					<div className="flex items-center justify-between text-sm">
						<div className="flex flex-col gap-1">
							<span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
								Valid Until
							</span>
							<div className="flex items-center gap-1.5 font-medium">
								<CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
								{format(new Date(subscription.endDate), "MMM d, yyyy")}
							</div>
						</div>
					</div>
				)}
			</CardContent>

			{/* Active Indicator Bar */}
			{!isExpired && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
			)}
		</Card>
	);
}
