import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "uploads");

// Allowed file types for document uploads (strict validation)
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export interface StoredFileResult {
  storagePath: string; // Relative or internal key
  filename: string;
  fileSize: number;
  mimeType: string;
}

export interface StorageProvider {
  save(buffer: Buffer, originalFilename: string, mimeType: string): Promise<StoredFileResult>;
  read(storagePath: string): Promise<Buffer | null>;
  delete(storagePath: string): Promise<boolean>;
}

class LocalPrivateStorageProvider implements StorageProvider {
  private async ensureDir() {
    await fs.mkdir(STORAGE_ROOT, { recursive: true });
  }

  async save(buffer: Buffer, originalFilename: string, mimeType: string): Promise<StoredFileResult> {
    await this.ensureDir();

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`File type ${mimeType} is not permitted.`);
    }

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error("File exceeds maximum allowed size (10 MB).");
    }

    // Determine safe extension based on mimeType
    const extMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "application/pdf": ".pdf",
    };
    const extension = extMap[mimeType] || path.extname(originalFilename).toLowerCase() || ".bin";

    // Safe randomized storage filename
    const uniqueId = crypto.randomUUID();
    const storedFilename = `${uniqueId}${extension}`;
    const fullPath = path.join(STORAGE_ROOT, storedFilename);

    // Prevent directory traversal
    if (!fullPath.startsWith(STORAGE_ROOT)) {
      throw new Error("Invalid storage destination");
    }

    await fs.writeFile(fullPath, buffer);

    return {
      storagePath: storedFilename,
      filename: originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_"),
      fileSize: buffer.length,
      mimeType,
    };
  }

  async read(storagePath: string): Promise<Buffer | null> {
    const fullPath = path.join(STORAGE_ROOT, path.basename(storagePath));
    if (!fullPath.startsWith(STORAGE_ROOT)) {
      return null;
    }
    try {
      return await fs.readFile(fullPath);
    } catch {
      return null;
    }
  }

  async delete(storagePath: string): Promise<boolean> {
    const fullPath = path.join(STORAGE_ROOT, path.basename(storagePath));
    if (!fullPath.startsWith(STORAGE_ROOT)) {
      return false;
    }
    try {
      await fs.unlink(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

export const storage: StorageProvider = new LocalPrivateStorageProvider();
