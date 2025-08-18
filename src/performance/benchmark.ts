import { FormModel } from '../model';
import { buildFormConfig } from '../core';

export interface PerformanceMeasurement {
  operation: string;
  duration: number;
  iterations: number;
  avgDuration: number;
}

export interface BenchmarkOptions {
  iterations?: number;
  warmupRuns?: number;
}

/**
 * Simple benchmarks for form operations
 */
export class FormBenchmark {
  private measurements: PerformanceMeasurement[] = [];

  /**
   * Benchmark form config building
   */
  async benchmarkConfigBuilding(
    model: FormModel,
    flags: Record<string, boolean> = {},
    options: BenchmarkOptions = {}
  ): Promise<PerformanceMeasurement> {
    const { iterations = 1000, warmupRuns = 100 } = options;

    // Warmup
    for (let i = 0; i < warmupRuns; i++) {
      buildFormConfig(model, flags);
    }

    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      buildFormConfig(model, flags);
    }

    const endTime = Date.now();

    const measurement: PerformanceMeasurement = {
      operation: 'configBuilding',
      duration: endTime - startTime,
      iterations,
      avgDuration: (endTime - startTime) / iterations,
    };

    this.measurements.push(measurement);
    return measurement;
  }

  /**
   * Benchmark large form performance
   */
  async benchmarkLargeForm(
    fieldCount: number,
    options: BenchmarkOptions = {}
  ): Promise<PerformanceMeasurement[]> {
    // Generate large model
    const model: FormModel = Array.from({ length: fieldCount }, (_, i) => ({
      key: `field${i}`,
      type: 'text' as const,
      label: `Field ${i}`,
      validators: { required: true },
    }));

    const results: PerformanceMeasurement[] = [];

    // Benchmark config building
    results.push(await this.benchmarkConfigBuilding(model, {}, options));

    return results;
  }

  /**
   * Get all measurements
   */
  getMeasurements(): PerformanceMeasurement[] {
    return [...this.measurements];
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements = [];
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    if (this.measurements.length === 0) {
      return 'No performance measurements available.';
    }

    const report: string[] = ['=== Form Builder Performance Report ===\n'];

    const grouped = this.measurements.reduce((acc, measurement) => {
      if (!acc[measurement.operation]) {
        acc[measurement.operation] = [];
      }
      acc[measurement.operation].push(measurement);
      return acc;
    }, {} as Record<string, PerformanceMeasurement[]>);

    Object.entries(grouped).forEach(([operation, measurements]) => {
      report.push(`\n${operation.toUpperCase()}:`);
      
      measurements.forEach((m, index) => {
        report.push(`  Run ${index + 1}:`);
        report.push(`    Total Duration: ${m.duration.toFixed(2)}ms`);
        report.push(`    Iterations: ${m.iterations}`);
        report.push(`    Avg Duration: ${m.avgDuration.toFixed(4)}ms`);
      });

      if (measurements.length > 1) {
        const avgTotal = measurements.reduce((sum, m) => sum + m.duration, 0) / measurements.length;
        const avgPerOp = measurements.reduce((sum, m) => sum + m.avgDuration, 0) / measurements.length;
        
        report.push(`  AVERAGES:`);
        report.push(`    Avg Total Duration: ${avgTotal.toFixed(2)}ms`);
        report.push(`    Avg Per Operation: ${avgPerOp.toFixed(4)}ms`);
      }
    });

    return report.join('\n');
  }
}

/**
 * Quick performance test for common scenarios
 */
export async function quickPerformanceTest(): Promise<string> {
  const benchmark = new FormBenchmark();
  
  console.log('Running quick performance test...');
  
  // Test small form (10 fields)
  await benchmark.benchmarkLargeForm(10, { iterations: 500 });
  
  // Test medium form (50 fields)
  await benchmark.benchmarkLargeForm(50, { iterations: 100 });
  
  // Test large form (200 fields)
  await benchmark.benchmarkLargeForm(200, { iterations: 25 });
  
  return benchmark.generateReport();
} 