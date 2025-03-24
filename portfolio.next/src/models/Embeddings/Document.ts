import { Embedding } from "./Embedding";

export interface Document {
    _id: string;
    title: string;
    collection: string;
    slug?: string;
    content?: string;
    embedding: Embedding;
    metadata?: Record<string, unknown>;
  };