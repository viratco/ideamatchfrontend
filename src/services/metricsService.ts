import { EventEmitter } from 'events';

export interface BusinessMetrics {
  annualRevenuePotential: string;
  marketSize: string;
  projectedUsers: string;
  timeToBreakeven: string;
  initialInvestment: string;
  competitiveEdge: string;
  lastUpdated?: string;
  status?: 'processing' | 'complete' | 'error';
}

const metricsEmitter = new EventEmitter();

export const fetchBusinessMetrics = async (): Promise<BusinessMetrics> => {
  try {
    const response = await fetch('/api/metrics');
    if (!response.ok) {
      throw new Error('Failed to fetch business metrics');
    }
    const data = await response.json();
    metricsEmitter.emit('metricsUpdate', data);
    return data;
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    throw error;
  }
};

export const subscribeToMetrics = (callback: (metrics: BusinessMetrics) => void) => {
  metricsEmitter.on('metricsUpdate', callback);
  return () => metricsEmitter.off('metricsUpdate', callback);
};