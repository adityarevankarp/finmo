
import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotService } from './parking-lot.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingLotService', () => {
  let service: ParkingLotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingLotService],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
  });

  afterEach(() => {
    // Reset the service state between tests
    service['slots'].clear();
    service['totalSlots'] = 0;
  });

  describe('initializeParkingLot', () => {
    it('should initialize parking lot with given size', () => {
      const size = 3;
      expect(service.initializeParkingLot(size)).toBe(size);
      expect(service['slots'].size).toBe(size);
    });

    it('should throw error if already initialized', () => {
      service.initializeParkingLot(3);
      expect(() => service.initializeParkingLot(2)).toThrow(BadRequestException);
      expect(() => service.initializeParkingLot(2)).toThrow('Parking lot already initialized');
    });

    it('should throw error if size is not positive', () => {
      expect(() => service.initializeParkingLot(0)).toThrow(BadRequestException);
      expect(() => service.initializeParkingLot(-1)).toThrow('Size must be a positive number');
    });
  });

  describe('expandParkingLot', () => {
    it('should expand parking lot by given increment', () => {
      service.initializeParkingLot(2);
      expect(service.expandParkingLot(3)).toBe(5);
      expect(service['slots'].size).toBe(5);
    });

    it('should throw error if not initialized', () => {
      expect(() => service.expandParkingLot(3)).toThrow(BadRequestException);
      expect(() => service.expandParkingLot(3)).toThrow('Parking lot not initialized yet');
    });

    it('should throw error if increment is not positive', () => {
      service.initializeParkingLot(2);
      expect(() => service.expandParkingLot(0)).toThrow(BadRequestException);
      expect(() => service.expandParkingLot(-1)).toThrow('Increment must be a positive number');
    });
  });

  describe('parkCar', () => {
    it('should park a car in the first available slot', () => {
      service.initializeParkingLot(3);
      expect(service.parkCar('KA-01-AB-1234', 'white')).toBe(1);
      expect(service['slots'].get(1)!.isOccupied).toBe(true);
      expect(service['slots'].get(1)!.car).toEqual({ registrationNo: 'KA-01-AB-1234', color: 'white' });
    });

    it('should throw error if parking lot is full', () => {
      service.initializeParkingLot(2);
      service.parkCar('KA-01-AB-1234', 'white');
      service.parkCar('KA-02-CD-5678', 'black');
      expect(() => service.parkCar('KA-03-EF-9012', 'red')).toThrow(BadRequestException);
      expect(() => service.parkCar('KA-03-EF-9012', 'red')).toThrow('Parking lot is full');
    });

    it('should throw error if not initialized', () => {
      expect(() => service.parkCar('KA-01-AB-1234', 'white')).toThrow(BadRequestException);
      expect(() => service.parkCar('KA-01-AB-1234', 'white')).toThrow('Parking lot not initialized yet');
    });
  });

  describe('clearSlotBySlotNo', () => {
    it('should clear a slot by slot number', () => {
      service.initializeParkingLot(2);
      service.parkCar('KA-01-AB-1234', 'white');
      expect(service.clearSlotBySlotNo(1)).toBe(1);
      expect(service['slots'].get(1)!.isOccupied).toBe(false);
      expect(service['slots'].get(1)!.car).toBeUndefined();
    });

    it('should throw error if slot is already free', () => {
      service.initializeParkingLot(2);
      expect(() => service.clearSlotBySlotNo(1)).toThrow(NotFoundException);
      expect(() => service.clearSlotBySlotNo(1)).toThrow('Slot is already free or does not exist');
    });

    it('should throw error if slot does not exist', () => {
      service.initializeParkingLot(2);
      expect(() => service.clearSlotBySlotNo(3)).toThrow(NotFoundException);
    });
  });

  describe('clearSlotByRegNo', () => {
    it('should clear a slot by registration number', () => {
      service.initializeParkingLot(2);
      service.parkCar('KA-01-AB-1234', 'white');
      expect(service.clearSlotByRegNo('KA-01-AB-1234')).toBe(1);
      expect(service['slots'].get(1)!.isOccupied).toBe(false);
    });

    it('should throw error if car not found', () => {
      service.initializeParkingLot(2);
      expect(() => service.clearSlotByRegNo('KA-01-AB-1234')).toThrow(NotFoundException);
      expect(() => service.clearSlotByRegNo('KA-01-AB-1234')).toThrow('Car with given registration number not found');
    });
  });

  describe('getOccupiedSlots', () => {
    it('should return all occupied slots', () => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-AB-1234', 'white');
      service.parkCar('KA-02-CD-5678', 'black');
      const result = service.getOccupiedSlots();
      expect(result).toEqual([
        { slot_no: 1, registration_no: 'KA-01-AB-1234', color: 'white' },
        { slot_no: 2, registration_no: 'KA-02-CD-5678', color: 'black' },
      ]);
    });

    it('should return empty array if no slots occupied', () => {
      service.initializeParkingLot(2);
      expect(service.getOccupiedSlots()).toEqual([]);
    });
  });

  describe('getRegistrationNumbersByColor', () => {
    it('should return registration numbers for a given color', () => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-AB-1234', 'white');
      service.parkCar('KA-02-CD-5678', 'black');
      service.parkCar('KA-03-EF-9012', 'white');
      expect(service.getRegistrationNumbersByColor('white')).toEqual(['KA-01-AB-1234', 'KA-03-EF-9012']);
      expect(service.getRegistrationNumbersByColor('black')).toEqual(['KA-02-CD-5678']);
    });

    it('should return empty array if no cars of that color', () => {
      service.initializeParkingLot(2);
      expect(service.getRegistrationNumbersByColor('red')).toEqual([]);
    });
  });

  describe('getSlotNumbersByColor', () => {
    it('should return slot numbers for a given color', () => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-AB-1234', 'white');
      service.parkCar('KA-02-CD-5678', 'black');
      service.parkCar('KA-03-EF-9012', 'white');
      expect(service.getSlotNumbersByColor('white')).toEqual(['1', '3']);
      expect(service.getSlotNumbersByColor('black')).toEqual(['2']);
    });

    it('should return empty array if no cars of that color', () => {
      service.initializeParkingLot(2);
      expect(service.getSlotNumbersByColor('red')).toEqual([]);
    });
  });
});