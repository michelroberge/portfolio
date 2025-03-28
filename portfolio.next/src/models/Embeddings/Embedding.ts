export interface Embedding {
    vectorId: number;
    vector: number[];
    model: string;
    collection: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
  }
  