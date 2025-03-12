import { searchContent, chatWithAI, ChatMessage, SearchResult } from '@/services/aiService';
import { API_ENDPOINTS } from '@/lib/constants';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('AI Search and Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchContent', () => {
    const mockQuery = 'test query';
    const mockSearchResults: SearchResult[] = [
      {
        title: 'Test Blog',
        description: 'Test Description',
        type: 'blog',
        link: '/blog/test',
        score: 0.95
      },
      {
        title: 'Test Project',
        description: 'Project Description',
        type: 'project',
        link: '/projects/test',
        score: 0.85
      }
    ];

    it('should search content successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      });

      const results = await searchContent(mockQuery);

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.search, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mockQuery }),
        credentials: 'include'
      });
      expect(results).toEqual(mockSearchResults);
    });

    it('should return empty array when search fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const results = await searchContent(mockQuery);

      expect(results).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors and return empty array', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const results = await searchContent(mockQuery);

      expect(results).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('chatWithAI', () => {
    const mockMessages: ChatMessage[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];

    const mockResponse: ChatMessage = {
      role: 'assistant',
      content: 'How can I help you today?'
    };

    it('should chat with AI successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await chatWithAI(mockMessages);

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: mockMessages }),
        credentials: 'include'
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when chat fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(chatWithAI(mockMessages)).rejects.toThrow('Chat request failed');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(chatWithAI(mockMessages)).rejects.toThrow(networkError);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
