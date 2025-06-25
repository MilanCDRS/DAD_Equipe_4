"use client";

import Link from "next/link";
import BreezyLogo from "@/BreezyLogo";
import { useState } from "react";
import { useTranslation } from "../../../lib/TranslationProvider";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/store/userSlice";
import { logout } from "@/store/authSlice";

import Image from "next/image";
import defaultAvatar from "@/app/images/defaultAvatar.png";

export default function CompleteProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // contient userId, username, etc.

  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePicture(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("bio", bio.trim());
    if (profilePicture) form.append("avatar", profilePicture);

    dispatch(updateProfile(form))
      .unwrap()
      .then(() => router.push("/"))
      .catch(console.error);
  };

  return (
    <div className="bg-white min-h-screen px-6 pt-8 pb-10 sm:px-10 sm:pt-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              // 1) dispatch de la déconnexion
              dispatch(logout());
              // 2) redirection vers la page de login
              router.push("/auth/login");
            }}
            className="text-sm text-black font-medium"
          >
            {t("cancel")}
          </button>
          <BreezyLogo />
          <div className="w-[70px]" />
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <label
              htmlFor="profile-pic-upload"
              className="cursor-pointer relative"
            >
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                {profilePicture ? (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Image
                    src={defaultAvatar}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 w-6 h-6 rounded-full text-white flex items-center justify-center text-sm">
                +
              </div>
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <h2 className="text-lg font-bold text-black text-center">
              {t("chooseProfilePicture")}
            </h2>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-lg font-bold text-black mb-2">
              {t("describeYourself")}
            </h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder") || "Bio"}
              className="w-full border-b border-gray-400 focus:outline-none focus:border-black p-2 resize-none"
              rows={3}
            />
          </div>

          {/* Bouton */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-sm text-white bg-black rounded-full px-6 py-3"
            >
              {t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
