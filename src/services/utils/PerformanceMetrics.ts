interface RequestMetric {
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
}

interface PerformanceData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  p95Latency: number;
  p99Latency: number;
}

export class PerformanceMetrics {
  private metrics: Map<string, RequestMetric>;
  private requestCounter: number;

  constructor() {
    this.metrics = new Map();
    this.requestCounter = 0;
  }

  public startRequest(): string {
    const requestId = this.generateRequestId();
    this.metrics.set(requestId, {
      startTime: Date.now(),
      success: false
    });
    return requestId;
  }

  public endRequest(requestId: string, success: boolean = true): void {
    const metric = this.metrics.get(requestId);
    if (metric) {
      const endTime = Date.now();
      metric.endTime = endTime;
      metric.duration = endTime - metric.startTime;
      metric.success = success;
    }
  }

  public getMetrics(): PerformanceData {
    const durations = Array.from(this.metrics.values())
      .filter(m => m.duration !== undefined)
      .map(m => m.duration as number)
      .sort((a, b) => a - b);

    const successful = Array.from(this.metrics.values()).filter(m => m.success).length;
    const total = this.metrics.size;

    return {
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: total - successful,
      averageLatency: this.calculateAverage(durations),
      p95Latency: this.calculatePercentile(durations, 0.95),
      p99Latency: this.calculatePercentile(durations, 0.99)
    };
  }

  public reset(): void {
    this.metrics.clear();
    this.requestCounter = 0;
  }

  private generateRequestId(): string {
    this.requestCounter++;
    return `req_${Date.now()}_${this.requestCounter}`;
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const index = Math.ceil(values.length * percentile) - 1;
    return values[index];
  }

  // Additional utility methods
  public getRequestMetric(requestId: string): RequestMetric | undefined {
    return this.metrics.get(requestId);
  }

  public getSuccessRate(): number {
    const metrics = this.getMetrics();
    return metrics.totalRequests === 0 
      ? 0 
      : (metrics.successfulRequests / metrics.totalRequests) * 100;
  }

  public getAverageLatencyForLastNRequests(n: number): number {
    const recentMetrics = Array.from(this.metrics.values())
      .slice(-n)
      .filter(m => m.duration !== undefined)
      .map(m => m.duration as number);

    return this.calculateAverage(recentMetrics);
  }
}
