"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addPost } from "@/store/postsSlice"; // votre thunk

export default function CreatePostPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // --- 1) Sélection de l’état d’auth et du statut de création
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const postStatus = useSelector((s) => s.posts.status);
  const isLoading = postStatus === "loading";

  // --- 2) États locaux pour le contenu du post
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 Mo

  // --- 3) Redirection si non connecté
  useEffect(() => {
    if (!isAuth) router.replace("/auth/login");
  }, [isAuth, router]);

  // --- 4) Envoi du post via le thunk `addPost`
  const handleSend = async () => {
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append("content", text);
    if (image) formData.append("image", image);

    try {
      // dispatch du thunk, qui fait l’API et met à jour `state.posts.list`
      await dispatch(addPost(formData)).unwrap();

      // reset de l’UI et retour à la liste
      setText("");
      setImage(null);
      setImagePreview(null);
      router.push("/");
    } catch (err) {
      console.error("addPost failed:", err);
      alert("Erreur lors de l'envoi du post : " + err);
    }
  };

  const handleCancel = () => router.back();

  // --- 5) Gestion locale de l’aperçu d’image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      return alert("L'image est trop grande (max 2 Mo).");
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  if (!isAuth) {
    return <div>Chargement…</div>;
  }
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-md mx-auto flex items-center px-4 pt-4 pb-2">
        <button
          onClick={handleCancel}
          className="text-blue-400 font-medium hover:underline"
        >
          Cancel
        </button>
        <div className="flex-1" />
        <button
          disabled={(!text.trim() && !image) || isLoading}
          onClick={handleSend}
          className={`rounded-full px-5 py-1.5 text-white font-semibold transition ${
            (!text.trim() && !image) || isLoading
              ? "bg-blue-100 text-blue-200 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-500"
          }`}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
      <main className="w-full max-w-md flex-1 px-4 flex flex-col">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center mt-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#d1d5db" />
              <path
                d="M16 17c2.67 0 8 1.34 8 4v3H8v-3c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
                fill="#9ca3af"
              />
            </svg>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            className="flex-1 border-none focus:ring-0 resize-none text-[17px] placeholder-gray-400 bg-transparent mt-2 text-black"
            style={{ outline: "none", color: "#000" }}
            maxLength={280}
          />
        </div>
        {imagePreview && (
          <div className="relative w-full max-w-xs mx-auto mb-2 mt-2">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="rounded-xl w-full object-cover"
            />
            <button
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
              className="absolute top-2 right-2 bg-white rounded-full shadow px-2 text-gray-500 text-sm"
              aria-label="Supprimer l'image"
              type="button"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center gap-4 pt-2">
          <button
            className="p-2 hover:bg-blue-50 rounded-full"
            onClick={() => fileInputRef.current.click()}
            type="button"
            aria-label="Ajouter une photo"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            >
              <rect x="5" y="10" width="18" height="10" rx="3" />
              <circle cx="14" cy="15" r="3" />
              <path d="M9 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            aria-label="Ajouter une photo"
          />
          {image && (
            <span className="text-sm text-gray-600 ml-2">
              {image.name} ({(image.size / 1024).toFixed(1)} Ko)
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
