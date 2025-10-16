import React from "react";
import "./Blog.css"; // Import custom CSS for styling

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Understanding React Hooks",
      excerpt: "An in-depth guide to understanding and using React Hooks effectively in your applications.",
      image: "https://via.placeholder.com/300",
      date: "October 10, 2024",
    },
    {
      id: 2,
      title: "Getting Started with Node.js",
      excerpt: "A beginner's guide to setting up a Node.js server and building a simple application.",
      image: "https://via.placeholder.com/300",
      date: "October 5, 2024",
    },
    {
      id: 3,
      title: "CSS Flexbox Tutorial",
      excerpt: "Learn how to use Flexbox to create responsive layouts easily.",
      image: "https://via.placeholder.com/300",
      date: "September 28, 2024",
    },
  ];

  return (
    <div className="blog-page mt-20 px-4 lg:px-24">
      <header className="blog-header">
        <h1 className="blog-title">Our Blog</h1>
      </header>
      <div className="blog-container">
        <div className="blog-posts">
          {posts.map((post) => (
            <div className="blog-post" key={post.id}>
              <img src={post.image} alt={post.title} className="blog-image" />
              <h2 className="post-title">{post.title}</h2>
              <p className="post-date">{post.date}</p>
              <p className="post-excerpt">{post.excerpt}</p>
              <button className="read-more">Read More</button>
            </div>
          ))}
        </div>
        <aside className="blog-sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            <li>React</li>
            <li>Node.js</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <h3 className="sidebar-title">Recent Posts</h3>
          <ul className="recent-posts">
            <li>Understanding React Hooks</li>
            <li>Getting Started with Node.js</li>
            <li>CSS Flexbox Tutorial</li>
          </ul>
        </aside>
      </div>
      <footer className="blog-footer">
        <p>© 2024 Your Blog Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Blog;
