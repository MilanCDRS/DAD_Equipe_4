'use client';

import Navbar from "../Components/navbar";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../Components/post";
import PostButton from "../Components/PostButton";

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
      {/* Header fixé en haut */}
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      {/* Ajoute une marge haute pour que le contenu ne passe pas sous le header */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8"
            style={{ marginTop: "64px", marginBottom: "72px" /* ajuste selon la taille réelle */ }}>
        {loading ? (
          <div className="text-center text-black py-10">Chargement...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-black py-10">Aucun post pour le moment</div>
        ) : (
          posts.map((post, idx) => <Post key={post._id || idx} post={post} />)
        )}
      </main>

      <div
        className="fixed z-40"
        style={{
          right: "32px",
          bottom: "88px",
        }}
      >
        <PostButton />
      </div>

      {/* Footer fixé en bas */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}
