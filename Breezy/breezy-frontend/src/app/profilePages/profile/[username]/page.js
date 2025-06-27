"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import defaultAvatar from "@/app/images/defaultAvatar.png";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/lib/TranslationProvider";
import {
  fetchPostsByUser,
  fetchPostsCommentedByUser,
  fetchPostsLikedByUser,
  fetchProfile,
  fetchUsersFollowers,
} from "@/store/profileSlice";
import Post from "@/components/post";
import { useParams } from "next/navigation";
import { followUser, unfollowUser } from "@/utils/api"; // Assurez-vous que ces actions existent dans votre slice

export default function ProfileCard() {
  // recupere le username passe dans l'URL
  // Utilisation de useParams pour obtenir le paramètre d'URL [username]
  const { username } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const loggedUser = useSelector((s) => s.auth.user);
  const user = useSelector((s) => s.profile.user);

  const userPosts = useSelector((s) => s.profile.posts || []);
  const userCommentedPosts = useSelector((s) => s.profile.comments || []);
  const userLikedPosts = useSelector((s) => s.profile.likes || []);
  
  const {
    followers,
    followings,
    followersCount,
    followingsCount
  } = useSelector((state) => state.profile);

  const [isFollowing, setIsFollowing] = useState(false);


  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth/login");
      return;
    }

    dispatch(fetchProfile(username));
    dispatch(fetchPostsByUser(username));
    dispatch(fetchPostsCommentedByUser(username));
    dispatch(fetchPostsLikedByUser(username));
    dispatch(fetchUsersFollowers(username));

  }, [isAuth, dispatch, router, username]);
  console.log("following ?", isFollowing);

  if (!isAuth) return <p>{t("loading")}</p>;

  // Synchronize isFollowing state with followers list
  useEffect(() => {
    if (followers && loggedUser && followers.includes(loggedUser.username)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [followers, loggedUser]);

  console.log("User data:", user);
  console.log("Logged user:", loggedUser);
  console.log("User posts:", userPosts);
  console.log("User commented posts:", userCommentedPosts);
  console.log("User liked posts:", userLikedPosts);
  console.log("Followers:", followers);
  console.log("Followings:", followings);
  console.log("Followers count:", followersCount);
  console.log("Followings count:", followingsCount);
  console.log("Is following:", isFollowing);


  // Onglets Posts, Comments, Likes
  const [activeTab, setActiveTab] = useState("posts");

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          userPosts.length === 0 ? (
            <div className="text-center text-black py-10">
              Aucun post pour le moment
            </div>
          ) : (
            userPosts.map((post) => (
              <Post key={post._id} post={post} currentUser={user} />
            ))
          )
        );
      case 'comments':
        return (
          userCommentedPosts.length === 0 ? (
            <div className="text-center text-black py-10">
              Aucun post commenté pour le moment
            </div>
          ) : (
            userCommentedPosts.map((post) => (
              <Post key={post._id} post={post} currentUser={user} />
            ))
          )
        );
      case 'likes':
        return (
          userLikedPosts.length === 0 ? (
            <div className="text-center text-black py-10">
              Aucun post liké pour le moment
            </div>
          ) : (
            userLikedPosts.map((post) => (
              <Post key={post._id} post={post} currentUser={user} />
            ))
          )
        );
      default:
        return null;
    }
  };

  const renderSideButton = () => {
    if (loggedUser.username === username) {
      return (
        <button
          className="px-3 py-1 text-sm border border-gray-400 rounded-full hover:bg-gray-100 text-black"
          onClick={() => router.push("/profilePages/profileSettings")}
        >
          {t("editProfile")}
        </button>
      );
    }
    else{
      if (isFollowing) {
        return (
          <button
            className="px-3 py-1 text-sm border border-gray-400 rounded-full hover:bg-gray-100 text-black"
            onClick={() => {unfollowUser(loggedUser.username, user.username).then(() => {setIsFollowing(false); dispatch(fetchUsersFollowers(username));})}}
          >
            {t("unfollow")}
          </button>
        );
      }
      return (
        <button
          className="px-3 py-1 text-sm border border-gray-400 rounded-full hover:bg-gray-100 text-black"
          onClick={() => {followUser(loggedUser.username, user.username).then(() => {setIsFollowing(true); dispatch(fetchUsersFollowers(username));})}}
        >
          {t("follow")}
        </button>
      );
    }
  }

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
              <div>
                {renderSideButton()}
              </div>
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