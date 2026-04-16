/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IKUpload } from "imagekitio-next";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, Play } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface MediaUploaderProps {
    mediaUrls: string[];
    setMediaUrls: (urls: string[]) => void;
}

const MAX_FILES = 4;

export function MediaUploader({
    mediaUrls,
    setMediaUrls,
}: MediaUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const onError = (err: any) => {
        console.error("ImageKit Upload Error", err);
        toast.error("Upload failed: " + (err.message || "Unknown error"));
        setIsUploading(false);
        setUploadProgress(0);
    };

    const onSuccess = (res: any) => {
        setMediaUrls([...mediaUrls, res.url]);
        toast.success("File uploaded!");
        setIsUploading(false);
        setUploadProgress(0);
    };

    const onUploadProgress = (progress: any) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentage);
        setIsUploading(true);
    };

    const removeMedia = (url: string) => {
        setMediaUrls(mediaUrls.filter((u) => u !== url));
    };

    const isVideo = (url: string) => {
        return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes("/video/");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Media ({mediaUrls.length}/{MAX_FILES})</label>
                <span className="text-[10px] text-muted-foreground">Max 4 files · Images & Videos supported</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mediaUrls.map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                        {isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <Play className="w-8 h-8 text-white opacity-50" />
                                <video
                                    src={url}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                />
                            </div>
                        ) : (
                            <Image
                                src={url}
                                alt="Uploaded media"
                                fill
                                className="object-cover"
                            />
                        )}
                        <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removeMedia(url)}
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                ))}

                {mediaUrls.length < MAX_FILES && (
                    <div
                        className="relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => !isUploading && uploadInputRef.current?.click()}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2 px-4 w-full">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <Progress value={uploadProgress} className="h-1 w-full" />
                                <span className="text-[10px] font-medium">{uploadProgress}%</span>
                            </div>
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
                                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
                                if (!validTypes.includes(file.type)) {
                                    toast.error("Invalid file type. Only Images and Videos allowed.");
                                    return false;
                                }
                                if (file.size > 20 * 1024 * 1024) { // 20MB limit
                                    toast.error("File too large. Max 20MB allowed.");
                                    return false;
                                }
                                return true;
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
