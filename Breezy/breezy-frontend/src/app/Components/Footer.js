"use client"
import { BellIcon, HomeIcon, Search } from "lucide-react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
export default function Footer(){
    const isActive = (path) =>{
        const pathname = usePathname();
        return pathname === path
    };
    return (
    
    <footer className="bg-white text-black py-2 mt-auto">
        <div className="container mx-auto flex justify-center items-center space-x-15">
    <Link href="/" className="flex items-center">
      <HomeIcon
        className={`inline-block ${isActive("/") ? "text-blue-500" : "text-black"}`}
        size={24}
      />
    </Link>
    <Link href="/search" className="flex items-center">
      <Search
        className={`inline-block ${isActive("/search") ? "text-blue-500" : "text-black"}`}
        size={24}
      />
    </Link>
    <Link href="/notifications" className="flex items-center">
      <BellIcon
        className={`inline-block ${isActive("/notifications") ? "text-blue-500" : "text-black"}`}
        size={24}
      />
    </Link>
    <Link href="/messages" className="flex items-center">
      <MessageCircle
        className={`inline-block ${isActive("/messages") ? "text-blue-500" : "text-black"}`}
        size={24}
      />
    </Link>
  </div>
</footer>
    );

}