import Footer from "./Footer";
import Navbar from "./navbar";

export default function PageTest() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Navbar />
            <Footer />
         </div>   
    );
}