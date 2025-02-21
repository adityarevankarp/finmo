import { Injectable , BadRequestException, NotFoundException} from '@nestjs/common';
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
  clearSlotBySlotNo(slotNo: number): number {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    const slot = this.slots.get(slotNo);
    if (!slot || !slot.isOccupied) {
      throw new NotFoundException('Slot is already free or does not exist');
    }

    slot.isOccupied = false;
    slot.car = undefined;
    this.slots.set(slotNo, slot);
    this.printSlots();
    return slotNo;
  }

  clearSlotByRegNo(registrationNo: string): number {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    for (const [slotNo, slot] of this.slots) {
      if (slot.isOccupied && slot.car?.registrationNo === registrationNo) {
        slot.isOccupied = false;
        slot.car = undefined;
        this.slots.set(slotNo, slot);
        this.printSlots();
        return slotNo;
      }
    }
    throw new NotFoundException('Car with given registration number not found');
  }
  getOccupiedSlots(): { slot_no: number; registration_no: string; color: string }[] {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    const occupiedSlots: { slot_no: number; registration_no: string; color: string }[] = [];
    for (const slot of this.slots.values()) {
      if (slot.isOccupied && slot.car) {
        occupiedSlots.push({
          slot_no: slot.slotNo,
          registration_no: slot.car.registrationNo,
          color: slot.car.color,
        });
      }
    }
    return occupiedSlots;
  }
  getRegistrationNumbersByColor(color: string): string[] {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    const regNos: string[] = [];
    for (const slot of this.slots.values()) {
      if (slot.isOccupied && slot.car && slot.car.color.toLowerCase() === color.toLowerCase()) {
        regNos.push(slot.car.registrationNo);
      }
    }
    return regNos;
  }
  getSlotNumbersByColor(color: string): string[] {
    if (this.totalSlots === 0) {
      throw new BadRequestException('Parking lot not initialized yet');
    }

    const slotNos: string[] = [];
    for (const slot of this.slots.values()) {
      if (slot.isOccupied && slot.car && slot.car.color.toLowerCase() === color.toLowerCase()) {
        slotNos.push(slot.slotNo.toString());
      }
    }
    return slotNos;
  }
}
