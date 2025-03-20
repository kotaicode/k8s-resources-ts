/**
 * Represents a Kubernetes CPU resource value.
 * CPU resources are measured in CPU units, where 1 CPU unit equals 1 physical/virtual core.
 * Values can be specified in cores (e.g., "1") or millicores (e.g., "100m").
 * 
 * @example
 * ```typescript
 * const cpu1 = new CPUResource('100m');  // 100 millicores
 * const cpu2 = new CPUResource('1');     // 1 core
 * const sum = cpu1.plus(cpu2);           // 1.1 cores
 * ```
 */
export class CPUResource {
    private value: number; // Stored in millicores (m)
  
    private static UNITS = { "m": 1, "": 1000 };

    /**
     * Validates that a millicore value is valid according to Kubernetes rules.
     * @param millicores - The number of millicores to validate
     * @throws {Error} If the value is negative, non-finite, or fractional
     */
    private static validateMillicores(millicores: number): void {
      if (millicores < 0) {
        throw new Error("CPU resources cannot be negative");
      }
      if (!Number.isFinite(millicores)) {
        throw new Error("CPU resources must be finite numbers");
      }
      // Kubernetes doesn't allow CPU precision finer than 1m
      if (Math.floor(millicores) !== millicores) {
        throw new Error("CPU resources must be whole numbers of millicores");
      }
    }
  
    /**
     * Creates a new CPU resource from a string representation.
     * @param resource - A string representing the CPU resource (e.g., "100m" or "1")
     * @throws {Error} If the format is invalid or the value is invalid
     */
    constructor(resource: string) {
      if (resource.startsWith('-')) {
        throw new Error("CPU resources cannot be negative");
      }

      const match = resource.match(/^(\d+(\.\d+)?)([a-zA-Z]*)$/);
      if (!match) throw new Error("Invalid CPU resource format. Must be a number followed by an optional unit (e.g., '100m' or '0.5')");
      
      let [, num, , unit] = match;
      const multiplier = CPUResource.UNITS[unit as keyof typeof CPUResource.UNITS];
      if (unit && !multiplier) {
        throw new Error("Invalid CPU unit. Must be 'm' for millicores or empty for cores");
      }

      const value = parseFloat(num) * (multiplier || 1);
      CPUResource.validateMillicores(value);
      this.value = value;
    }
  
    /**
     * Formats a millicore value into a human-readable string.
     * @param value - The number of millicores to format
     * @returns A string representation in the most appropriate unit
     */
    private format(value: number): string {
      return value >= 1000 ? `${value / 1000}` : `${value}m`;
    }
  
    /**
     * Returns the numeric value of the resource in millicores.
     * This enables direct numeric comparisons and arithmetic operations.
     */
    valueOf(): number {
      return this.value;
    }
  
    /**
     * Implements the Symbol.toPrimitive protocol to enable automatic type conversion.
     * @param hint - The type hint ("string", "number", or "default")
     * @returns The primitive value
     */
    [Symbol.toPrimitive](hint: string) {
      return hint === "string" ? this.format(this.value) : this.value;
    }

    /**
     * Creates a CPU resource with zero millicores.
     * @returns A new CPUResource instance
     */
    static zero(): CPUResource {
      return new CPUResource('0m');
    }

    /**
     * Creates a CPU resource from a number of millicores.
     * @param millicores - The number of millicores
     * @returns A new CPUResource instance
     * @throws {Error} If the value is invalid
     */
    static fromMillicores(millicores: number): CPUResource {
      this.validateMillicores(millicores);
      return new CPUResource(`${millicores}m`);
    }

    /**
     * Creates a CPU resource from a number of cores.
     * @param cores - The number of CPU cores
     * @returns A new CPUResource instance
     * @throws {Error} If the value is invalid
     */
    static fromCores(cores: number): CPUResource {
      this.validateMillicores(cores * 1000);
      return new CPUResource(`${cores}`);
    }

    /**
     * Adds another CPU resource to this one.
     * @param other - The CPU resource to add
     * @returns A new CPUResource instance with the sum
     */
    plus(other: CPUResource): CPUResource {
      const result = CPUResource.zero();
      result.value = this.value + other.value;
      CPUResource.validateMillicores(result.value);
      return result;
    }

    /**
     * Subtracts another CPU resource from this one.
     * @param other - The CPU resource to subtract
     * @returns A new CPUResource instance with the difference
     * @throws {Error} If the result would be negative
     */
    minus(other: CPUResource): CPUResource {
      const result = CPUResource.zero();
      result.value = this.value - other.value;
      CPUResource.validateMillicores(result.value);
      return result;
    }

    /**
     * Multiplies this CPU resource by a factor.
     * @param factor - The multiplication factor
     * @returns A new CPUResource instance with the product
     * @throws {Error} If the factor is invalid or the result would be negative
     */
    times(factor: number): CPUResource {
      if (!Number.isFinite(factor)) {
        throw new Error("Multiplication factor must be a finite number");
      }
      const result = CPUResource.zero();
      result.value = Math.floor(this.value * factor);
      CPUResource.validateMillicores(result.value);
      return result;
    }

    /**
     * Checks if this CPU resource equals another.
     * @param other - The CPU resource to compare with
     * @returns true if the resources are equal
     */
    equals(other: CPUResource): boolean {
      return this.value === other.value;
    }

    /**
     * Checks if this CPU resource is less than another.
     * @param other - The CPU resource to compare with
     * @returns true if this resource is less than the other
     */
    isLessThan(other: CPUResource): boolean {
      return this.value < other.value;
    }

    /**
     * Checks if this CPU resource is greater than another.
     * @param other - The CPU resource to compare with
     * @returns true if this resource is greater than the other
     */
    isGreaterThan(other: CPUResource): boolean {
      return this.value > other.value;
    }

    /**
     * Returns a string representation of the CPU resource.
     * @returns A human-readable string in the most appropriate unit
     */
    toString(): string {
      return this.format(this.value);
    }
} 