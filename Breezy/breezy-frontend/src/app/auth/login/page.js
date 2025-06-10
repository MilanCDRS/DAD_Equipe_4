"use client"; // [REACT] Obligatoire car on utilise des hooks, cela permet de dire à Next.js que ce fichier est un composant React.

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MyIcon from "@/app/MyIcon";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    try {
      const data = await loginUser(email, password); // Appel centralisé à l'API
      const { userId, username, role, token } = data; // destructuration des données reçues de l'API

      // !! Si la requête est réussie, on dispatch l'action loginSuccess avec les données de l'utilisateur et le token. C'est grâce à ces données chargées
      // qu'on va pouvoir afficher les info de l'uti dans la paged'accueil
      dispatch(
        loginSuccess({
          user: { id: userId, username, role, email },
          token,
        })
      );
      console.log("Login successful:", data);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        "Login failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return(
    <div className=" bg-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-6 sm:mb-10">
        <MyIcon />
      </div>
    <div className="flex items-center justify-center min-h-screen w-full bg-white px-2">
      <div className="flex flex-center w-full sm:w-4/5 md:w-2/3 xl:w-1/2 bg-white">
        <div className="mx-auto flex w-full flex-col justify-center text-gray-800 p-4 sm:p-4 xl:w-1/2">
          <div>
                        <p className='font-sans font-bold text-2xl sm:text-3xl'>Send and receive messages with breezy in real time.</p>
                        <br />
          </div>

          <div className="my-6">
                        <Link href="/registration"> 
                            <button className="w-full rounded-full bg-gray-900 p-4 sm:p-5 hover:bg-gray-600 text-white">Create an account</button>
                        </Link>
          </div>
          <div>
                        <fieldset className="border-t border-solid border-gray-800">
                            <legend className="mx-auto px-2 text-center font-bold text-sm">Or login </legend>
                        </fieldset>
          </div>

          <div className="mt-10">
                        <form onSubmit={handleLogin}>
                            <div>
                                <label className="mb-2.5 block font-medium text-gray-800" htmlFor="email">Email or username</label>
                                <input type="email" id="email" placeholder="mail@user.com" 
                                 className="inline-block w-full rounded-xl bg-white p-2.5 border border-gray-800 leading-none text-black placeholder-indigo-900 shadow placeholder:opacity-30" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required/>
                            </div>
                            <div className="mt-4">
                                <label className="mb-2.5 block font-medium text-gray-800" htmlFor="password">Password</label>
                                <input type="password" id="password" 
                                className="inline-block w-full rounded-xl bg-white p-2.5 leading-none text-black placeholder-indigo-900 shadow border border-gray-800" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required/>
                            </div>
                            <div className="mt-4 flex w-full flex-col justify-between sm:flex-row">
                                <div>
                                    <Link href="#" className="underline text-sm text-blue-400">Forgot password</Link>
                                </div>
                            </div>
                            <div className="my-10">
                                <button type="submit"
                                className="w-full rounded-full bg-gray-900 p-4 sm:p-5 hover:bg-gray-600 text-white">Login</button>
                            </div>
                        </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );

}
