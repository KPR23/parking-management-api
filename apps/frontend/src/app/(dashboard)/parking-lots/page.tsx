"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ParkingLotCard } from "@/components/parking-lot-card";
import { ParkingLotDialog } from "@/components/parking-lot-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteParkingLot, useParkingLots } from "@/hooks/use-parking-lots";
import type { ParkingLot } from "@/types";

export default function ParkingLotsPage() {
	const { data: parkingLots, isLoading, error } = useParkingLots();
	const deleteMutation = useDeleteParkingLot();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedLot, setSelectedLot] = useState<ParkingLot | undefined>(
		undefined
	);

	const handleDelete = (id: number) => {
		if (confirm("Are you sure you want to delete this parking lot?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleCreate = () => {
		setSelectedLot(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (lot: ParkingLot) => {
		setSelectedLot(lot);
		setDialogOpen(true);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading parking lots</div>;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between border-b pb-6">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Parking Lots</h2>
					<p className="text-muted-foreground mt-1">
						Manage parking locations and rates.
					</p>
				</div>
				<Button onClick={handleCreate}>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{parkingLots?.map((lot) => (
					<ParkingLotCard
						key={lot.id}
						parkingLot={lot}
						onDelete={handleDelete}
						onEdit={handleEdit}
					/>
				))}
			</div>

			{parkingLots?.length === 0 && (
				<div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
					No parking lots found. Create one to get started.
				</div>
			)}

			<ParkingLotDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				parkingLot={selectedLot}
			/>
		</div>
	);
}
