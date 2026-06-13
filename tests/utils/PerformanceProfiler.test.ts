import { PerformanceProfiler } from '../../src/utils/PerformanceProfiler';

describe('PerformanceProfiler', () => {
  beforeEach(() => {
    PerformanceProfiler.clear();
  });

  it('measures a sync function and records stats', () => {
    const result = PerformanceProfiler.measure('sync', () => 21 * 2);
    expect(result).toBe(42);

    const stats = PerformanceProfiler.getStats('sync');
    expect(stats).not.toBeNull();
    expect(stats!.count).toBe(1);
    expect(stats!.min).toBeLessThanOrEqual(stats!.max);
    expect(stats!.average).toBeGreaterThanOrEqual(0);
  });

  it('measures an async function', async () => {
    const result = await PerformanceProfiler.measureAsync('async', async () => 'done');
    expect(result).toBe('done');
    expect(PerformanceProfiler.getStats('async')!.count).toBe(1);
  });

  it('returns null stats for an unknown measurement', () => {
    expect(PerformanceProfiler.getStats('missing')).toBeNull();
  });

  it('aggregates all stats and supports manual timers', () => {
    PerformanceProfiler.measure('a', () => 1);
    const stop = PerformanceProfiler.createTimer('b');
    stop();

    const all = PerformanceProfiler.getAllStats();
    expect(all.has('a')).toBe(true);
    expect(all.has('b')).toBe(true);
  });

  it('logStats runs without throwing', () => {
    PerformanceProfiler.measure('x', () => 1);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(() => PerformanceProfiler.logStats()).not.toThrow();
    spy.mockRestore();
  });

  it('clear() empties all measurements', () => {
    PerformanceProfiler.measure('y', () => 1);
    PerformanceProfiler.clear();
    expect(PerformanceProfiler.getStats('y')).toBeNull();
  });
});
