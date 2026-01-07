"use client";

import { CreditCard, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Subscription, useSubscriptions } from "@/hooks/use-subscriptions";

export default function SubscriptionsPage() {
	const [inputValue, setInputValue] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedSubscription, setSelectedSubscription] = useState<
		Subscription | undefined
	>(undefined);

	const {
		data: subscriptions,
		isLoading,
		error,
	} = useSubscriptions(searchQuery, { enabled: !!searchQuery });

	const handleSearch = () => {
		setSearchQuery(inputValue);
	};

	const handleCreate = () => {
		setSelectedSubscription(undefined);
		setDialogOpen(true);
	};

	const handleEdit = (sub: Subscription) => {
		setSelectedSubscription(sub);
		setDialogOpen(true);
	};

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
				<div className="flex flex-col gap-2">
					<h2 className="text-3xl font-bold tracking-tight font-display">
						Subscriptions
					</h2>
					<p className="text-muted-foreground">
						Manage and view active parking memberships.
					</p>
				</div>
				<Button onClick={handleCreate}>
					<span className="mr-2">+</span> New Subscription
				</Button>
			</div>

			<div className="relative max-w-xl">
				<Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
				<Input
					placeholder="Search by Plate (e.g., WA12345)..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value.toUpperCase())}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					className="pl-12 pr-12 h-12 text-lg shadow-sm border-muted-foreground/20 focus-visible:border-primary transition-all rounded-lg"
				/>
				{isLoading ? (
					<div className="absolute right-4 top-3.5">
						<Loader2 className="h-5 w-5 text-primary animate-spin" />
					</div>
				) : (
					<div className="absolute right-2 top-2">
						<Button onClick={handleSearch} size="sm" className="h-8">
							Search
						</Button>
					</div>
				)}
			</div>

			{error && (
				<div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
					{error instanceof Error
						? error.message
						: "Error loading subscriptions"}
				</div>
			)}

			<div className="min-h-[400px]">
				{isLoading && !subscriptions ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="aspect-[1.586/1] rounded-lg bg-muted/20 animate-pulse border border-border/40"
							/>
						))}
					</div>
				) : (
					<>
						{/* Results Grid */}
						{subscriptions && subscriptions.length > 0 && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{subscriptions.map((sub) => (
									<div
										key={sub.id}
										className="animate-in zoom-in-95 duration-300 fill-mode-backwards"
										style={{ animationDelay: `${sub.id * 50}ms` }}
									>
										<SubscriptionCard
											subscription={sub}
											onEdit={() => handleEdit(sub)}
										/>
									</div>
								))}
							</div>
						)}

						{/* Empty State / Initial State */}
						{(!subscriptions || subscriptions.length === 0) && !isLoading && (
							<div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed">
								<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
									<CreditCard className="w-6 h-6 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold mb-1">
									{searchQuery ? "No subscriptions found" : "Ready to Search"}
								</h3>
								<p className="text-muted-foreground text-sm max-w-xs">
									{searchQuery
										? `We couldn't find any subscriptions for "${searchQuery}".`
										: "Enter a license plate to check membership status."}
								</p>
							</div>
						)}
					</>
				)}
			</div>

			<SubscriptionDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				subscription={selectedSubscription}
			/>
		</div>
	);
}
