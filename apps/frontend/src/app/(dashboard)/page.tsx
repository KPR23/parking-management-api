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

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="hover:scale-[1.02] transition-transform duration-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Revenue
						</CardTitle>
						<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
							<DollarSign className="h-4 w-4 text-primary" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold tracking-tight">
							{stats.totalRevenue.toLocaleString("pl-PL", {
								style: "currency",
								currency: "PLN",
							})}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Lifetime revenue generated
						</p>
					</CardContent>
				</Card>
				<Card className="hover:scale-[1.02] transition-transform duration-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Active Subscriptions
						</CardTitle>
						<div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
							<Users className="h-4 w-4 text-blue-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold tracking-tight">
							{stats.activeSubscriptions}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Current active subscribers
						</p>
					</CardContent>
				</Card>
				<Card className="hover:scale-[1.02] transition-transform duration-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Sales
						</CardTitle>
						<div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
							<CreditCard className="h-4 w-4 text-green-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold tracking-tight">
							{stats.totalSales}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Total paid tickets
						</p>
					</CardContent>
				</Card>
				<Card className="hover:scale-[1.02] transition-transform duration-200">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Active Now
						</CardTitle>
						<div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
							<Activity className="h-4 w-4 text-orange-500" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold tracking-tight">
							{stats.activeNow}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Currently occupied spots
						</p>
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
