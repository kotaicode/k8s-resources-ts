import { CPUResource, MemoryResource } from './index';

describe('CPUResource', () => {
  describe('parsing and validation', () => {
    it('should parse CPU resources correctly', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('1');
      
      expect(String(cpu1)).toBe('100m');
      expect(String(cpu2)).toBe('1');
    });

    it('should reject invalid formats', () => {
      expect(() => new CPUResource('')).toThrow('Invalid CPU resource format');
      expect(() => new CPUResource('abc')).toThrow('Invalid CPU resource format');
      expect(() => new CPUResource('1.5.5')).toThrow('Invalid CPU resource format');
      expect(() => new CPUResource('100mm')).toThrow('Invalid CPU unit');
      expect(() => new CPUResource('100g')).toThrow('Invalid CPU unit');
    });

    it('should reject negative values', () => {
      expect(() => new CPUResource('-100m')).toThrow('Invalid CPU resource format');
      expect(() => CPUResource.fromMillicores(-100)).toThrow('CPU resources cannot be negative');
      expect(() => CPUResource.fromCores(-1)).toThrow('CPU resources cannot be negative');
    });

    it('should reject non-finite values', () => {
      expect(() => CPUResource.fromMillicores(Infinity)).toThrow('CPU resources must be finite numbers');
      expect(() => CPUResource.fromMillicores(NaN)).toThrow('CPU resources must be finite numbers');
    });

    it('should reject fractional millicores', () => {
      expect(() => CPUResource.fromMillicores(0.5)).toThrow('CPU resources must be whole numbers of millicores');
      expect(() => new CPUResource('1.5m')).toThrow('CPU resources must be whole numbers of millicores');
    });
  });

  describe('static factory methods', () => {
    it('should create resources from different units', () => {
      const zero = CPUResource.zero();
      const fromMillicores = CPUResource.fromMillicores(500);
      const fromCores = CPUResource.fromCores(2);

      expect(String(zero)).toBe('0m');
      expect(String(fromMillicores)).toBe('500m');
      expect(String(fromCores)).toBe('2');
    });
  });

  describe('arithmetic operations', () => {
    it('should add CPU resources correctly', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('200m');
      const result = cpu1.plus(cpu2);
      expect(String(result)).toBe('300m');
    });

    it('should subtract CPU resources correctly', () => {
      const cpu1 = new CPUResource('500m');
      const cpu2 = new CPUResource('200m');
      const result = cpu1.minus(cpu2);
      expect(String(result)).toBe('300m');
    });

    it('should reject negative results from subtraction', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('200m');
      expect(() => cpu1.minus(cpu2)).toThrow('CPU resources cannot be negative');
    });

    it('should multiply CPU resources correctly', () => {
      const cpu = new CPUResource('100m');
      const result = cpu.times(3);
      expect(String(result)).toBe('300m');
    });

    it('should reject invalid multiplication factors', () => {
      const cpu = new CPUResource('100m');
      expect(() => cpu.times(Infinity)).toThrow('Multiplication factor must be a finite number');
      expect(() => cpu.times(NaN)).toThrow('Multiplication factor must be a finite number');
      expect(() => cpu.times(-1)).toThrow('CPU resources cannot be negative');
    });

    it('should handle CPU core values correctly', () => {
      const cpu1 = new CPUResource('1');
      const cpu2 = new CPUResource('500m');
      const result = cpu1.plus(cpu2);
      expect(String(result)).toBe('1.5');
    });
  });

  describe('comparison operations', () => {
    it('should compare CPU resources correctly', () => {
      const cpu1 = new CPUResource('100m');
      const cpu2 = new CPUResource('200m');
      const cpu3 = new CPUResource('100m');

      expect(cpu1.isLessThan(cpu2)).toBe(true);
      expect(cpu2.isGreaterThan(cpu1)).toBe(true);
      expect(cpu1.equals(cpu3)).toBe(true);
    });
  });
});

describe('MemoryResource', () => {
  describe('parsing and validation', () => {
    it('should parse memory resources correctly', () => {
      const mem1 = new MemoryResource('128Mi');
      const mem2 = new MemoryResource('1Gi');
      
      expect(String(mem1)).toBe('128Mi');
      expect(String(mem2)).toBe('1Gi');
    });

    it('should reject invalid formats', () => {
      expect(() => new MemoryResource('')).toThrow('Invalid memory resource format');
      expect(() => new MemoryResource('abc')).toThrow('Invalid memory resource format');
      expect(() => new MemoryResource('1.5.5')).toThrow('Invalid memory resource format');
      expect(() => new MemoryResource('100M')).toThrow('Invalid memory unit');
      expect(() => new MemoryResource('100G')).toThrow('Invalid memory unit');
    });

    it('should reject negative values', () => {
      expect(() => new MemoryResource('-100Mi')).toThrow('Invalid memory resource format');
      expect(() => MemoryResource.fromBytes(-100)).toThrow('Memory resources cannot be negative');
      expect(() => MemoryResource.fromMiB(-1)).toThrow('Memory resources cannot be negative');
    });

    it('should reject non-finite values', () => {
      expect(() => MemoryResource.fromBytes(Infinity)).toThrow('Memory resources must be finite numbers');
      expect(() => MemoryResource.fromBytes(NaN)).toThrow('Memory resources must be finite numbers');
    });

    it('should reject fractional bytes', () => {
      expect(() => MemoryResource.fromBytes(0.5)).toThrow('Memory resources must be whole numbers of bytes');
      expect(() => new MemoryResource('1.5B')).toThrow('Memory resources must be whole numbers of bytes');
    });
  });

  describe('static factory methods', () => {
    it('should create resources from different units', () => {
      const zero = MemoryResource.zero();
      const fromBytes = MemoryResource.fromBytes(1024);
      const fromKiB = MemoryResource.fromKiB(128);
      const fromMiB = MemoryResource.fromMiB(256);
      const fromGiB = MemoryResource.fromGiB(1);

      expect(String(zero)).toBe('0B');
      expect(String(fromBytes)).toBe('1Ki');
      expect(String(fromKiB)).toBe('128Ki');
      expect(String(fromMiB)).toBe('256Mi');
      expect(String(fromGiB)).toBe('1Gi');
    });
  });

  describe('arithmetic operations', () => {
    it('should add memory resources correctly', () => {
      const mem1 = new MemoryResource('128Mi');
      const mem2 = new MemoryResource('256Mi');
      const result = mem1.plus(mem2);
      expect(String(result)).toBe('384Mi');
    });

    it('should subtract memory resources correctly', () => {
      const mem1 = new MemoryResource('1Gi');
      const mem2 = new MemoryResource('512Mi');
      const result = mem1.minus(mem2);
      expect(String(result)).toBe('512Mi');
    });

    it('should reject negative results from subtraction', () => {
      const mem1 = new MemoryResource('128Mi');
      const mem2 = new MemoryResource('256Mi');
      expect(() => mem1.minus(mem2)).toThrow('Memory resources cannot be negative');
    });

    it('should multiply memory resources correctly', () => {
      const mem = new MemoryResource('128Mi');
      const result = mem.times(2);
      expect(String(result)).toBe('256Mi');
    });

    it('should reject invalid multiplication factors', () => {
      const mem = new MemoryResource('128Mi');
      expect(() => mem.times(Infinity)).toThrow('Multiplication factor must be a finite number');
      expect(() => mem.times(NaN)).toThrow('Multiplication factor must be a finite number');
      expect(() => mem.times(-1)).toThrow('Memory resources cannot be negative');
    });

    it('should handle different memory units correctly', () => {
      const mem1 = new MemoryResource('1Gi');
      const mem2 = new MemoryResource('512Mi');
      const result = mem1.plus(mem2);
      expect(String(result)).toBe('1.5Gi');
    });
  });

  describe('comparison operations', () => {
    it('should compare memory resources correctly', () => {
      const mem1 = new MemoryResource('128Mi');
      const mem2 = new MemoryResource('256Mi');
      const mem3 = new MemoryResource('128Mi');

      expect(mem1.isLessThan(mem2)).toBe(true);
      expect(mem2.isGreaterThan(mem1)).toBe(true);
      expect(mem1.equals(mem3)).toBe(true);
    });
  });
}); 