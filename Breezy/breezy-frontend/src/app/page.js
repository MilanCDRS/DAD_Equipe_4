"use client";

import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/post";
import CreatePostButton from "../components/CreatePostButton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function PostsPage() {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const currentUser = useSelector((s) => s.auth.user);
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Si pas authentifié, redirige et ne rend rien pendant la transition
  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth/login");
    }
  }, [isAuth, router]);

  // Dès que l’on est authentifié, on va chercher les posts
  useEffect(() => {
    if (!isAuth) return;
    axios
      .get("/api/public/posts")
      .then((res) => setPosts(res.data))
      .catch(() => {
        /* on peut afficher un message d’erreur */
      })
      .finally(() => setLoading(false));
  }, [isAuth]);

  // Pendant la redirection, on peut montrer un loader
  if (!isAuth || loading) {
    return <div className="text-center text-black py-10">Chargement...</div>;
  }

  return (
    <div className="bg-[#f7f9fa] min-h-screen flex flex-col">
      {/* Header fixé en haut */}
      <div className="fixed top-0 left-0 w-full z-20">
        <Navbar />
      </div>

      <main
        className="flex-1 max-w-xl mx-auto w-full px-4 py-8"
        style={{ marginTop: "64px", marginBottom: "72px" }}
      >
        {posts.length === 0 ? (
          <div className="text-center text-black py-10">
            Aucun post pour le moment
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} currentUser={currentUser} />
          ))
        )}
      </main>

      <div className="fixed z-40" style={{ right: "32px", bottom: "88px" }}>
        <CreatePostButton />
      </div>

      <div className="fixed bottom-0 left-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}
