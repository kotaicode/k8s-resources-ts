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

    // Edge cases
    it('should handle decimal cores', () => {
      const cpu = new CPUResource('0.5');
      expect(cpu.toString()).toBe('500m');
    });

    it('should handle large millicore values', () => {
      const cpu = new CPUResource('9999m');
      expect(cpu.toString()).toBe('9.999');
    });

    it('should handle zero with unit', () => {
      const cpu = new CPUResource('0m');
      expect(cpu.toString()).toBe('0m');
    });

    it('should handle zero without unit', () => {
      const cpu = new CPUResource('0');
      expect(cpu.toString()).toBe('0m');
    });

    it('should handle empty string', () => {
      expect(() => new CPUResource('')).toThrow('Invalid CPU resource format');
    });

    it('should handle whitespace', () => {
      expect(() => new CPUResource(' 100m')).toThrow('Invalid CPU resource format');
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

    // Edge cases
    it('should throw on negative millicores', () => {
      expect(() => CPUResource.fromMillicores(-100)).toThrow('CPU resources cannot be negative');
    });

    it('should throw on negative cores', () => {
      expect(() => CPUResource.fromCores(-1)).toThrow('CPU resources cannot be negative');
    });

    it('should throw on non-finite millicores', () => {
      expect(() => CPUResource.fromMillicores(Infinity)).toThrow('CPU resources must be finite numbers');
    });

    it('should throw on non-finite cores', () => {
      expect(() => CPUResource.fromCores(Infinity)).toThrow('CPU resources must be finite numbers');
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

    // Edge cases
    it('should handle adding zero', () => {
      const cpu = new CPUResource('1');
      const sum = cpu.plus(CPUResource.zero());
      expect(sum.toString()).toBe('1');
    });

    it('should handle subtracting zero', () => {
      const cpu = new CPUResource('1');
      const diff = cpu.minus(CPUResource.zero());
      expect(diff.toString()).toBe('1');
    });

    it('should handle multiplying by zero', () => {
      const cpu = new CPUResource('1');
      const result = cpu.times(0);
      expect(result.toString()).toBe('0m');
    });

    it('should handle multiplying by one', () => {
      const cpu = new CPUResource('1');
      const result = cpu.times(1);
      expect(result.toString()).toBe('1');
    });

    it('should throw on multiplying by negative factor', () => {
      const cpu = new CPUResource('1');
      expect(() => cpu.times(-1)).toThrow('CPU resources cannot be negative');
    });

    it('should throw on multiplying by non-finite factor', () => {
      const cpu = new CPUResource('1');
      expect(() => cpu.times(Infinity)).toThrow('Multiplication factor must be a finite number');
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

    // Edge cases
    it('should compare equal zero values', () => {
      const cpu1 = new CPUResource('0');
      const cpu2 = new CPUResource('0m');
      expect(cpu1.equals(cpu2)).toBe(true);
    });

    it('should compare equal decimal values', () => {
      const cpu1 = new CPUResource('0.5');
      const cpu2 = new CPUResource('500m');
      expect(cpu1.equals(cpu2)).toBe(true);
    });

    it('should handle comparing with zero', () => {
      const cpu = new CPUResource('1');
      expect(cpu.isGreaterThan(CPUResource.zero())).toBe(true);
    });
  });
}); 