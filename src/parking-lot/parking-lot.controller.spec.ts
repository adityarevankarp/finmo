
import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';
import { BadRequestException } from '@nestjs/common';

describe('ParkingLotController', () => {
  let controller: ParkingLotController;
  let service: ParkingLotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingLotController],
      providers: [ParkingLotService], // Include the service here
    }).compile();

    controller = module.get<ParkingLotController>(ParkingLotController);
    service = module.get<ParkingLotService>(ParkingLotService);
  });

  afterEach(() => {
    // Reset service state after each test
    service['slots'].clear();
    service['totalSlots'] = 0;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize parking lot and return total slots', () => {
      const result = controller.initialize(3);
      expect(result).toEqual({ total_slot: 3 });
    });

    it('should throw error if already initialized', () => {
      controller.initialize(3);
      expect(() => controller.initialize(2)).toThrow(BadRequestException);
    });
  });

  describe('expand', () => {
    it('should expand parking lot and return new total', () => {
      controller.initialize(2);
      const result = controller.expand(3);
      expect(result).toEqual({ total_slot: 5 });
    });

    it('should throw error if not initialized', () => {
      expect(() => controller.expand(3)).toThrow(BadRequestException);
    });
  });

  describe('park', () => {
    it('should park a car and return allocated slot', () => {
      controller.initialize(2);
      const result = controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      expect(result).toEqual({ allocated_slot_number: 1 });
    });

    it('should throw error if parking lot is full', () => {
      controller.initialize(1);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      expect(() =>
        controller.park({ car_reg_no: 'KA-02-CD-5678', car_color: 'black' }),
      ).toThrow(BadRequestException);
    });
  });

  describe('clear', () => {
    it('should clear slot by slot number', () => {
      controller.initialize(2);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      const result = controller.clear({ slot_number: 1 });
      expect(result).toEqual({ freed_slot_number: 1 });
    });

    it('should clear slot by registration number', () => {
      controller.initialize(2);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      const result = controller.clear({ car_registration_no: 'KA-01-AB-1234' });
      expect(result).toEqual({ freed_slot_number: 1 });
    });

    it('should throw error if neither slot_number nor car_registration_no provided', () => {
      controller.initialize(2);
      expect(() => controller.clear({})).toThrow(BadRequestException);
    });
  });

  describe('getStatus', () => {
    it('should return occupied slots', () => {
      controller.initialize(2);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      const result = controller.getStatus();
      expect(result).toEqual([{ slot_no: 1, registration_no: 'KA-01-AB-1234', color: 'white' }]);
    });
  });

  describe('getRegistrationNumbers', () => {
    it('should return registration numbers for a color', () => {
      controller.initialize(3);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      controller.park({ car_reg_no: 'KA-02-CD-5678', car_color: 'white' });
      const result = controller.getRegistrationNumbers('white');
      expect(result).toEqual(['KA-01-AB-1234', 'KA-02-CD-5678']);
    });
  });

  describe('getSlotNumbers', () => {
    it('should return slot numbers for a color', () => {
      controller.initialize(3);
      controller.park({ car_reg_no: 'KA-01-AB-1234', car_color: 'white' });
      controller.park({ car_reg_no: 'KA-02-CD-5678', car_color: 'white' });
      const result = controller.getSlotNumbers('white');
      expect(result).toEqual(['1', '2']);
    });
  });
});