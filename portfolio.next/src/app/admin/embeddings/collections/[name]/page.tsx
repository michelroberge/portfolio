"use client"
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import React, { useEffect, useState } from 'react';
import embeddingService from "@/services/embeddingService";
import DocumentTable from "@/components/admin/embeddings/DocumentTable"
import {Document} from "@/models/Embeddings/Document";
import EmbeddingVisualizer from "@/components/admin/embeddings/EmbeddingVisualizer";

interface Props {
    params: Promise<{ name: string }>;
  }
  
export default async function CollectionPage({ params }: Props) {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const { name } = await params;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  useEffect(() => {
    if (!name) return;
    
    const fetchDocuments = async () => {
      try {
        const data = await embeddingService.fetchDocuments(name, cookieHeader, setIsLoading);
        if (data) {
          setDocuments(data);
        } else {
          console.error('Failed to fetch documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } 
    };
    
    fetchDocuments();
  }, [name]);
  
  const handleRegenerateSelected = async (ids: string[]) => {
    if (ids.length === 0) return;
    
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/embeddings/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: ids
        }),
      });
      
      if (response.ok) {
        alert(`Started regenerating embeddings for ${ids.length} document(s)`);
        // Refresh document list after a short delay
        setTimeout(() => {
          // router.reload();
        }, 3000);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error regenerating embeddings:', error);
      alert('An error occurred while regenerating embeddings');
    } finally {
      setIsRegenerating(false);
    }
  };
  
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <a href=".."
            className="mr-4 text-blue-600 hover:underline"
          >
            ← Back to Collections
          </a>
          <h1 className="text-3xl font-bold">{name} Collection</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Documents</h2>
          <DocumentTable 
            documents={documents}
            isLoading={isLoading || isRegenerating}
            onRegenerateSelected={handleRegenerateSelected}
          />
        </div>
        
        {documents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Embedding Visualization</h2>
            <EmbeddingVisualizer documents={documents} />
          </div>
        )}
      </div>
    </>
  );
};
