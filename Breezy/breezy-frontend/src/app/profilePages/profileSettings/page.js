"use client";

import BreezyLogo from "@/BreezyLogo";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "@/app/lib/TranslationProvider";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/store/userSlice";

import Image from "next/image";
import defaultAvatar from "@/app/images/defaultAvatar.png";

export default function SettingsProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const user = useSelector((s) => s.auth.user);

  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(user?.avatar || null);

  useEffect(() => {
    console.log(isAuth + " isAuth");
    if (!isAuth) router.push("/auth/login");
  }, [isAuth, router]);

  if (!isAuth) return <p>{t("loading")}</p>;

  console.log("Received id from params:", user?.id);
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      bio: bio.trim(),
      profilePicture,
    };

    await updateProfile(payload);
    router.push("/profilePages/profile/" + user.username);

    alert(t("profileCompleted") || "Profile completed!");
  };

  return (
    <div className="bg-white min-h-screen font-[var(--font-geist-sans)] px-6 pt-8 pb-10 sm:px-10 sm:pt-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="w-[70px]">
            <button className="text-black p-5" onClick={router.back}>
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
          </div>
          <div className="flex-1 flex justify-center">
            <BreezyLogo width={24} height={24} />
          </div>
          <div className="w-[70px]" />
        </div>

        <form className="w-full space-y-8" onSubmit={handleSubmit}>
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

          <div>
            <h2 className="text-lg font-bold text-black mb-2">
              {t("describeYourself")}
            </h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholder") || "Bio"}
              className="w-full border-b border-[#5B5F63] placeholder-[#A2A5A9] focus:outline-none focus:border-black text-black bg-transparent p-2 resize-none"
              rows={3}
            />
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="text-sm text-white bg-black rounded-full px-6 py-3"
            >
              {t("Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}