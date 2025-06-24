"use client";
// src/app/search/page.js

import MainLayoutComponent from "../../components/MainLayoutComponent";
import SearchBar from "../../components/SearchBar";
import { getAllUsers } from "../../utils/api";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers("");
  }, []);

  const loadUsers = async (searchTerm) => {
    setLoading(true);
    try {
      const data = await getAllUsers({
        page: 1,
        limit: 15,
        search: searchTerm,
      });
      setResults(data.users);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q) => {
    loadUsers(q);
  };

  return (
    <MainLayoutComponent className="bg-[#f7f9fa] min-h-screen">
      <div className="flex flex-col items-center w-full pt-8 pb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && <div className="text-center">Chargement…</div>}

      <ul className="space-y-3 max-w-md mx-auto w-full">
        {results.map((u) => (
          <li
            key={u._id}
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="font-semibold text-gray-900">{u.username}</div>
            <div className="text-sm text-gray-600">{u.email}</div>
          </li>
        ))}
      </ul>
    </MainLayoutComponent>
  );
}
