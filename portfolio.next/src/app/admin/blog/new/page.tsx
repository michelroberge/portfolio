"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CreateBlogEntry() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

    const [authenticated, setAuthenticated] = useState(false);
  
    useEffect(() => {
      async function checkAuth() {
        const res = await fetch("http://localhost:5000/api/auth/check", {
          credentials: "include",
        });
  
        if (res.ok) {
          setAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      }
  
      checkAuth();
    }, []);
  
    if (!authenticated) return <p>You are not authenticated.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, excerpt, body }),
    });

    if (response.ok) {
      router.push("/admin");
    } else {
      alert("Failed to create blog entry");
    }
  };

  return (
    <>
    <Header />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Body (HTML allowed)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
    </>
  );
}
