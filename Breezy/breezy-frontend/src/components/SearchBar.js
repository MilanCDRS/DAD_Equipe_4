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
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 mb-6">
      <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t("searchUser")}
        className="ml-3 bg-transparent flex-1 outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}
