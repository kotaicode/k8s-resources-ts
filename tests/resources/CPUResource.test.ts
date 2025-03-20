import { CPUResource } from '../../src/resources/CPUResource';

describe('CPUResource', () => {
  describe('constructor', () => {
    it('should create from millicores', () => {
      const cpu = new CPUResource('100m');
      expect(cpu.toString()).toBe('100m');
    });

    it('should create from cores', () => {
      const cpu = new CPUResource('1');
      expect(cpu.toString()).toBe('1');
    });

    it('should throw on invalid format', () => {
      expect(() => new CPUResource('invalid')).toThrow('Invalid CPU resource format');
    });

    it('should throw on invalid unit', () => {
      expect(() => new CPUResource('100x')).toThrow('Invalid CPU unit');
    });

    it('should throw on negative value', () => {
      expect(() => new CPUResource('-100m')).toThrow('CPU resources cannot be negative');
    });
  });

  describe('static methods', () => {
    it('should create zero resource', () => {
      const cpu = CPUResource.zero();
      expect(cpu.toString()).toBe('0m');
    });

    it('should create from millicores', () => {
      const cpu = CPUResource.fromMillicores(500);
      expect(cpu.toString()).toBe('500m');
    });

    it('should create from cores', () => {
      const cpu = CPUResource.fromCores(2);
      expect(cpu.toString()).toBe('2');
    });
  });

  describe('arithmetic operations', () => {
    it('should add resources', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('1');
      const sum = cpu1.plus(cpu2);
      expect(sum.toString()).toBe('1.1');
    });

    it('should subtract resources', () => {
      const cpu1 = new CPUResource('1');
      const cpu2 = new CPUResource('500m');
      const diff = cpu1.minus(cpu2);
      expect(diff.toString()).toBe('500m');
    });

    it('should multiply by factor', () => {
      const cpu = new CPUResource('500m');
      const result = cpu.times(2);
      expect(result.toString()).toBe('1');
    });

    it('should throw on negative result', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('200m');
      expect(() => cpu1.minus(cpu2)).toThrow('CPU resources cannot be negative');
    });
  });

  describe('comparison operations', () => {
    it('should compare equal resources', () => {
      const cpu1 = new CPUResource('1');
      const cpu2 = new CPUResource('1000m');
      expect(cpu1.equals(cpu2)).toBe(true);
    });

    it('should compare less than', () => {
      const cpu1 = new CPUResource('500m');
      const cpu2 = new CPUResource('1');
      expect(cpu1.isLessThan(cpu2)).toBe(true);
    });

    it('should compare greater than', () => {
      const cpu1 = new CPUResource('2');
      const cpu2 = new CPUResource('1');
      expect(cpu1.isGreaterThan(cpu2)).toBe(true);
    });
  });
}); 