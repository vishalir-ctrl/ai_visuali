import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ImageUploader from "../components/ImageUploader";
import ProductGrid from "../components/ProductGrid";
import type { Product } from "../data/products";
import api from "../services/api";

const Dashboard = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [userImage, setUserImage] = useState<File | null>(null);
    const [tryonLoading, setTryonLoading] = useState(false);
    const [tryonResult, setTryonResult] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLogout = () => {
        auth?.logout();
        navigate("/login");
    };

    const handleTryOn = async (product: Product) => {
        if (!userImage) {
            setErrorMsg("Please upload your photo first before trying on dresses.");
            return;
        }

        setErrorMsg(null);
        setTryonResult(null);
        setTryonLoading(true);

        try {
            // Fetch product image and convert to File
            const response = await fetch(product.image);
            const blob = await response.blob();
            
            // Extract filename from product image path
            const filename = product.image.split("/").pop() || "cloth.jpg";
            const clothFile = new File([blob], filename, { type: blob.type });

            const formData = new FormData();
            formData.append("person", userImage);
            formData.append("cloth", clothFile);

            const apiResponse = await api.post("/tryon/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (apiResponse.data.success) {
                // Backend serves output from the static mount "/outputs"
                const resultUrl = `${api.defaults.baseURL}/${apiResponse.data.output}`;
                setTryonResult(resultUrl);
            } else {
                setErrorMsg("Virtual Try-On failed. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg("An error occurred while connecting to the Try-On model. Please verify that the backend is running.");
        } finally {
            setTryonLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-5 border-b border-gray-200 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            AI VISUALIZER
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Experience real-time AI virtual try-on powered by CatVTON
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm text-sm"
                    >
                        Sign Out
                    </button>
                </header>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm font-medium">
                        {errorMsg}
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    
                    {/* Left Column: Upload & Controls */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <ImageUploader onImageSelected={setUserImage} />
                        
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Instructions</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                <li>Upload a clear front-facing photo of yourself.</li>
                                <li>Select any dress from the options below.</li>
                                <li>Click the <strong>Try On</strong> button to render the dress onto your photo.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Virtual Try-on Result */}
                    <div className="lg:col-span-5 flex">
                        <div className="w-full bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-6 text-white min-h-[400px] border border-slate-800 relative">
                            {tryonLoading ? (
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm font-medium text-slate-300">
                                        Generating try-on result...
                                    </p>
                                    <p className="text-xs text-slate-500 max-w-[250px]">
                                        Processing images on the Hugging Face GPU space. This can take up to a minute.
                                    </p>
                                </div>
                            ) : tryonResult ? (
                                <div className="w-full h-full flex flex-col items-center justify-between gap-4">
                                    <div className="flex justify-between items-center w-full pb-2 border-b border-slate-800">
                                        <h3 className="text-lg font-bold text-slate-200">Try-On Result</h3>
                                        <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                                            Ready
                                        </span>
                                    </div>
                                    <div className="flex-1 w-full flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800 min-h-[300px]">
                                        <img 
                                            src={tryonResult} 
                                            alt="Try On Result" 
                                            className="max-h-[380px] w-full object-contain"
                                        />
                                    </div>
                                    <a
                                        href={tryonResult}
                                        download="tryon_result.png"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1"
                                    >
                                        Open full size image
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center p-6 flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl">
                                        👗
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-300">Virtual Fitting Room</h3>
                                    <p className="text-sm text-slate-500 max-w-[280px]">
                                        Your AI-generated try-on photo will appear here once you upload your photo and click "Try On".
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dresses Grid */}
                <ProductGrid onTryOn={handleTryOn} tryonLoading={tryonLoading} />

            </div>
        </div>
    );
};

export default Dashboard;