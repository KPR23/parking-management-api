export interface ParkingLot {
	id: number;
	name: string;
	location?: string | null;
	totalSpots: number;
	occupiedSpots: number;
	pricePerHour: number;
	freeHoursPerDay: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateParkingLotDto {
	name: string;
	location?: string;
	totalSpots: number;
	pricePerHour?: number;
	freeHoursPerDay?: number;
}

export interface UpdateParkingLotDto {
	name?: string;
	location?: string;
	totalSpots?: number;
	pricePerHour?: number;
	freeHoursPerDay?: number;
}

export enum GateType {
	ENTRY = "ENTRY",
	EXIT = "EXIT",
}

export enum GateStatus {
	OPEN = "OPEN",
	CLOSED = "CLOSED",
	ERROR = "ERROR",
}

export interface Gate {
	id: number;
	deviceId: string;
	parkingLotId: number;
	type: GateType;
	status: GateStatus;
}

export interface Car {
	id: number;
	plateNumber: string;
}

export interface Ticket {
	id: number;
	entryTime: string;
	exitTime?: string | null;
	totalAmount?: number | null;
	isPaid: boolean;
	paidAt?: string | null;
	usedDailyFree: boolean;
	carId: number;
	parkingLotId: number;
}
