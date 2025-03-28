import { Embedding } from "./Embedding";

export interface Document {
    _id: string;
    title: string;
    collection: string;
    editLink: string;
    slug?: string;
    content?: string;
    vectorId?: number;
    embedding: Embedding;
    metadata?: Record<string, unknown>;
    tags?: string[]; 
  };

  