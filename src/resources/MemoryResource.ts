/**
 * Represents a Kubernetes memory resource value.
 * Memory resources are measured in bytes and can be specified using binary (power of 2) units:
 * - Ki = 1024 bytes
 * - Mi = 1024 KiB
 * - Gi = 1024 MiB
 * - Ti = 1024 GiB
 * 
 * @example
 * ```typescript
 * const mem1 = new MemoryResource('128Mi');  // 128 mebibytes
 * const mem2 = new MemoryResource('1Gi');    // 1 gibibyte
 * const sum = mem1.plus(mem2);               // 1.125Gi
 * ```
 */
export class MemoryResource {
    private value: number; // Stored in bytes
  
    private static UNITS = { "Ki": 1024, "Mi": 1024 ** 2, "Gi": 1024 ** 3, "Ti": 1024 ** 4 };

    /**
     * Validates that a byte value is valid according to Kubernetes rules.
     * @param bytes - The number of bytes to validate
     * @throws {Error} If the value is negative, non-finite, or fractional
     */
    private static validateBytes(bytes: number): void {
      if (bytes < 0) {
        throw new Error("Memory resources cannot be negative");
      }
      if (!Number.isFinite(bytes)) {
        throw new Error("Memory resources must be finite numbers");
      }
      if (Math.floor(bytes) !== bytes) {
        throw new Error("Memory resources must be whole numbers of bytes");
      }
    }
  
    /**
     * Creates a new memory resource from a string representation.
     * @param resource - A string representing the memory resource (e.g., "128Mi" or "1Gi")
     * @throws {Error} If the format is invalid or the value is invalid
     */
    constructor(resource: string) {
      if (resource.startsWith('-')) {
        throw new Error("Memory resources cannot be negative");
      }

      const match = resource.match(/^(\d+(\.\d+)?)([a-zA-Z]*)$/);
      if (!match) throw new Error("Invalid memory resource format. Must be a number followed by an optional unit (e.g., '128Mi' or '1Gi')");
      
      let [, num, , unit] = match;
      const multiplier = MemoryResource.UNITS[unit as keyof typeof MemoryResource.UNITS];
      if (unit && !multiplier && unit !== 'B') {
        throw new Error("Invalid memory unit. Must be one of: B, Ki, Mi, Gi, Ti");
      }

      const value = parseFloat(num) * (multiplier || 1);
      MemoryResource.validateBytes(value);
      this.value = value;
    }
  
    /**
     * Formats a byte value into a human-readable string using the most appropriate unit.
     * @param value - The number of bytes to format
     * @returns A string representation in the most appropriate unit
     */
    private format(value: number): string {
      const units = ["Gi", "Mi", "Ki"];
      for (const unit of units) {
        const unitValue = MemoryResource.UNITS[unit as keyof typeof MemoryResource.UNITS];
        if (value >= unitValue) {
          return `${value / unitValue}${unit}`;
        }
      }
      return `${value}B`; // Default to bytes if too small
    }
  
    /**
     * Returns the numeric value of the resource in bytes.
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
     * Creates a memory resource with zero bytes.
     * @returns A new MemoryResource instance
     */
    static zero(): MemoryResource {
      return new MemoryResource('0B');
    }

    /**
     * Creates a memory resource from a number of bytes.
     * @param bytes - The number of bytes
     * @returns A new MemoryResource instance
     * @throws {Error} If the value is invalid
     */
    static fromBytes(bytes: number): MemoryResource {
      this.validateBytes(bytes);
      return new MemoryResource(`${bytes}B`);
    }

    /**
     * Creates a memory resource from a number of kibibytes.
     * @param kib - The number of kibibytes
     * @returns A new MemoryResource instance
     * @throws {Error} If the value is invalid
     */
    static fromKiB(kib: number): MemoryResource {
      this.validateBytes(kib * 1024);
      return new MemoryResource(`${kib}Ki`);
    }

    /**
     * Creates a memory resource from a number of mebibytes.
     * @param mib - The number of mebibytes
     * @returns A new MemoryResource instance
     * @throws {Error} If the value is invalid
     */
    static fromMiB(mib: number): MemoryResource {
      this.validateBytes(mib * 1024 * 1024);
      return new MemoryResource(`${mib}Mi`);
    }

    /**
     * Creates a memory resource from a number of gibibytes.
     * @param gib - The number of gibibytes
     * @returns A new MemoryResource instance
     * @throws {Error} If the value is invalid
     */
    static fromGiB(gib: number): MemoryResource {
      this.validateBytes(gib * 1024 * 1024 * 1024);
      return new MemoryResource(`${gib}Gi`);
    }

    /**
     * Adds another memory resource to this one.
     * @param other - The memory resource to add
     * @returns A new MemoryResource instance with the sum
     */
    plus(other: MemoryResource): MemoryResource {
      const result = MemoryResource.zero();
      result.value = this.value + other.value;
      MemoryResource.validateBytes(result.value);
      return result;
    }

    /**
     * Subtracts another memory resource from this one.
     * @param other - The memory resource to subtract
     * @returns A new MemoryResource instance with the difference
     * @throws {Error} If the result would be negative
     */
    minus(other: MemoryResource): MemoryResource {
      const result = MemoryResource.zero();
      result.value = this.value - other.value;
      MemoryResource.validateBytes(result.value);
      return result;
    }

    /**
     * Multiplies this memory resource by a factor.
     * @param factor - The multiplication factor
     * @returns A new MemoryResource instance with the product
     * @throws {Error} If the factor is invalid or the result would be negative
     */
    times(factor: number): MemoryResource {
      if (!Number.isFinite(factor)) {
        throw new Error("Multiplication factor must be a finite number");
      }
      const result = MemoryResource.zero();
      result.value = Math.floor(this.value * factor);
      MemoryResource.validateBytes(result.value);
      return result;
    }

    /**
     * Checks if this memory resource equals another.
     * @param other - The memory resource to compare with
     * @returns true if the resources are equal
     */
    equals(other: MemoryResource): boolean {
      return this.value === other.value;
    }

    /**
     * Checks if this memory resource is less than another.
     * @param other - The memory resource to compare with
     * @returns true if this resource is less than the other
     */
    isLessThan(other: MemoryResource): boolean {
      return this.value < other.value;
    }

    /**
     * Checks if this memory resource is greater than another.
     * @param other - The memory resource to compare with
     * @returns true if this resource is greater than the other
     */
    isGreaterThan(other: MemoryResource): boolean {
      return this.value > other.value;
    }

    /**
     * Returns a string representation of the memory resource.
     * @returns A human-readable string in the most appropriate unit
     */
    toString(): string {
      return this.format(this.value);
    }
} 