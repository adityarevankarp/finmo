export interface Car {
    registrationNo: string;
    color: string;
  }
  
  export interface ParkingSlot {
    slotNo: number;
    car?: Car; // Optional, since a slot might be empty
    isOccupied: boolean;
  }