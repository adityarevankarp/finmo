import { Injectable , BadRequestException} from '@nestjs/common';
import { ParkingSlot, Car } from './entities/parking-lot.entity';
@Injectable()
export class ParkingLotService {
  private slots: Map<number, ParkingSlot>; // Key: slotNo, Value: ParkingSlot
  private totalSlots: number;

  constructor() {
    this.slots = new Map();
    this.totalSlots = 0;
  }

  // Initialize the parking lot with a given size
  initializeParkingLot(size: number): number {
    if (this.totalSlots > 0) {
      throw new BadRequestException('Parking lot already initialized');
    }
    if (size <= 0) {
      throw new BadRequestException('Size must be a positive number');
    }

    this.totalSlots = size;
    for (let i = 1; i <= size; i++) {
      this.slots.set(i, {
        slotNo: i,
        isOccupied: false,
      });
    }
    console.log('Slots:', Array.from(this.slots.entries()));
    return this.totalSlots;
  }
  expandParkingLot(increment: number): number {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }
    if (increment <= 0) {
      throw new BadRequestException('Increment must be a positive number');
    }

    const newSize = this.totalSlots + increment;
    for (let i = this.totalSlots + 1; i <= newSize; i++) {
      this.slots.set(i, {
        slotNo: i,
        isOccupied: false,
      });
    }
    this.totalSlots = newSize;
    return this.totalSlots;
  }
  parkCar(registrationNo: string, color: string): number {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    
    let occupiedCount = 0;
    for (const slot of this.slots.values()) {
      if (slot.isOccupied) occupiedCount++;
    }
    if (occupiedCount === this.totalSlots) {
      throw new BadRequestException('Parking lot is full');
    }

    
    for (let i = 1; i <= this.totalSlots; i++) {
      const slot = this.slots.get(i);
      if (slot && !slot.isOccupied) {
        slot.isOccupied = true;
        slot.car = { registrationNo, color };
        this.slots.set(i, slot);
        console.log(`Car parked in slot ${i}: ${registrationNo} (${color})`);
        this.printSlots();
        return i;
      }
    }
    throw new BadRequestException('No available parking slot found');
  }
  private printSlots() {
    console.log('Parking slots');
    this.slots.forEach((slot, slotNo) => {
      const carDetails = slot.isOccupied
        ? `Car - Registration No: ${slot.car?.registrationNo}, Color: ${slot.car?.color}`
        : 'Empty';
      console.log(`Slot ${slotNo}: ${carDetails}`);
    });
  }
}
