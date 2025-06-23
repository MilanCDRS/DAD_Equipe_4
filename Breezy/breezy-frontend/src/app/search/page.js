"use client";
// src/app/search/page.js
import MainLayoutComponent from "../../components/MainLayoutComponent";
import SearchBar from "../../components/SearchBar";
import { getAllUsers } from "../../utils/api";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // charge initialement une page (ou vide)
  useEffect(() => {
    loadUsers("");
  }, []);

  const loadUsers = async (searchTerm) => {
    setLoading(true);
    try {
      // Par exemple, ton endpoint getAllUsers accepte query en paramètre
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
    // soit appeler API à chaque frappe, soit debounce…
    loadUsers(q);
  };

  return (
    <MainLayoutComponent>
      <SearchBar onSearch={handleSearch} />

      {loading && <div className="text-center">Chargement…</div>}

      <ul className="space-y-3">
        {results.map((u) => (
          <li
            key={u._id}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
          >
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {u.username}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {u.email}
            </div>
          </li>
        ))}
      </ul>
    </MainLayoutComponent>
  );
}
