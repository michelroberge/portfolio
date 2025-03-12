import { BlogEntry, BaseBlogEntry } from '@/models/BlogEntry';

describe('BlogEntry Model', () => {
  // Test the base model structure
  it('validates BaseBlogEntry structure', () => {
    const baseBlog: BaseBlogEntry = {
      title: 'Test Blog',
      excerpt: 'Test excerpt',
      body: 'Test content',
      tags: ['tech', 'test'],
      isDraft: false,
      publishAt: '2025-03-12T12:00:00Z'
    };

    expect(baseBlog).toHaveProperty('title');
    expect(baseBlog).toHaveProperty('excerpt');
    expect(baseBlog).toHaveProperty('body');
    expect(baseBlog).toHaveProperty('tags');
    expect(baseBlog).toHaveProperty('isDraft');
    expect(baseBlog).toHaveProperty('publishAt');
  });

  // Test the full BlogEntry model
  it('validates BlogEntry structure with all properties', () => {
    const blog: BlogEntry = {
      _id: '1',
      title: 'Test Blog',
      excerpt: 'Test excerpt',
      body: 'Test content',
      tags: ['tech', 'test'],
      isDraft: false,
      publishAt: '2025-03-12T12:00:00Z',
      link: 'test-blog-1',
      createdAt: '2025-03-12T12:00:00Z',
      updatedAt: '2025-03-12T12:00:00Z'
    };

    // Base properties
    expect(blog).toHaveProperty('title');
    expect(blog).toHaveProperty('excerpt');
    expect(blog).toHaveProperty('body');
    expect(blog).toHaveProperty('tags');
    expect(blog).toHaveProperty('isDraft');
    expect(blog).toHaveProperty('publishAt');

    // Extended properties
    expect(blog).toHaveProperty('_id');
    expect(blog).toHaveProperty('link');
    expect(blog).toHaveProperty('createdAt');
    expect(blog).toHaveProperty('updatedAt');
  });

  // Test type compatibility
  it('ensures BaseBlogEntry is assignable to Partial<BlogEntry>', () => {
    const baseBlog: BaseBlogEntry = {
      title: 'Test Blog',
      excerpt: 'Test excerpt',
      body: 'Test content',
      tags: ['tech'],
      isDraft: false
    };

    const partialBlog: Partial<BlogEntry> = baseBlog;
    expect(partialBlog.title).toBe('Test Blog');
  });

  // Test optional properties
  it('allows optional publishAt property', () => {
    const blog: BaseBlogEntry = {
      title: 'Test Blog',
      excerpt: 'Test excerpt',
      body: 'Test content',
      tags: ['tech'],
      isDraft: false
    };

    expect(blog.publishAt).toBeUndefined();
  });
});
