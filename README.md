# Kubernetes Resource Arithmetic Library

A TypeScript library for performing arithmetic and comparison operations on Kubernetes CPU and memory resources.

## Features

- Parse and validate Kubernetes CPU and memory resource strings
- Perform arithmetic operations (addition, subtraction, multiplication)
- Compare resource values
- Format resources in human-readable Kubernetes units
- Type-safe operations with TypeScript
- Comprehensive test coverage

## Installation

```bash
npm install k8s-resources
```

## Usage

### CPU Resources

```typescript
import { CPUResource } from 'k8s-resources';

// Create CPU resources
const cpu1 = new CPUResource('100m');  // 100 millicores
const cpu2 = new CPUResource('1');     // 1 core
const cpu3 = CPUResource.fromMillicores(500);  // 500 millicores
const cpu4 = CPUResource.fromCores(2);         // 2 cores

// Arithmetic operations
const sum = cpu1.plus(cpu2);           // 1.1 cores
const diff = cpu2.minus(cpu1);         // 900m
const scaled = cpu1.times(3);          // 300m

// Comparison operations
const isLess = cpu1.isLessThan(cpu2);  // true
const isEqual = cpu1.equals(cpu3);      // false
const isGreater = cpu2.isGreaterThan(cpu1); // true

// String representation
console.log(cpu1.toString());  // "100m"
console.log(cpu2.toString());  // "1"
```

### Memory Resources

```typescript
import { MemoryResource } from 'k8s-resources';

// Create memory resources
const mem1 = new MemoryResource('128Mi');  // 128 mebibytes
const mem2 = new MemoryResource('1Gi');    // 1 gibibyte
const mem3 = MemoryResource.fromBytes(1024 * 1024);  // 1MiB
const mem4 = MemoryResource.fromGiB(2);              // 2GiB

// Arithmetic operations
const sum = mem1.plus(mem2);           // 1.125Gi
const diff = mem2.minus(mem1);         // 896Mi
const scaled = mem1.times(2);          // 256Mi

// Comparison operations
const isLess = mem1.isLessThan(mem2);  // true
const isEqual = mem1.equals(mem3);      // false
const isGreater = mem2.isGreaterThan(mem1); // true

// String representation
console.log(mem1.toString());  // "128Mi"
console.log(mem2.toString());  // "1Gi"
```

## API Reference

The API documentation is available in the `docs/api` directory after running `npm run docs`. You can find:

- [API Overview](docs/api/README.md)
- [CPUResource Class](docs/api/classes/CPUResource.md)
- [MemoryResource Class](docs/api/classes/MemoryResource.md)

### CPUResource

#### Constructor
```typescript
new CPUResource(resource: string)
```
Creates a new CPU resource from a string representation (e.g., "100m" or "1").

#### Static Factory Methods
```typescript
CPUResource.zero(): CPUResource
CPUResource.fromMillicores(millicores: number): CPUResource
CPUResource.fromCores(cores: number): CPUResource
```

#### Instance Methods
```typescript
plus(other: CPUResource): CPUResource
minus(other: CPUResource): CPUResource
times(factor: number): CPUResource
equals(other: CPUResource): boolean
isLessThan(other: CPUResource): boolean
isGreaterThan(other: CPUResource): boolean
toString(): string
```

### MemoryResource

#### Constructor
```typescript
new MemoryResource(resource: string)
```
Creates a new memory resource from a string representation (e.g., "128Mi" or "1Gi").

#### Static Factory Methods
```typescript
MemoryResource.zero(): MemoryResource
MemoryResource.fromBytes(bytes: number): MemoryResource
MemoryResource.fromKiB(kib: number): MemoryResource
MemoryResource.fromMiB(mib: number): MemoryResource
MemoryResource.fromGiB(gib: number): MemoryResource
```

#### Instance Methods
```typescript
plus(other: MemoryResource): MemoryResource
minus(other: MemoryResource): MemoryResource
times(factor: number): MemoryResource
equals(other: MemoryResource): boolean
isLessThan(other: MemoryResource): boolean
isGreaterThan(other: MemoryResource): boolean
toString(): string
```

## Resource Units

### CPU Units
- `m`: millicore (1/1000 of a CPU core)
- No suffix: CPU cores (e.g., "1" = 1000m)

### Memory Units
- `B`: bytes
- `Ki`: kibibytes (1024 bytes)
- `Mi`: mebibytes (1024 KiB)
- `Gi`: gibibytes (1024 MiB)
- `Ti`: tebibytes (1024 GiB)

## Error Handling

The library throws errors in the following cases:
- Invalid resource format
- Negative values
- Non-finite numbers
- Fractional values (for CPU millicores and memory bytes)
- Invalid units
- Negative results from subtraction
- Invalid multiplication factors

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Generate API documentation
npm run docs
```

The API documentation will be generated in the `docs/api` directory. The documentation includes:
- Detailed class and method descriptions
- Type information
- Examples
- Error documentation
- Cross-references between related components

## License

MIT 