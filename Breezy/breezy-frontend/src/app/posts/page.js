'use client';

import Navbar from "../Components/navbar";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../Components/post";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/public/posts")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#f7f9fa] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        {loading ? (
          <div className="text-center text-black py-10">Chargement...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-black py-10">Aucun post pour le moment</div>
        ) : (
          posts.map((post, idx) => <Post key={post._id || idx} post={post} />)
        )}
      </main>
      <Footer />
    </div>
  );
}
