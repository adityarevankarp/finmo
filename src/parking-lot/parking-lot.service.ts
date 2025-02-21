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
}
