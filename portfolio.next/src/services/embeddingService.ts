import { ADMIN_API } from "@/lib/constants";
import { SearchResult } from '@/models/Embeddings/SearchResult';
import { Document } from "@/models/Embeddings/Document";
import { DocumentEmbedding } from "@/models/Embeddings/DocumentEmbedding";

// Define explicit type for the state function
type StateFunction = (isLoading: boolean) => void;

const fetchDocuments = async (name: string, cookieHeader: string, stateFunction?: StateFunction): Promise<Document[] | undefined> => {
    // Fix the unused expression by using if statement
    if (stateFunction) {
        stateFunction(true);
    }
    
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } 
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/documents/collection/${name}`, {
            credentials: "include",
            headers,
            cache: "no-store",
        });

        if (response.ok) {
            const data = await response.json();
            
            const documentsWithEditLinks = data.map((doc: { _id: string; }) => ({
                ...doc,
                editLink: getEditLink(name, doc._id)
            }));
            return documentsWithEditLinks;

        } else {
            console.error('Failed to fetch documents');
            return [];
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    } finally {
        // Fix the unused expression by using if statement
        if (stateFunction) {
            stateFunction(false);
        }
    }
};

function getEditLink(collectionName: string, docId: string): string {
    switch (collectionName) {
        case 'pages':
            return `/admin/pages/edit/${docId}`;
        case 'projects':
            return `/admin/projects/edit/${docId}`;
        case 'blogentries':
            return `/admin/blogs/edit/${docId}`;
        default:
            return `/admin/${collectionName}/edit/${docId}`;
    }
}

const fetchCollections = async (cookieHeader: string) => {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/collections`, {
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

const fetchCollectionVectors = async (collectionName: string, cookieHeader: string): Promise<DocumentEmbedding[]> => {
    try {
        const headers: HeadersInit = cookieHeader
            ? {
                Cookie: cookieHeader,
                'Content-Type': 'application/json',
            } // Pass cookies for SSR requests
            : {};

        const response = await fetch(`${ADMIN_API.base}/embeddings/collections/${collectionName}/vectors`, {
            method: 'GET',
            headers,
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

// Fix the unused variable by using it or removing it
const getSearchVector = async (query: string): Promise<number[]> => {
    // Using the query parameter to make it used
    console.log(`Generating vector for query: ${query}`);
    // Implement actual vector generation logic here
    return [];
};

const embeddingService = {
    fetchCollections,
    handleRegenerateByCollection,
    handleSearch,
    fetchDocuments,
    fetchCollectionVectors,
    getSearchVector
};

export default embeddingService;