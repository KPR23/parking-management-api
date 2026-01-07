"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	useCreateParkingLot,
	useUpdateParkingLot,
} from "@/hooks/use-parking-lots";
import type { ParkingLot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	location: z.string().min(1, "Location is required"),
	pricePerHour: z.coerce.number().min(0, "Price must be positive"),
	totalSpots: z.coerce.number().int().min(1, "Must have at least 1 spot"),
});

interface ParkingLotDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	parkingLot?: ParkingLot;
}

export function ParkingLotDialog({
	open,
	onOpenChange,
	parkingLot,
}: ParkingLotDialogProps) {
	const createMutation = useCreateParkingLot();
	const updateMutation = useUpdateParkingLot();

	const isEditing = !!parkingLot;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema) as any,
		defaultValues: {
			name: "",
			location: "",
			pricePerHour: 0,
			totalSpots: 100,
		},
	});

	useEffect(() => {
		if (parkingLot) {
			form.reset({
				name: parkingLot.name || "",
				location: parkingLot.location || "",
				pricePerHour: Number(parkingLot.pricePerHour) || 0,
				totalSpots: Number(parkingLot.totalSpots) || 100,
			});
		} else {
			form.reset({
				name: "",
				location: "",
				pricePerHour: 0,
				totalSpots: 100,
			});
		}
	}, [parkingLot, form, open]);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		if (isEditing) {
			updateMutation.mutate(
				{ id: parkingLot.id, data: values },
				{
					onSuccess: () => {
						onOpenChange(false);
					},
				}
			);
		} else {
			createMutation.mutate(values, {
				onSuccess: () => {
					onOpenChange(false);
				},
			});
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Parking Lot" : "Create Parking Lot"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Modify parking lot details, rates, and capacity."
							: "Add a new parking location to the system."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Downtown Garage" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location / Address</FormLabel>
									<FormControl>
										<Input placeholder="123 Main St" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="pricePerHour"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Hourly Rate (PLN)</FormLabel>
										<FormControl>
											<Input type="number" step="0.5" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="totalSpots"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Total Spots</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isEditing ? "Save Changes" : "Create Parking Lot"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
