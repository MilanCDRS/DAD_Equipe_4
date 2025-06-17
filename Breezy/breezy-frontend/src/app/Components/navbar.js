import { SettingsIcon, UserIcon } from "lucide-react";
import MyIcon from "../MyIcon";
import Link from "next/link";

export default function Navbar() {
    return(
        <div className="bg-white shadow-md p-4 flex flex-col items-center">
            <nav className="container mx-auto cover flex justify-center items-center space-x-30">
                <Link href="/profile" className="text-black hover:text-blue-500 ">
                    <UserIcon className="inline-block mr-2" size={24}  color="black"/>

                </Link>
                <Link href="/home" className="text-black hover:text-blue-500 ">
                    <MyIcon with={24} height ={24}/>
                </Link>
                <Link href="/settings" className="text-black hover:text-blue-500 ">
                    <SettingsIcon className="inline-block mr-2" size={24} color="black" />
                </Link>
            </nav>

        </div>
    );
}