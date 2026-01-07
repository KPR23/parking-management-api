"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ParkingLotCard } from "@/components/parking-lot-card";
import { Button } from "@/components/ui/button";
import { useDeleteParkingLot, useParkingLots } from "@/hooks/use-parking-lots";

export default function ParkingLotsPage() {
	const { data: parkingLots, isLoading, error } = useParkingLots();
	const deleteMutation = useDeleteParkingLot();

	const handleDelete = (id: number) => {
		if (confirm("Are you sure you want to delete this parking lot?")) {
			deleteMutation.mutate(id);
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading parking lots</div>;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Parking Lots</h2>
				<Button asChild>
					<Link href="/parking-lots/new">
						<Plus className="mr-2 h-4 w-4" /> Create New
					</Link>
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{parkingLots?.map((lot) => (
					<ParkingLotCard
						key={lot.id}
						parkingLot={lot}
						onDelete={handleDelete}
						onEdit={(lot) => console.log("Edit", lot)} // Placeholder for now
					/>
				))}
			</div>

			{parkingLots?.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No parking lots found. Create one to get started.
				</div>
			)}
		</div>
	);
}
