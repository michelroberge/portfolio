// src/context/LoadingContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the context type
type LoadingContextType = {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
    withLoading: <T>(promise: Promise<T>) => Promise<T>;
};

// Create the context with default values
const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    showLoading: () => { },
    hideLoading: () => { },
    withLoading: async <T,>(promise: Promise<T>) => promise,
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCounter, setLoadingCounter] = useState(0);

    const showLoading = useCallback(() => {        
        setLoadingCounter(prev => prev + 1);
        setIsLoading(true);
        if ( process.env.NODE_ENV === "development"){
            console.log(`loadingCounter: ${loadingCounter}`);
        }
    }, []);

    const hideLoading = useCallback(() => {
        setLoadingCounter(prev => {
            const newCount = prev - 1;
            if (newCount <= 0) {
                setIsLoading(false);
                return 0;
            }
            return newCount;
        });
    }, []);

    // Helper to wrap promises with loading state
    const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
        showLoading();
        try {
            return await promise;
        } finally {
            hideLoading();
        }
    }, [showLoading, hideLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};