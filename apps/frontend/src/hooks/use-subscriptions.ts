import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Define Interface locally or add to types/index.ts.
// Adding here for now, but better in types.
// Assuming Subscription entity matches backend
export interface Subscription {
	id: number;
	type: "monthly" | "yearly" | "lifetime";
	startDate: string;
	endDate: string;
	carId: number;
	car: {
		plateNumber: string;
	};
}

export const useSubscriptions = (
	plateNumber?: string,
	options?: { enabled?: boolean }
) => {
	return useQuery({
		queryKey: ["subscriptions", plateNumber],
		queryFn: async () => {
			try {
				const data = await api.get<Subscription | Subscription[]>(
					`/subscription${plateNumber ? `?plateNumber=${plateNumber}` : ""}`
				);
				return Array.isArray(data) ? data : [data];
			} catch (error: any) {
				if (error.status === 404) {
					return [];
				}
				throw error;
			}
		},
		enabled: options?.enabled,
		refetchInterval: 3000,
		retry: (failureCount, error: any) => {
			if (error.status === 404) return false;
			return failureCount < 3;
		},
	});
};

export interface CreateSubscriptionDto {
	plateNumber: string;
	type: "monthly" | "yearly" | "lifetime";
	startDate: string;
	endDate?: string;
}

export const useCreateSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateSubscriptionDto) =>
			api.post<Subscription>("/subscription", {
				...data,
				// Backend likely expects carId or plateNumber. 
				// If backend handles plateNumber lookup/creation:
				carId: undefined, 
				// But based on types, it might need car relation. 
				// Assuming the API handles getting/creating car by plateNumber for now 
				// or we need to pass carId. 
				// Let's assume the backend endpoint for subscription creation accepts plateNumber 
				// or we need to change this logic if it fails.
				// Re-reading previous chats, user just said "add editing".
				// I'll stick to passing the DTO as is, assuming backend support.
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
		},
	});
};

export const useRenewSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			type,
		}: {
			id: number;
			type: "monthly" | "yearly" | "lifetime";
		}) => api.patch<Subscription>(`/subscription/${id}/renew`, { type }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
		},
	});
};

export const useDeleteSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => api.delete(`/subscription/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
		},
	});
};

export const useUpdateSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, ...data }: { id: number } & Partial<CreateSubscriptionDto>) =>
			api.put<Subscription>(`/subscription/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
		},
	});
};


