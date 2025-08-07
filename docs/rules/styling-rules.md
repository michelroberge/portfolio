# Styling Rules

## Quick Reference
**When to use**: CSS styling, responsive design, dark mode, and UI consistency

## Core Rules

### 🎨 **Tailwind CSS Patterns**

#### Responsive Design
```typescript
// ✅ Good - Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3 p-4">
  <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
    {title}
  </h2>
  <p className="text-sm md:text-base text-gray-600">
    {description}
  </p>
</div>

// ✅ Good - Responsive grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
      {item.content}
    </div>
  ))}
}

// ✅ Good - Responsive navigation
<nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
  <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
  <a href="/about" className="text-blue-600 hover:text-blue-800">About</a>
  <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact</a>
</nav>
```

#### Dark Mode Support
```typescript
// ✅ Good - Dark mode classes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
    {title}
  </h1>
  <p className="text-gray-600 dark:text-gray-300">
    {description}
  </p>
</div>

// ✅ Good - Dark mode for cards
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {cardTitle}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">
      {cardContent}
    </p>
  </div>
</div>

// ✅ Good - Dark mode for buttons
<button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
  {buttonText}
</button>
```

#### Component Styling
```typescript
// ✅ Good - Consistent card styling
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
      <Link 
        href={link} 
        className="hover:text-blue-500 transition-colors focus:outline-none focus:text-blue-500"
      >
        {title}
      </Link>
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
</div>

// ✅ Good - Form styling
<form className="space-y-4">
  <div>
    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Title
    </label>
    <input
      id="title"
      type="text"
      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      placeholder="Enter title"
    />
  </div>
  <button
    type="submit"
    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    Submit
  </button>
</form>
```

### 🎯 **Layout Patterns**

#### Container Layouts
```typescript
// ✅ Good - Main container
<main className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
    {pageTitle}
  </h1>
  {content}
</main>

// ✅ Good - Two-column layout
<div className="flex flex-col lg:flex-row gap-8">
  <div className="lg:w-2/3">
    {/* Main content */}
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {mainContent}
    </section>
  </div>
  <div className="lg:w-1/3">
    {/* Sidebar */}
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {sidebarContent}
    </aside>
  </div>
</div>

// ✅ Good - Centered layout
<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
  <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
    {centeredContent}
  </div>
</div>
```

#### Navigation Patterns
```typescript
// ✅ Good - Header navigation
<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Portfolio
        </h1>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          Home
        </a>
        <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          About
        </a>
        <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          Contact
        </a>
      </nav>
    </div>
  </div>
</header>

// ✅ Good - Mobile navigation toggle
<div className="md:hidden">
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>
```

### 🎨 **Interactive Elements**

#### Button Patterns
```typescript
// ✅ Good - Primary button
<button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  {buttonText}
</button>

// ✅ Good - Secondary button
<button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
  {buttonText}
</button>

// ✅ Good - Danger button
<button className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
  {buttonText}
</button>

// ✅ Good - Loading button
<button 
  disabled={loading}
  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <div className="flex items-center">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </div>
  ) : (
    buttonText
  )}
</button>
```

#### Form Elements
```typescript
// ✅ Good - Input field
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    placeholder="Enter your email"
  />
</div>

// ✅ Good - Textarea
<div>
  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Message
  </label>
  <textarea
    id="message"
    rows={4}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    placeholder="Enter your message"
  />
</div>

// ✅ Good - Select dropdown
<div>
  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Category
  </label>
  <select
    id="category"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
  >
    <option value="">Select a category</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </select>
</div>
```

### 🎨 **Typography Patterns**

#### Text Styling
```typescript
// ✅ Good - Heading hierarchy
<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
  Main Heading
</h1>
<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
  Section Heading
</h2>
<h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
  Subsection Heading
</h3>

// ✅ Good - Body text
<p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
  Regular body text with good line height for readability.
</p>

// ✅ Good - Small text
<p className="text-sm text-gray-500 dark:text-gray-400">
  Small text for captions, metadata, or secondary information.
</p>

// ✅ Good - Link styling
<a href="/link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors">
  Link text
</a>
```

#### Content Styling
```typescript
// ✅ Good - Prose content (for markdown)
<div className="prose dark:prose-invert max-w-none">
  <h1>Markdown Heading</h1>
  <p>Markdown content with proper typography.</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
</div>

// ✅ Good - Code blocks
<pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
  <code className="text-sm text-gray-800 dark:text-gray-200">
    {codeContent}
  </code>
</pre>
```

### 🎨 **Status and Feedback**

#### Alert Patterns
```typescript
// ✅ Good - Success alert
<div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-green-800 dark:text-green-200">
        {successMessage}
      </p>
    </div>
  </div>
</div>

// ✅ Good - Error alert
<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-red-800 dark:text-red-200">
        {errorMessage}
      </p>
    </div>
  </div>
</div>

// ✅ Good - Warning alert
<div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        {warningMessage}
      </p>
    </div>
  </div>
</div>
```

#### Loading States
```typescript
// ✅ Good - Loading spinner
<div className="flex items-center justify-center p-8">
  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
</div>

// ✅ Good - Skeleton loading
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
</div>
```

### 🎨 **Animation and Transitions**

#### Transition Patterns
```typescript
// ✅ Good - Smooth transitions
<div className="transition-all duration-300 ease-in-out hover:scale-105">
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    {content}
  </div>
</div>

// ✅ Good - Fade transitions
<div className="opacity-0 animate-fade-in">
  {content}
</div>

// ✅ Good - Slide transitions
<div className="transform translate-x-full animate-slide-in">
  {content}
</div>
```

## Common Patterns

### 🔄 **Reusable Component Classes**
```typescript
// ✅ Good - Common button variants
const buttonVariants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700"
};

// ✅ Good - Common card styles
const cardStyles = "bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700";

// ✅ Good - Common input styles
const inputStyles = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white";
```

### 🔄 **Responsive Utilities**
```typescript
// ✅ Good - Responsive visibility
<div className="hidden md:block">
  {/* Desktop only content */}
</div>
<div className="block md:hidden">
  {/* Mobile only content */}
</div>

// ✅ Good - Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {content}
</div>

// ✅ Good - Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  {title}
</h1>
```

## Quick Checklist

- [ ] **Responsive design** is implemented with mobile-first approach
- [ ] **Dark mode** support is included for all components
- [ ] **Consistent spacing** uses Tailwind's spacing scale
- [ ] **Typography** follows proper hierarchy and readability
- [ ] **Interactive elements** have proper hover and focus states
- [ ] **Loading states** are implemented for async operations
- [ ] **Error states** are clearly communicated
- [ ] **Accessibility** considerations are included
- [ ] **Performance** is optimized (no unused CSS)
- [ ] **Consistency** is maintained across components

## Cross-References

- [Component Patterns](component-patterns.md) - React component styling
- [Frontend Rules](frontend-rules.md) - React and TypeScript patterns
- [State Management](state-management.md) - UI state patterns

---

*Follow these styling patterns to create consistent, accessible, and responsive user interfaces.*
