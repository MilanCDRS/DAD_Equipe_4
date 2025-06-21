import { useTranslation } from "../lib/TranslationProvider";

export default function NotImplementedComponent(){
    const {t} = useTranslation()
    return(
        <div className="flex flex col justify-center text-gray-800">
            `${t(welcomeText)}`
            welcome in breezy search
        </div>
    )
}