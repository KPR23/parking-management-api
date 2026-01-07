import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	CreateParkingLotDto,
	ParkingLot,
	UpdateParkingLotDto,
} from "@/types";

export const useParkingLots = () => {
	return useQuery({
		queryKey: ["parking-lots"],
		queryFn: () => api.get<ParkingLot[]>("/parking-lot"),
	});
};

export const useParkingLot = (id: number) => {
	return useQuery({
		queryKey: ["parking-lots", id],
		queryFn: () => api.get<ParkingLot>(`/parking-lot/${id}`),
		enabled: !!id,
	});
};

export const useCreateParkingLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateParkingLotDto) =>
			api.post<ParkingLot>("/parking-lot", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["parking-lots"] });
		},
	});
};

export const useUpdateParkingLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateParkingLotDto }) =>
			api.put<ParkingLot>(`/parking-lot/${id}`, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["parking-lots"] });
			queryClient.invalidateQueries({ queryKey: ["parking-lots", id] });
		},
	});
};

export const useDeleteParkingLot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => api.delete<ParkingLot>(`/parking-lot/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["parking-lots"] });
		},
	});
};
