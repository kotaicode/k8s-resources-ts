import { MemoryResource } from '../../src/resources/MemoryResource';

describe('MemoryResource', () => {
  describe('constructor', () => {
    it('should create from bytes', () => {
      const mem = new MemoryResource('1024B');
      expect(mem.toString()).toBe('1Ki');
    });

    it('should create from kibibytes', () => {
      const mem = new MemoryResource('128Ki');
      expect(mem.toString()).toBe('128Ki');
    });

    it('should create from mebibytes', () => {
      const mem = new MemoryResource('1Mi');
      expect(mem.toString()).toBe('1Mi');
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
      const mem = MemoryResource.fromMiB(1);
      expect(mem.toString()).toBe('1Mi');
    });

    it('should create from gibibytes', () => {
      const mem = MemoryResource.fromGiB(1);
      expect(mem.toString()).toBe('1Gi');
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
  });
}); 