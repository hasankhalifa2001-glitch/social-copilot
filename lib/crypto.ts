import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The output is a colon-separated string of hex-encoded IV, ciphertext, and auth tag.
 * @param text The plain text to encrypt.
 * @returns The encrypted string.
 */
export function encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(
        ALGORITHM,
        Buffer.from(env.TOKEN_ENCRYPTION_KEY, "hex"),
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypts a string that was encrypted using encrypt().
 * @param ciphertext The encrypted string (iv:encrypted:authTag).
 * @returns The decrypted plain text.
 */
export function decrypt(ciphertext: string): string {
    const [ivHex, encryptedHex, authTagHex] = ciphertext.split(":");

    if (!ivHex || !encryptedHex || !authTagHex) {
        throw new Error("Invalid ciphertext format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = createDecipheriv(
        ALGORITHM,
        Buffer.from(env.TOKEN_ENCRYPTION_KEY, "hex"),
        iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
