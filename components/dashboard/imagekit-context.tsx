"use client";

import { ImageKitProvider } from "imagekitio-next";
import React from "react";

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

export function ImageKitContext({ children }: { children: React.ReactNode }) {
    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            {children}
        </ImageKitProvider>
    );
}
