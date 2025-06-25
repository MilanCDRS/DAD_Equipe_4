"use client";
// src/app/search/page.js

import MainLayoutComponent from "../../components/MainLayoutComponent";
import SearchBar from "../../components/SearchBar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/usersSlice";

export default function SearchPage() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 15, search: "" }));
  }, [dispatch]);

  const handleSearch = (q) => {
    dispatch(fetchUsers({ page: 1, limit: 15, search: q }));
  };

  return (
    <MainLayoutComponent className="bg-[#f7f9fa] min-h-screen">
      <div className="flex flex-col items-center w-full pt-8 pb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {status === "loading" && <div className="text-center">Chargement…</div>}
      {status === "failed" && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      <ul className="space-y-3 max-w-md mx-auto w-full">
        {users.map((u) => (
          <li key={u._id} className="p-4 bg-white rounded-lg shadow">
            <div className="font-semibold text-gray-900">{u.username}</div>
            <div className="text-sm text-gray-600">{u.email}</div>
          </li>
        ))}
      </ul>
    </MainLayoutComponent>
  );
}
