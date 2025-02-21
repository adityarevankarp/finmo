import { Controller, Post, Body, Patch,BadRequestException ,HttpCode, Get} from '@nestjs/common';
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
  @Post('park')
  park(@Body() body: { car_reg_no: string; car_color: string }) {
    return {
      allocated_slot_number: this.parkingLotService.parkCar(
        body.car_reg_no,
        body.car_color,
      ),
    };
  }
  @Post('clear')
  @HttpCode(200) // Return 200 instead of 201 since we're not creating
  clear(@Body() body: { slot_number?: number; car_registration_no?: string }) {
    if (body.slot_number !== undefined) {
      return {
        freed_slot_number: this.parkingLotService.clearSlotBySlotNo(body.slot_number),
      };
    }
    if (body.car_registration_no) {
      return {
        freed_slot_number: this.parkingLotService.clearSlotByRegNo(body.car_registration_no),
      };
    }
    throw new BadRequestException('Must provide either slot_number or car_registration_no');
  }
  @Get('status')
  getStatus() {
    return this.parkingLotService.getOccupiedSlots();
  }

}
