import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import os from "os";

function getStorageRoot(): string {
  // If in a serverless environment (Vercel, AWS Lambda), write to os.tmpdir()
  // because the project root /var/task is read-only.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "storage", "uploads");
  }
  return path.join(process.cwd(), "storage", "uploads");
}

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
    const root = getStorageRoot();
    await fs.mkdir(root, { recursive: true });
  }

  async save(buffer: Buffer, originalFilename: string, mimeType: string): Promise<StoredFileResult> {
    const root = getStorageRoot();
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
    const fullPath = path.join(/*turbopackIgnore: true*/ root, storedFilename);

    // Prevent directory traversal
    if (!fullPath.startsWith(root)) {
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
    const filename = path.basename(storagePath);
    const candidatePaths = [
      path.join(/*turbopackIgnore: true*/ getStorageRoot(), filename),
      path.join(/*turbopackIgnore: true*/ os.tmpdir(), "storage", "uploads", filename),
      path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "uploads", filename),
    ];

    for (const p of candidatePaths) {
      try {
        return await fs.readFile(/*turbopackIgnore: true*/ p);
      } catch {
        // Continue searching
      }
    }

    return null;
  }

  async delete(storagePath: string): Promise<boolean> {
    const filename = path.basename(storagePath);
    const candidatePaths = [
      path.join(/*turbopackIgnore: true*/ getStorageRoot(), filename),
      path.join(/*turbopackIgnore: true*/ os.tmpdir(), "storage", "uploads", filename),
      path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "uploads", filename),
    ];

    for (const p of candidatePaths) {
      try {
        await fs.unlink(/*turbopackIgnore: true*/ p);
        return true;
      } catch {
        // Continue
      }
    }

    return false;
  }
}

export const storage: StorageProvider = new LocalPrivateStorageProvider();
