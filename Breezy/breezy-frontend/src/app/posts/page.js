'use client';

import Navbar from "../Components/navbar";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import Post from "../Components/post";
import PostButton from "../Components/PostButton";

export default function PostsPage(props) {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const currentUser = useSelector((s) => s.auth.user); // PATCH AJOUTÉ
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth/login");
    }
  }, [isAuth, router]);

  useEffect(() => {
    if (isAuth) {
      axios.get("/api/public/posts")
        .then(res => {
          setPosts(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isAuth]);

  if (!isAuth) return <div>Chargement...</div>;

  return (
    <div className="bg-[#f7f9fa] min-h-screen flex flex-col">
      {/* Header fixé en haut */}
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8"
            style={{ marginTop: "64px", marginBottom: "72px" }}>
        {loading ? (
          <div className="text-center text-black py-10">Chargement...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-black py-10">Aucun post pour le moment</div>
        ) : (
          posts.map((post, idx) => (
            <Post key={post._id || idx} post={post} currentUser={currentUser} /> // PATCH
          ))
        )}
      </main>
      <div className="fixed z-40" style={{ right: "32px", bottom: "88px" }}>
        <PostButton />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}
