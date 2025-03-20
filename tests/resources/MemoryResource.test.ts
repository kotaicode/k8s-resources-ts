import { MemoryResource } from '../../src/resources/MemoryResource';

describe('MemoryResource', () => {
  describe('constructor', () => {
    it('should create from bytes', () => {
      const mem = new MemoryResource('100B');
      expect(mem.toString()).toBe('100B');
    });

    it('should create from kibibytes', () => {
      const mem = new MemoryResource('128Ki');
      expect(mem.toString()).toBe('128Ki');
    });

    it('should create from mebibytes', () => {
      const mem = new MemoryResource('128Mi');
      expect(mem.toString()).toBe('128Mi');
    });

    it('should create from gibibytes', () => {
      const mem = new MemoryResource('1Gi');
      expect(mem.toString()).toBe('1Gi');
    });

    it('should throw on invalid format', () => {
      expect(() => new MemoryResource('invalid')).toThrow('Invalid memory resource format');
    });

    it('should throw on invalid unit', () => {
      expect(() => new MemoryResource('100x')).toThrow('Invalid memory unit');
    });

    it('should throw on negative value', () => {
      expect(() => new MemoryResource('-100Mi')).toThrow('Memory resources cannot be negative');
    });

    // Edge cases
    it('should handle decimal values', () => {
      const mem = new MemoryResource('0.5Gi');
      expect(mem.toString()).toBe('512Mi');
    });

    it('should handle large byte values', () => {
      const mem = new MemoryResource('9999B');
      expect(mem.toString()).toBe('9.7646484375Ki');
    });

    it('should handle zero with unit', () => {
      const mem = new MemoryResource('0B');
      expect(mem.toString()).toBe('0B');
    });

    it('should handle zero without unit', () => {
      const mem = new MemoryResource('0');
      expect(mem.toString()).toBe('0B');
    });

    it('should handle empty string', () => {
      expect(() => new MemoryResource('')).toThrow('Invalid memory resource format');
    });

    it('should handle whitespace', () => {
      expect(() => new MemoryResource(' 100Mi')).toThrow('Invalid memory resource format');
    });

    it('should handle very large values', () => {
      const mem = new MemoryResource('2Ti');
      expect(mem.toString()).toBe('2048Gi');
    });
  });

  describe('static methods', () => {
    it('should create zero resource', () => {
      const mem = MemoryResource.zero();
      expect(mem.toString()).toBe('0B');
    });

    it('should create from bytes', () => {
      const mem = MemoryResource.fromBytes(1024);
      expect(mem.toString()).toBe('1Ki');
    });

    it('should create from kibibytes', () => {
      const mem = MemoryResource.fromKiB(128);
      expect(mem.toString()).toBe('128Ki');
    });

    it('should create from mebibytes', () => {
      const mem = MemoryResource.fromMiB(128);
      expect(mem.toString()).toBe('128Mi');
    });

    it('should create from gibibytes', () => {
      const mem = MemoryResource.fromGiB(1);
      expect(mem.toString()).toBe('1Gi');
    });

    // Edge cases
    it('should throw on negative bytes', () => {
      expect(() => MemoryResource.fromBytes(-100)).toThrow('Memory resources cannot be negative');
    });

    it('should throw on negative kibibytes', () => {
      expect(() => MemoryResource.fromKiB(-100)).toThrow('Memory resources cannot be negative');
    });

    it('should throw on negative mebibytes', () => {
      expect(() => MemoryResource.fromMiB(-100)).toThrow('Memory resources cannot be negative');
    });

    it('should throw on negative gibibytes', () => {
      expect(() => MemoryResource.fromGiB(-100)).toThrow('Memory resources cannot be negative');
    });

    it('should throw on non-finite bytes', () => {
      expect(() => MemoryResource.fromBytes(Infinity)).toThrow('Memory resources must be finite numbers');
    });

    it('should throw on non-finite kibibytes', () => {
      expect(() => MemoryResource.fromKiB(Infinity)).toThrow('Memory resources must be finite numbers');
    });

    it('should throw on non-finite mebibytes', () => {
      expect(() => MemoryResource.fromMiB(Infinity)).toThrow('Memory resources must be finite numbers');
    });

    it('should throw on non-finite gibibytes', () => {
      expect(() => MemoryResource.fromGiB(Infinity)).toThrow('Memory resources must be finite numbers');
    });
  });

  describe('arithmetic operations', () => {
    it('should add resources', () => {
      const mem1 = new MemoryResource('128Mi');
      const mem2 = new MemoryResource('1Gi');
      const sum = mem1.plus(mem2);
      expect(sum.toString()).toBe('1.125Gi');
    });

    it('should subtract resources', () => {
      const mem1 = new MemoryResource('1Gi');
      const mem2 = new MemoryResource('512Mi');
      const diff = mem1.minus(mem2);
      expect(diff.toString()).toBe('512Mi');
    });

    it('should multiply by factor', () => {
      const mem = new MemoryResource('512Mi');
      const result = mem.times(2);
      expect(result.toString()).toBe('1Gi');
    });

    it('should throw on negative result', () => {
      const mem1 = new MemoryResource('100Mi');
      const mem2 = new MemoryResource('200Mi');
      expect(() => mem1.minus(mem2)).toThrow('Memory resources cannot be negative');
    });

    // Edge cases
    it('should handle adding zero', () => {
      const mem = new MemoryResource('1Gi');
      const sum = mem.plus(MemoryResource.zero());
      expect(sum.toString()).toBe('1Gi');
    });

    it('should handle subtracting zero', () => {
      const mem = new MemoryResource('1Gi');
      const diff = mem.minus(MemoryResource.zero());
      expect(diff.toString()).toBe('1Gi');
    });

    it('should handle multiplying by zero', () => {
      const mem = new MemoryResource('1Gi');
      const result = mem.times(0);
      expect(result.toString()).toBe('0B');
    });

    it('should handle multiplying by one', () => {
      const mem = new MemoryResource('1Gi');
      const result = mem.times(1);
      expect(result.toString()).toBe('1Gi');
    });

    it('should throw on multiplying by negative factor', () => {
      const mem = new MemoryResource('1Gi');
      expect(() => mem.times(-1)).toThrow('Memory resources cannot be negative');
    });

    it('should throw on multiplying by non-finite factor', () => {
      const mem = new MemoryResource('1Gi');
      expect(() => mem.times(Infinity)).toThrow('Multiplication factor must be a finite number');
    });

    it('should handle unit conversion in addition', () => {
      const mem1 = new MemoryResource('1024Mi');
      const mem2 = new MemoryResource('1Gi');
      const sum = mem1.plus(mem2);
      expect(sum.toString()).toBe('2Gi');
    });
  });

  describe('comparison operations', () => {
    it('should compare equal resources', () => {
      const mem1 = new MemoryResource('1Gi');
      const mem2 = new MemoryResource('1024Mi');
      expect(mem1.equals(mem2)).toBe(true);
    });

    it('should compare less than', () => {
      const mem1 = new MemoryResource('512Mi');
      const mem2 = new MemoryResource('1Gi');
      expect(mem1.isLessThan(mem2)).toBe(true);
    });

    it('should compare greater than', () => {
      const mem1 = new MemoryResource('2Gi');
      const mem2 = new MemoryResource('1Gi');
      expect(mem1.isGreaterThan(mem2)).toBe(true);
    });

    // Edge cases
    it('should compare equal zero values', () => {
      const mem1 = new MemoryResource('0');
      const mem2 = new MemoryResource('0B');
      expect(mem1.equals(mem2)).toBe(true);
    });

    it('should compare equal values with different units', () => {
      const mem1 = new MemoryResource('1Gi');
      const mem2 = new MemoryResource('1024Mi');
      expect(mem1.equals(mem2)).toBe(true);
    });

    it('should handle comparing with zero', () => {
      const mem = new MemoryResource('1Gi');
      expect(mem.isGreaterThan(MemoryResource.zero())).toBe(true);
    });

    it('should compare values across multiple unit conversions', () => {
      const mem1 = new MemoryResource('1Ti');
      const mem2 = new MemoryResource('1024Gi');
      expect(mem1.equals(mem2)).toBe(true);
    });
  });
}); 