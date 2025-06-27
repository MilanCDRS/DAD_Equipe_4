"use client";
import { useTranslation } from "../app/lib/TranslationProvider";
import MainLayoutComponent from "./MainLayoutComponent";

export default function NotImplementedComponent({children}){
    const {t} = useTranslation()
    return(
        <div className="flex flex col justify-center items-center bg-white font-3XL text-gray-800">

            <MainLayoutComponent> {children} 
                <div className="flex items-center font-3XL">
                {t("welcomeText")}
            </div>
             </MainLayoutComponent>
            

            
        </div>
    )
}