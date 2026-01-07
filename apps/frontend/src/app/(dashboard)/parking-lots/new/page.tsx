"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateParkingLot } from "@/hooks/use-parking-lots";

export default function CreateParkingLotPage() {
	const router = useRouter();
	const createMutation = useCreateParkingLot();
	const id = useId();
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		totalSpots: "",
		pricePerHour: "",
		freeHoursPerDay: "2",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createMutation.mutateAsync({
				name: formData.name,
				location: formData.location,
				totalSpots: parseInt(formData.totalSpots),
				pricePerHour: parseFloat(formData.pricePerHour),
				freeHoursPerDay: parseInt(formData.freeHoursPerDay),
			});
			router.push("/parking-lots");
			router.refresh();
		} catch (error) {
			console.error("Failed to create", error);
			alert("Failed to create parking lot. Ensure name is unique.");
		}
	};

	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/parking-lots">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h2 className="text-3xl font-bold tracking-tight">
					Create Parking Lot
				</h2>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Parking Lot Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={`${id}-name`}>Name</Label>
							<Input
								id={`${id}-name`}
								name="name"
								placeholder="e.g. Central Station Parking"
								required
								value={formData.name}
								onChange={handleChange}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`${id}-location`}>Location</Label>
							<Input
								id={`${id}-location`}
								name="location"
								placeholder="e.g. 123 Main St"
								required
								value={formData.location}
								onChange={handleChange}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={`${id}-totalSpots`}>Total Spots</Label>
								<Input
									id={`${id}-totalSpots`}
									name="totalSpots"
									type="number"
									min="1"
									placeholder="100"
									required
									value={formData.totalSpots}
									onChange={handleChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`${id}-pricePerHour`}>Price (PLN/hr)</Label>
								<Input
									id={`${id}-pricePerHour`}
									name="pricePerHour"
									type="number"
									min="0"
									step="0.1"
									placeholder="5.0"
									required
									value={formData.pricePerHour}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={`${id}-freeHoursPerDay`}>Free Hours / Day</Label>
							<Input
								id={`${id}-freeHoursPerDay`}
								name="freeHoursPerDay"
								type="number"
								min="0"
								placeholder="2"
								required
								value={formData.freeHoursPerDay}
								onChange={handleChange}
							/>
						</div>

						<div className="flex justify-end pt-4">
							<Button type="submit" disabled={createMutation.isPending}>
								{createMutation.isPending
									? "Creating..."
									: "Create Parking Lot"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
