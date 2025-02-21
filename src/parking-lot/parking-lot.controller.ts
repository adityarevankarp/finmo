import { Controller, Post, Body } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking_lot')
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  initialize(@Body('no_of_slot') size: number) {
    return {
      total_slot: this.parkingLotService.initializeParkingLot(size),
    };
  }
}
