import { ADMIN_API } from "@/lib/constants";
import { SearchResult } from '@/models/Embeddings/SearchResult';
import { Document } from "@/models/Embeddings/Document";

const fetchDocuments = async (name: string, cookieHeader: string, stateFunction: Function | undefined): Promise<Document[] | undefined> => {

    stateFunction && stateFunction(true);
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } 
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/collection/${name}`, {
            credentials: "include",
            headers,
            cache: "no-store",
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch documents');
            return [];
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    } finally {
        stateFunction && stateFunction(false);
    }
};

const fetchCollections = async (cookieHeader: string) => {
    try {

        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/collection`, {
            credentials: "include",
            headers,
            cache: "no-store",
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`collectionmap`, data);
            return data;
        } else {
            console.error('Failed to fetch collections');
        }
    } catch (error) {
        console.error('Error fetching collections:', error);
    }
};

const handleRegenerateByCollection = async (collectionName: string, model?: string, cookieHeader?: string) => {
    try {

        const headers: HeadersInit = cookieHeader
            ? {
                Cookie: cookieHeader,
                'Content-Type': 'application/json',
            } // Pass cookies for SSR requests
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/regenerate`, {
            method: 'POST',
            credentials: "include",
            headers,
            cache: "no-store",
            body: JSON.stringify({
                collection: collectionName,
                model: model,
            }),
        });

        if (response.ok) {
            alert(`Started regenerating embeddings for ${collectionName}`);
            // You might want to poll for status or implement a websocket for real-time updates
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error regenerating embeddings:', error);
        alert('An error occurred while regenerating embeddings');
    }
};

const handleSearch = async (query: string, selectedCollections: string[], cookieHeader: string): Promise<SearchResult[]> => {
    try {

        const headers: HeadersInit = cookieHeader
            ? {
                Cookie: cookieHeader,
                'Content-Type': 'application/json',
            } // Pass cookies for SSR requests
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/search-test`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                collections: selectedCollections,
            }),
        });

        if (response.ok) {
            return response.json();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};

const embeddingService = {
    fetchCollections,
    handleRegenerateByCollection,
    handleSearch,
    fetchDocuments
};

export default embeddingService;
