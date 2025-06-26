"use client";

import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import Post from "../components/post";
import CreatePostButton from "../components/CreatePostButton";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "@/store/postsSlice";
import { useRouter } from "next/navigation";

export default function PostsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const posts = useSelector((s) => s.posts.list);
  const status = useSelector((s) => s.posts.status);
  const currentUser = useSelector((s) => s.auth.user); // ← ajout

  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth/login");
      return;
    }
    dispatch(fetchPosts());
  }, [isAuth, dispatch, router]);

  if (!isAuth || status === "loading") {
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
        style={{ marginTop: 64, marginBottom: 72 }}
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

      <div className="fixed z-40" style={{ right: 32, bottom: 88 }}>
        <CreatePostButton />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
        <Footer />
      </div>
    </div>
  );
}
