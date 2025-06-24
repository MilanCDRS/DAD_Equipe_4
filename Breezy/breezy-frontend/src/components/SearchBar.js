// src/components/SearchBar.js
"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "../app/lib/TranslationProvider";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onSearch(q);
  };

  return (
    <div className="flex items-center w-full max-w-md mx-auto my-8 bg-white border-2 border-blue-400 rounded-full px-4 py-2 shadow-sm">
      <SearchIcon className="w-5 h-5 text-blue-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t("searchUser") || "Search User"}
        className="ml-3 bg-transparent flex-1 outline-none placeholder-gray-500 text-gray-900"
      />
    </div>
  );
}
