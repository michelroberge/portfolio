export interface BasePage {
  title: string;
  slug: string;
  content: string;
  tags: string[];
}

export interface Page extends BasePage {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
