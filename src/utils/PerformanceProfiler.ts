/**
 * Performance profiling utility for measuring operation times
 */
export class PerformanceProfiler {
  private static measurements: Map<string, number[]> = new Map();
  
  /**
   * Measures the execution time of a function
   */
  static measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const duration = end - start;
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
    
    return result;
  }
  
  /**
   * Measures the execution time of an async function
   */
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    const duration = end - start;
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
    
    return result;
  }
  
  /**
   * Gets statistics for a specific measurement
   */
  static getStats(name: string): {
    count: number;
    total: number;
    average: number;
    min: number;
    max: number;
  } | null {
    const measurements = this.measurements.get(name);
    if (!measurements || measurements.length === 0) return null;
    
    const total = measurements.reduce((sum, val) => sum + val, 0);
    const average = total / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    return { count: measurements.length, total, average, min, max };
  }
  
  /**
   * Gets all measurement statistics
   */
  static getAllStats(): Map<string, ReturnType<typeof PerformanceProfiler.getStats>> {
    const allStats = new Map();
    for (const [name] of this.measurements) {
      allStats.set(name, this.getStats(name));
    }
    return allStats;
  }
  
  /**
   * Logs all performance statistics
   */
  static logStats(): void {
    console.log('\n=== Performance Statistics ===');
    const stats = this.getAllStats();
    
    for (const [name, stat] of stats) {
      if (stat) {
        console.log(`\n${name}:`);
        console.log(`  Count: ${stat.count}`);
        console.log(`  Average: ${stat.average.toFixed(3)}ms`);
        console.log(`  Min: ${stat.min.toFixed(3)}ms`);
        console.log(`  Max: ${stat.max.toFixed(3)}ms`);
        console.log(`  Total: ${stat.total.toFixed(3)}ms`);
      }
    }
  }
  
  /**
   * Clears all measurements
   */
  static clear(): void {
    this.measurements.clear();
  }
  
  /**
   * Creates a timer for manual timing
   */
  static createTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      if (!this.measurements.has(name)) {
        this.measurements.set(name, []);
      }
      this.measurements.get(name)!.push(duration);
    };
  }
}