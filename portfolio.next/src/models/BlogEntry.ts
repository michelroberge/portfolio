export interface BlogEntry {
    _id: string | number; 
    title: string;
    publishAt: string;
    body: string;
    excerpt?: string;
    link: string;
  }