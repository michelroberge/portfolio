// portfolio.next/src/models/ProviderConfig.ts

export interface ProviderConfig {
  _id: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
