"use client";
import React, { useState } from "react";
import apiClient from "@/utils/api";
import Image from "next/image";
import defaultAvatar from "@/app/images/defaultAvatar.png";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/lib/TranslationProvider";
import { getUserById, getUsersFollowers } from "@/utils/api";
import Post from "@/components/post";

export default function ProfileCard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (!isAuth || !user) router.push("/auth/login");
  }, [isAuth, router]);

  if (!isAuth) return <p>{t("loading")}</p>;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/user/${user?.userId}`);
        if (res.data) {
          user.bio = res.data.bio || "";
          user.avatar = res.data.avatar || "";
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (user?.userId) fetchProfile();
  }, [user?.userId]);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);

  const fetchFollowersData = async (username) => {
    try {
      const res = await axios.get(`/api/follower/user/${username}`);
      setFollowersCount(res.data.followersCount || 0);
      setFollowingsCount(res.data.followingsCount || 0);
    } catch (error) {
      console.error("Error fetching user followers:", error);
    }
  };

  useEffect(() => {
    if (user?.username) fetchFollowersData(user.username);
  }, [user?.username]);

  // recupération des posts, commentaires et likes
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/user/${user?.username}`);
        setPosts(res.data || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    if (user?.username) fetchPosts();
  }, [user?.username]);

  const [activeTab, setActiveTab] = useState("posts");

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return posts.length === 0 ? (
          <div className="text-center text-black py-10">
            Aucun post pour le moment
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} currentUser={user} />
          ))
        );
      case "comments":
        return <p>Voici les commentaires...</p>;
      case "likes":
        return <p>Voici les likes...</p>;
      default:
        return null;
    }
  };

  const handleProfileSettings = () => {
    router.push("/profilePages/profileSettings");
  };

  return (
    <div className="w-screen h-screen bg-gray-100">
      <div className="w-full h-full bg-white border border-gray-300 shadow flex flex-col">
        <div className="flex-grow h-1/2">
          <div className="bg-gray-300 h-40 relative">
            {/* Flèche retour */}
            <button className="text-white p-5" onClick={() => router.back()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Profile Picture */}
            <div className="absolute -bottom-10 left-5">
              <Image
                src={defaultAvatar}
                alt="Profile"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
              />
            </div>
          </div>

          <div className="pt-12 px-5 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-black">
                  {user?.username}
                </h1>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
              <button
                className="px-3 py-1 text-sm border border-gray-400 rounded-full hover:bg-gray-100 text-black"
                onClick={handleProfileSettings}
              >
                {t("editProfile")}
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-600">{user?.bio}</p>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7 16c-1.1 0-2 .9-2 2s.9 2 2 2h10c1.1 0 2-.9 2-2s-.9-2-2-2H7zm0-4h10c1.1 0 2-.9 2-2s-.9-2-2-2H7c-1.1 0-2 .9-2 2s.9 2 2 2zm0-6h10c1.1 0 2-.9 2-2s-.9-2-2-2H7c-1.1 0-2 .9-2 2s.9 2 2 2z" />
              </svg>
              <span>Joined Month Year</span>
            </div>

            <div className="flex space-x-4 mt-2 text-sm text-gray-700">
              <span>
                <span className="font-semibold">{followingsCount}</span>{" "}
                Following
              </span>
              <span>
                <span className="font-semibold">{followersCount}</span>{" "}
                Followers
              </span>
            </div>
          </div>
        </div>

        {/* Bas de la page : tabs */}
        <div className="h-1/2 flex flex-col border-t">
          {/* Onglets */}
          <div className="flex justify-around text-sm text-gray-600 font-medium border-b">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {t("Posts")}
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 py-3 ${
                activeTab === "comments"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {t("Comments")}
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-3 ${
                activeTab === "likes"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {t("Likes")}
            </button>
          </div>

          {/* Contenu dynamique */}
          <div className="flex-grow p-4 overflow-auto text-gray-700 text-sm">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
