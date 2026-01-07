"use client";

import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useMemo } from "react";
import ApiTest from "@/components/api-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParkingLots } from "@/hooks/use-parking-lots";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useTickets } from "@/hooks/use-tickets";

export default function DashboardPage() {
	const { data: tickets } = useTickets();
	const { data: subscriptions } = useSubscriptions();
	const { data: parkingLots } = useParkingLots();

	const stats = useMemo(() => {
		const totalRevenue =
			tickets?.reduce(
				(sum, ticket) => sum + (ticket.isPaid ? ticket.totalAmount || 0 : 0),
				0
			) ?? 0;

		const totalSales = tickets?.filter((t) => t.isPaid).length ?? 0;

		const activeSubscriptions =
			subscriptions?.filter((s) => new Date(s.endDate) > new Date()).length ??
			0;

		const activeNow =
			parkingLots?.reduce((sum, lot) => sum + lot.occupiedSpots, 0) ?? 0;

		return {
			totalRevenue,
			totalSales,
			activeSubscriptions,
			activeNow,
		};
	}, [tickets, subscriptions, parkingLots]);

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalRevenue.toLocaleString("pl-PL", {
								style: "currency",
								currency: "PLN",
							})}
						</div>
						<p className="text-xs text-muted-foreground">Lifetime revenue</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Subscriptions
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.activeSubscriptions}
						</div>
						<p className="text-xs text-muted-foreground">Current subscribers</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalSales}</div>
						<p className="text-xs text-muted-foreground">Paid tickets</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Now</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.activeNow}</div>
						<p className="text-xs text-muted-foreground">Occupied spots</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Parking Lot Status</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							{parkingLots?.map((lot) => (
								<div key={lot.id} className="flex items-center">
									<div className="ml-4 space-y-1">
										<p className="text-sm font-medium leading-none">
											{lot.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{lot.location || "No location"}
										</p>
									</div>
									<div className="ml-auto font-medium">
										{lot.occupiedSpots} / {lot.totalSpots} spots
									</div>
								</div>
							))}
							{parkingLots?.length === 0 && (
								<div className="text-sm text-muted-foreground">
									No parking lots found.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
