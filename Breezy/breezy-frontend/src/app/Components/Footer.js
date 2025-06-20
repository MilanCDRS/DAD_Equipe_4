"use client"
import { BellIcon, HomeIcon, Search } from "lucide-react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    const isHomeActive = pathname === "/" || pathname.startsWith("/posts");
    const isSearchActive = pathname.startsWith("/search");
    const isNotificationsActive = pathname.startsWith("/notifications");
    const isMessagesActive = pathname.startsWith("/messages");

    return (
        <footer className="bg-white text-black py-4 mt-auto">
            <div className="container mx-auto flex justify-center items-center space-x-16">
                <Link href="/" className="flex items-center">
                    <HomeIcon
                        className={`inline-block ${isHomeActive ? "text-blue-500" : "text-black"}`}
                        size={24}
                    />
                </Link>
                <Link href="/search" className="flex items-center">
                    <Search
                        className={`inline-block ${isSearchActive ? "text-blue-500" : "text-black"}`}
                        size={24}
                    />
                </Link>
                <Link href="/notifications" className="flex items-center">
                    <BellIcon
                        className={`inline-block ${isNotificationsActive ? "text-blue-500" : "text-black"}`}
                        size={24}
                    />
                </Link>
                <Link href="/messages" className="flex items-center">
                    <MessageCircle
                        className={`inline-block ${isMessagesActive ? "text-blue-500" : "text-black"}`}
                        size={24}
                    />
                </Link>
            </div>
        </footer>
    );
}
