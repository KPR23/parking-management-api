"use client";

import { Car, Edit, MapPin, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ParkingLot } from "@/types";

interface ParkingLotCardProps {
	parkingLot: ParkingLot;
	onEdit?: (parkingLot: ParkingLot) => void;
	onDelete?: (id: number) => void;
}

export function ParkingLotCard({
	parkingLot,
	onEdit,
	onDelete,
}: ParkingLotCardProps) {
	const occupancyPercentage =
		(parkingLot.occupiedSpots / parkingLot.totalSpots) * 100;
	const isFull = occupancyPercentage >= 90;

	return (
		<Card className="overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xl font-bold truncate">
					{parkingLot.name}
				</CardTitle>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onEdit?.(parkingLot)}
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-destructive"
						onClick={() => onDelete?.(parkingLot.id)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2 text-sm text-muted-foreground mb-4">
					<div className="flex items-center">
						<MapPin className="mr-2 h-4 w-4" />
						{parkingLot.location || "No location set"}
					</div>
					<div className="flex items-center">
						<Car className="mr-2 h-4 w-4" />
						{parkingLot.totalSpots - parkingLot.occupiedSpots} spots available
					</div>
				</div>

				<div className="mt-4 space-y-2">
					<div className="flex justify-between text-xs font-medium">
						<span>Occupancy</span>
						<span className={isFull ? "text-destructive" : "text-primary"}>
							{Math.round(occupancyPercentage)}%
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
						<div
							className={`h-full transition-all duration-300 ${
								isFull ? "bg-destructive" : "bg-primary"
							}`}
							style={{ width: `${occupancyPercentage}%` }}
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter className="bg-muted/50 p-4">
				<div className="w-full flex justify-between items-center text-sm font-medium">
					<span>{parkingLot.pricePerHour.toLocaleString()} PLN / hr</span>
					<Badge variant={isFull ? "destructive" : "secondary"}>
						{isFull ? "Full" : "Open"}
					</Badge>
				</div>
			</CardFooter>
		</Card>
	);
}
