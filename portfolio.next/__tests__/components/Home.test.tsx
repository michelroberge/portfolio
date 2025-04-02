import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/components/Home';
import { BlogEntry } from '@/models/BlogEntry';
import { Project } from '@/models/Project';

// Mock next/link as it's a common requirement for Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Home Component', () => {
  const mockBlogEntries: BlogEntry[] = [
    {
      _id: '1',
      title: 'Test Blog 1',
      excerpt: 'Test blog excerpt 1',
      body: 'Test content 1',
      link: 'test-blog-1',
      tags: ['typescript', 'react'],
      isDraft: false,
      publishAt: null,
      createdAt: '2025-03-12T14:46:06-04:00',
      updatedAt: '2025-03-12T14:46:06-04:00'
    },
    {
      _id: '2',
      title: 'Test Blog 2',
      excerpt: 'Test blog excerpt 2',
      body: 'Test content 2',
      link: 'test-blog-2',
      tags: ['nextjs'],
      isDraft: true, // This one should not be displayed
      publishAt: null,
      createdAt: '2025-03-12T14:46:06-04:00',
      updatedAt: '2025-03-12T14:46:06-04:00'
    }
  ];

  const mockProjects: Project[] = [
    {
      _id: '1',
      title: 'Test Project 1',
      excerpt: 'Test project excerpt 1',
      description: 'Test description 1',
      tags: ['react', 'node'],
      isDraft: false,
      status: 'completed',
      technologies: ['react', 'typescript'],
      link: 'https://project1.com',
      industry: 'Technology',
      publishAt: null,
      startDate: '2025-01-01',
      endDate: '2025-03-01',
      createdAt: '2025-03-12T14:46:06-04:00',
      updatedAt: '2025-03-12T14:46:06-04:00'
    },
    {
      _id: '2',
      title: 'Test Project 2',
      excerpt: 'Test project excerpt 2',
      description: 'Test description 2',
      tags: ['python'],
      isDraft: true, // This one should not be displayed
      status: 'in-progress',
      technologies: ['python', 'django'],
      industry: 'Technology',
      publishAt: null,
      startDate: '2025-02-01',
      createdAt: '2025-03-12T14:46:06-04:00',
      updatedAt: '2025-03-12T14:46:06-04:00'
    }
  ];

  it('renders blog posts and projects with correct visibility states', () => {
    render(<Home blogEntries={mockBlogEntries} projects={mockProjects} />);
    
    // Check section headings and initial visibility
    const blogsSection = screen.getByRole('region', { name: /latest blog posts/i });
    const projectsSection = screen.getByRole('region', { name: /projects/i });
    
    // Initially blogs section should be visible and projects hidden on mobile
    expect(blogsSection).not.toHaveClass('hidden');
    expect(projectsSection).toHaveClass('hidden');
    expect(projectsSection).toHaveClass('md:block');

    // Check that only non-draft content is rendered
    expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
    expect(screen.getByText('Test blog excerpt 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test project excerpt 1')).toBeInTheDocument();

    // Verify draft content is not rendered
    expect(screen.queryByText('Test Blog 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
  });

  it('renders blog and project tags', () => {
    render(<Home blogEntries={mockBlogEntries} projects={mockProjects} />);

    // Check blog tags
    expect(screen.queryByText('typescript')).toBeInTheDocument();
    expect(screen.queryByText('nextjs')).not.toBeInTheDocument(); // From draft blog

    // Check project tags
    expect(screen.getByText('node')).toBeInTheDocument();
    expect(screen.queryByText('python')).not.toBeInTheDocument(); // From draft project
  });



  it('handles mobile navigation correctly', () => {
    render(<Home blogEntries={mockBlogEntries} projects={mockProjects} />);

    const blogsSection = screen.getByRole('region', { name: /latest blog posts/i });
    const projectsSection = screen.getByRole('region', { name: /projects/i });
    const blogsButton = screen.getByRole('button', { name: /blog posts/i });
    const projectsButton = screen.getByRole('button', { name: /projects/i });
    
    // Initial state: blogs visible, projects hidden
    expect(blogsSection).not.toHaveClass('hidden');
    expect(projectsSection).toHaveClass('hidden');
    expect(blogsButton).toHaveAttribute('aria-pressed', 'true');
    expect(projectsButton).toHaveAttribute('aria-pressed', 'false');

    // Switch to projects view
    fireEvent.click(projectsButton);

    // After click: projects visible, blogs hidden
    expect(blogsSection).toHaveClass('hidden');
    expect(projectsSection).not.toHaveClass('hidden');
    expect(blogsButton).toHaveAttribute('aria-pressed', 'false');
    expect(projectsButton).toHaveAttribute('aria-pressed', 'true');

    // Switch back to blogs view
    fireEvent.click(blogsButton);

    // Back to initial state
    expect(blogsSection).not.toHaveClass('hidden');
    expect(projectsSection).toHaveClass('hidden');
    expect(blogsButton).toHaveAttribute('aria-pressed', 'true');
    expect(projectsButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders empty state messages when no content is available', () => {
    render(<Home blogEntries={[]} projects={[]} />);

    expect(screen.getByText('No blog posts available.')).toBeInTheDocument();
    expect(screen.getByText('No projects available.')).toBeInTheDocument();
  });

  it('renders all links with correct attributes', () => {
    render(<Home blogEntries={mockBlogEntries} projects={mockProjects} />);

    // Check blog links
    const blogLink = screen.getByRole('link', { name: 'Test Blog 1' });
    expect(blogLink).toHaveAttribute('href', '/blogs/test-blog-1');

    // Check project links
    const projectLink = screen.getByRole('link', { name: 'Test Project 1' });
    expect(projectLink).toHaveAttribute('href', '/projects/1');

    // Check external project link
    const externalLink = screen.getByText('View Project');
    expect(externalLink).toHaveAttribute('href', 'https://project1.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
