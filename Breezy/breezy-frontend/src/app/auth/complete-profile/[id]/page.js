"use client";

import Link from "next/link";
import MyIcon from "@/app/MyIcon";
import { useState } from "react";
import { useTranslation } from "../../../lib/TranslationProvider";
import { updateUser } from "../../../../utils/api";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  console.log("Received id from params:", id);
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
    router.push(`/users/${id}`);

    alert(t("profileCompleted") || "Profile completed!");
  };

  return (
    <div className="bg-white min-h-screen font-[var(--font-geist-sans)] px-6 pt-8 pb-10 sm:px-10 sm:pt-12">
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="w-[70px]">
            <Link
              href="/auth/register"
              className="text-sm text-black font-medium"
            >
              {t("cancel")}
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <MyIcon />
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
                  <span className="text-white text-3xl">👤</span>
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
              {t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
