export interface SearchResult {
    title: string;
    excerpt: string;
    type: "project" | "blog" | "career" | "general" | "chapter";
    link: string;
    score: number;
};