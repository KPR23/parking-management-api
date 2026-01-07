"use client";

import { differenceInMinutes, format, isToday } from "date-fns";
import {
	Activity,
	ArrowRight,
	Car,
	Clock,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParkingLots } from "@/hooks/use-parking-lots";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useTickets } from "@/hooks/use-tickets";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
	const { data: tickets } = useTickets();
	const { data: subscriptions } = useSubscriptions();
	const { data: parkingLots } = useParkingLots();

	const stats = useMemo(() => {
		// Revenue
		const totalRevenue =
			tickets?.reduce(
				(sum, ticket) => sum + (ticket.isPaid ? ticket.totalAmount || 0 : 0),
				0
			) ?? 0;

		const revenueToday =
			tickets?.reduce((sum, ticket) => {
				// Use ticket.paidAt if strictly available, else rely on isPaid check
				const isPaidToday =
					ticket.isPaid && ticket.paidAt && isToday(new Date(ticket.paidAt));
				return isPaidToday ? sum + (ticket.totalAmount || 0) : sum;
			}, 0) ?? 0;

		// Utilization
		const totalSpots =
			parkingLots?.reduce((sum, lot) => sum + lot.totalSpots, 0) ?? 1;
		const occupiedSpots =
			parkingLots?.reduce((sum, lot) => sum + lot.occupiedSpots, 0) ?? 0;

		// Activity Feed (Last 7 events - Entry or Exit)
		const events =
			tickets?.flatMap((ticket) => {
				const eventsList = [
					{
						id: `${ticket.id}-entry`,
						type: "entry",
						time: new Date(ticket.entryTime),
						ticket,
					},
				];

				if (ticket.exitTime) {
					eventsList.push({
						id: `${ticket.id}-exit`,
						type: "exit",
						time: new Date(ticket.exitTime),
						ticket,
					});
				}

				return eventsList;
			}) ?? [];

		const recentActivity = events
			.sort((a, b) => b.time.getTime() - a.time.getTime())
			.slice(0, 7);

		return {
			totalRevenue,
			revenueToday,
			occupiedSpots,
			totalSpots,
			recentActivity,
			activeSubscriptions: subscriptions?.length ?? 0,
		};
	}, [tickets, subscriptions, parkingLots]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-foreground">
						Overview
					</h2>
					<p className="text-muted-foreground mt-1">
						Metrics and performance indicators.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						Download Report
					</Button>
					<Button size="sm">Manage Access</Button>
				</div>
			</div>

			{/* Metrics Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.revenueToday.toLocaleString("pl-PL", {
								style: "currency",
								currency: "PLN",
							})}
						</div>
						<p className="text-xs text-muted-foreground mt-1">Daily earnings</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Occupancy</CardTitle>
						<Activity className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round((stats.occupiedSpots / stats.totalSpots) * 100)}%
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{stats.occupiedSpots} / {stats.totalSpots} spots filled
						</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Members
						</CardTitle>
						<Users className="h-4 w-4 text-indigo-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.activeSubscriptions}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Total active subscriptions
						</p>
					</CardContent>
				</Card>
				<Card className="shadow-sm bg-primary text-primary-foreground">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-primary-foreground/90">
							Total Value
						</CardTitle>
						<Users className="h-4 w-4 text-primary-foreground/70" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalRevenue.toLocaleString("pl-PL", {
								style: "currency",
								currency: "PLN",
								notation: "compact",
							})}
						</div>
						<p className="text-xs text-primary-foreground/70 mt-1">
							Lifetime revenue
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-7">
				{/* Parking Lots Status List */}
				<Card className="col-span-4 shadow-sm h-fit">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Live Occupancy</CardTitle>
						<Link
							href="/parking-lots"
							className="text-sm text-primary hover:underline flex items-center gap-1"
						>
							View All <ArrowRight className="w-3 h-3" />
						</Link>
					</CardHeader>
					<CardContent className="space-y-6">
						{parkingLots?.map((lot) => {
							const occupancy = (lot.occupiedSpots / lot.totalSpots) * 100;
							const isFull = occupancy >= 95;

							return (
								<div key={lot.id} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"w-2 h-2 rounded-full",
													isFull ? "bg-red-500" : "bg-green-500"
												)}
											/>
											<span className="font-medium">{lot.name}</span>
										</div>
										<span className="text-muted-foreground tabular-nums">
											{lot.occupiedSpots} / {lot.totalSpots} (
											{Math.round(occupancy)}%)
										</span>
									</div>
									{/* Clean progress bar */}
									<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
										<div
											className={cn(
												"h-full transition-all duration-500 rounded-full",
												isFull ? "bg-red-500" : "bg-primary"
											)}
											style={{ width: `${occupancy}%` }}
										/>
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>

				{/* Recent Activity Timeline */}
				<Card className="col-span-3 shadow-sm h-fit">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="relative border-l border-border/50 ml-3 space-y-6 pb-2">
							{stats.recentActivity.map((event, i) => (
								<div key={event.id} className="relative pl-6">
									<div
										className={cn(
											"absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background",
											event.type === "exit"
												? "bg-orange-500" // Exit
												: event.ticket.isPaid
													? "bg-green-500"
													: "bg-blue-500" // Entry (Paid vs Open)
										)}
									/>

									<div className="flex flex-col gap-0.5">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{event.ticket.car?.plateNumber}
											</span>
											<Badge
												variant="outline"
												className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider"
											>
												{event.type}
											</Badge>
										</div>
										<span className="text-xs text-muted-foreground">
											{event.type === "entry" ? "Entered" : "Exited"}{" "}
											{format(event.time, "HH:mm")} •{" "}
											{differenceInMinutes(new Date(), event.time)}m ago
										</span>
									</div>
								</div>
							))}

							{stats.recentActivity.length === 0 && (
								<div className="pl-6 text-sm text-muted-foreground">
									No recent activity.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
