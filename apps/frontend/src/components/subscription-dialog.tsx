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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCreateSubscription,
	useRenewSubscription,
	useUpdateSubscription,
} from "@/hooks/use-subscriptions";
import type { Subscription } from "@/hooks/use-subscriptions";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
	plateNumber: z.string().min(1, "Plate number is required"),
	type: z.enum(["monthly", "yearly", "lifetime"]),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().optional(),
});

interface SubscriptionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	subscription?: Subscription; // If present, we are editing/extending
}

export function SubscriptionDialog({
	open,
	onOpenChange,
	subscription,
}: SubscriptionDialogProps) {
	const createMutation = useCreateSubscription();
	const renewMutation = useRenewSubscription();
	const updateMutation = useUpdateSubscription();

	const isEditing = !!subscription;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			plateNumber: "",
			type: "monthly",
			startDate: new Date().toISOString().split("T")[0],
		},
	});

	// Reset form only when dialog opens in creation mode
	useEffect(() => {
		if (!isEditing && open) {
			form.reset({
				plateNumber: "",
				type: "monthly",
				startDate: new Date().toISOString().split("T")[0],
			});
		}
	}, [isEditing, open, form]);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		// Creation Logic
		const calculateEndDate = (
			start: string,
			type: "monthly" | "yearly" | "lifetime"
		) => {
			const date = new Date(start);
			if (type === "monthly") date.setMonth(date.getMonth() + 1);
			if (type === "yearly") date.setFullYear(date.getFullYear() + 1);
			if (type === "lifetime") date.setFullYear(date.getFullYear() + 100);
			return date.toISOString();
		};

		const startDateIso = new Date(values.startDate).toISOString();
		let finalEndDate = "";

		if (values.endDate) {
			finalEndDate = new Date(values.endDate).toISOString();
		} else {
			finalEndDate = calculateEndDate(values.startDate, values.type);
		}

		const submissionData = {
			...values,
			startDate: startDateIso,
			endDate: finalEndDate,
		};

		createMutation.mutate(submissionData, {
			onSuccess: () => {
				onOpenChange(false);
			},
		});
	};

	const handleRenew = (type: "monthly" | "yearly" | "lifetime") => {
		if (!subscription) return;
		renewMutation.mutate(
			{ id: subscription.id, type },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	const handleSwitchPlan = (type: "monthly" | "yearly") => {
		if (!subscription) return;
		const startDate = new Date();
		const endDate = new Date(startDate);
		if (type === "monthly") endDate.setMonth(endDate.getMonth() + 1);
		if (type === "yearly") endDate.setFullYear(endDate.getFullYear() + 1);

		updateMutation.mutate(
			{
				id: subscription.id,
				type,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			}
		);
	};

	const isLoading =
		createMutation.isPending ||
		renewMutation.isPending ||
		updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Renew Subscription" : "New Subscription"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? `Manage subscription for ${subscription.car?.plateNumber}`
							: "Create a new parking subscription for a vehicle."}
					</DialogDescription>
				</DialogHeader>

				{isEditing ? (
					<div className="flex flex-col gap-4 py-4">
						<div className="grid gap-2 text-sm">
							<div className="flex justify-between border-b pb-2">
								<span className="text-muted-foreground">Current Plan:</span>
								<span className="font-medium capitalize">
									{subscription.type}
								</span>
							</div>
							<div className="flex justify-between border-b pb-2">
								<span className="text-muted-foreground">Valid Until:</span>
								<span className="font-medium">
									{new Date(subscription.endDate).toLocaleDateString()}
								</span>
							</div>
						</div>

						{subscription.type === "lifetime" ? (
							<div className="grid gap-3 pt-2">
								<div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 leading-relaxed">
									<strong>Note:</strong> Switching plans will replace your
									current Lifetime subscription. The new plan will start active
									from today.
								</div>
								<Button
									variant="outline"
									onClick={() => handleSwitchPlan("monthly")}
									disabled={isLoading}
									className="justify-between"
								>
									Switch to Monthly
									<span className="text-xs text-muted-foreground ml-2">
										(Starts Today)
									</span>
								</Button>
								<Button
									variant="outline"
									onClick={() => handleSwitchPlan("yearly")}
									disabled={isLoading}
									className="justify-between"
								>
									Switch to Yearly
									<span className="text-xs text-muted-foreground ml-2">
										(Starts Today)
									</span>
								</Button>
								<Button
									variant="ghost"
									disabled
									className="justify-between bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed border"
								>
									Lifetime Plan Active
									<span className="text-xs opacity-70 ml-2">(Forever)</span>
								</Button>
							</div>
						) : (
							<div className="grid gap-3 pt-2">
								<Button
									variant="outline"
									onClick={() => handleRenew("monthly")}
									disabled={isLoading}
									className="justify-between"
								>
									Extend by 1 Month
									<span className="text-xs text-muted-foreground ml-2">
										(+1 Mo)
									</span>
								</Button>
								<Button
									variant="outline"
									onClick={() => handleRenew("yearly")}
									disabled={isLoading}
									className="justify-between"
								>
									Extend by 1 Year
									<span className="text-xs text-muted-foreground ml-2">
										(+1 Yr)
									</span>
								</Button>
								<Button
									variant="default"
									onClick={() => handleRenew("lifetime")}
									disabled={isLoading}
									className="justify-between bg-zinc-900 text-white hover:bg-zinc-800"
								>
									Upgrade to Lifetime
									<span className="text-xs opacity-70 ml-2">(Forever)</span>
								</Button>
							</div>
						)}
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="plateNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>License Plate</FormLabel>
										<FormControl>
											<Input
												placeholder="WA12345"
												{...field}
												onChange={(e) =>
													field.onChange(e.target.value.toUpperCase())
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Plan Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select plan type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="monthly">Monthly</SelectItem>
													<SelectItem value="yearly">Yearly</SelectItem>
													<SelectItem value="lifetime">Lifetime</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Date</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Subscription
								</Button>
							</DialogFooter>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
