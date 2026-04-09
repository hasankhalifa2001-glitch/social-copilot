/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface MediaUploaderProps {
    mediaUrls: string[];
    setMediaUrls: (urls: string[]) => void;
}

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit/auth");
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error}`);
    }
};

export function MediaUploader({
    mediaUrls,
    setMediaUrls,
}: MediaUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const onError = (err: any) => {
        console.log("Error", err);
        toast.error("Upload failed: " + err.message);
        setIsUploading(false);
    };

    const onSuccess = (res: any) => {
        console.log("Success", res);
        setMediaUrls([...mediaUrls, res.url]);
        toast.success("File uploaded!");
        setIsUploading(false);
    };

    const onUploadProgress = (progress: any) => {
        console.log("Progress", progress);
        setIsUploading(true);
    };

    const removeMedia = (url: string) => {
        setMediaUrls(mediaUrls.filter((u) => u !== url));
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium">Media (Max 10)</label>

            <ImageKitProvider
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaUrls.map((url) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                            <Image
                                src={url}
                                alt="Uploaded media"
                                fill
                                className="object-cover"
                            />
                            <Button
                                onClick={() => removeMedia(url)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}

                    {mediaUrls.length < 10 && (
                        <div
                            className="relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => uploadInputRef.current?.click()}
                        >
                            {isUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground font-medium">Upload Media</span>
                                </>
                            )}
                            <IKUpload
                                className="hidden"
                                onError={onError}
                                onSuccess={onSuccess}
                                onUploadProgress={onUploadProgress}
                                ref={uploadInputRef}
                                validateFile={(file: File) => {
                                    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
                                    if (!validTypes.includes(file.type)) {
                                        toast.error("Invalid file type. Only JPG, PNG, GIF, MP4, MOV allowed.");
                                        return false;
                                    }
                                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                                        toast.error("File too large. Max 10MB allowed.");
                                        return false;
                                    }
                                    return true;
                                }}
                            />
                        </div>
                    )}
                </div>
            </ImageKitProvider>
        </div>
    );
}
