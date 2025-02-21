import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';

@Module({
  controllers: [ParkingLotController],
  providers: [ParkingLotService]
})
export class ParkingLotModule {}
