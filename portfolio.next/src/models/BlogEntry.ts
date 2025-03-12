export interface BaseBlogEntry {
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  isDraft: boolean;
  publishAt?: string | null;
}

export interface BlogEntry extends BaseBlogEntry {
  _id: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}