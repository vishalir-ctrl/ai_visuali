import { useState, useEffect } from "react";
import api from "../services/api";

interface ImageUploaderProps {
    onImageSelected: (file: File | null) => void;
}

const ImageUploader = ({ onImageSelected }: ImageUploaderProps) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            onImageSelected(file);
        } else {
            setSelectedFile(null);
            onImageSelected(null);
        }

    };

    const handleUpload = async () => {

        if (!selectedFile) {
            setMessage("Please choose an image.");
            return;
        }

        const formData = new FormData();

        formData.append("file", selectedFile);

        try {

            setLoading(true);

            const response = await api.post(
                "/upload/image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage(response.data.message);

        }

        catch (error: any) {

            console.log(error);

            setMessage("Upload Failed");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-lg p-6 w-full">

            <h2 className="text-2xl font-bold mb-5">

                Upload Your Photo

            </h2>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    <button
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                    >

                        {loading ? "Uploading..." : "Upload"}

                    </button>

                    <p className="mt-4 text-green-600 font-semibold">

                        {message}

                    </p>
                </div>

                {previewUrl && (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

        </div>

    );

};

export default ImageUploader;