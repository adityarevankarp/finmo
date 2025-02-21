import { Controller, Post, Body, Patch,BadRequestException ,HttpCode, Get,Param} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller()
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) {}


  //Route to initialize the parkinglot(Map)
  @Post('parking_lot')
  initialize(@Body('no_of_slot') size: number) {
    return {
      total_slot: this.parkingLotService.initializeParkingLot(size),
    };
  }


  //route to add extra slots, adds extra slots to the maps existing size
  @Patch('parking_lot')
  expand(@Body('increment_slot') increment: number) {
    return {
      total_slot: this.parkingLotService.expandParkingLot(increment),
    };
  }


  //Parking service takes in the carRegNo and Color and return the alloted slot no.
  @Post('park')
  park(@Body() body: { car_reg_no: string; car_color: string }) {
    return {
      allocated_slot_number: this.parkingLotService.parkCar(
        body.car_reg_no,
        body.car_color,
      ),
    };
  }



  //Clearning slot when this api is called.
  @Post('clear')
  @HttpCode(200) 
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


  //Route to get the status ie get info about all the cars parked...
  @Get('status')
  getStatus() {
    return this.parkingLotService.getOccupiedSlots();
  }


  //route to fetch registration numbers of cars given by color.
  @Get('registration_numbers/:color')
  getRegistrationNumbers(@Param('color') color: string) {
    return this.parkingLotService.getRegistrationNumbersByColor(color);
  }

  //Route to fetch slot no alloted to the car given by color.
  @Get('slot_numbers/:color')
  getSlotNumbers(@Param('color') color: string) {
    return this.parkingLotService.getSlotNumbersByColor(color);
  }

}
