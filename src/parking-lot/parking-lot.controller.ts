import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller()
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post('parking_lot')
  initialize(@Body('no_of_slot') size: number) {
    return {
      total_slot: this.parkingLotService.initializeParkingLot(size),
    };
  }
  @Patch('parking_lot')
  expand(@Body('increment_slot') increment: number) {
    return {
      total_slot: this.parkingLotService.expandParkingLot(increment),
    };
  }
}
