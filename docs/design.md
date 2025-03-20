# Kubernetes Resource Arithmetic Library - Design Document

## 1. Introduction

Kubernetes uses a unique notation for specifying CPU and memory resource limits and requests. This library provides a TypeScript-based implementation to perform arithmetic and comparison operations on these resources seamlessly.

## 2. Kubernetes Resource Units

Kubernetes resources are defined using specific units:

### CPU Units

- Measured in CPU cores or millicores (m).
- 1 CPU core = 1000m
- Example values: 100m, 500m, 1, 2

### Memory Units

- Measured in bytes, with IEC notation:
  - Ki = 1024 bytes
  - Mi = 1024 KiB
  - Gi = 1024 MiB
  - Ti = 1024 GiB

- Example values: 128Mi, 1Gi, 2Gi, 512Ki

## 3. Goals of the Library

This library aims to:

1. Support arithmetic operations (+, -, *) for CPU and memory resources.
2. Enable comparison operations (<, >, ===).
3. Ensure type safety by preventing operations between CPU and memory resources.
4. Provide formatted output in human-readable Kubernetes units.

## 4. Design and Implementation

### Class Structure

The library is implemented using two distinct classes:

1. CPUResource

  - Stores CPU values in millicores (m).
  - Provides arithmetic (add, subtract, multiply) and comparison (lt, gt, eq) operations.
  - Implements valueOf() and Symbol.toPrimitive to enable direct operator usage.

2. MemoryResource

  - Stores memory values in bytes.
  - Provides arithmetic (add, subtract, multiply) and comparison (lt, gt, eq) operations.
  - Implements valueOf() and Symbol.toPrimitive to enable direct operator usage.

Example Usage

Arithmetic Operations

Comparison Operations

## 5. Future Enhancements

- Division support (/) for resource scaling.
- Unit normalization (e.g., outputting 1.25Gi instead of 1280Mi).
- More flexible parsing to handle edge cases.

## 6. Conclusion

This library simplifies Kubernetes resource arithmetic and comparisons while maintaining accuracy and usability. The strict type separation ensures correctness while allowing natural operator usage in TypeScript.