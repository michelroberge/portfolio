export interface BlogEntry {
    _id: string ; 
    title: string;
    publishAt?: string | null;
    body: string;
    excerpt?: string;
    link: string;
    isDraft: boolean;
  }