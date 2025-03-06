export interface BlogEntry {
    _id: string ; 
    title: string;
    publishAt: string;
    body: string;
    excerpt?: string;
    link: string;
    isDraft: boolean;
  }