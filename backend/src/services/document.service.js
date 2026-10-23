import * as documentRepository from "../repositories/document.repository.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

const isS3Configured = () => {
  const key = process.env.AWS_ACCESS_KEY_ID;
  const secret = process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.AWS_S3_BUCKET_NAME;

  return Boolean(
    key &&
    key !== "your_access_key" &&
    secret &&
    secret !== "your_secret_key" &&
    bucket &&
    bucket !== "your_actual_bucket_name"
  );
};

// Initialize S3 client only when needed
let s3Client = null;
const getS3Client = () => {
  if (!s3Client && isS3Configured()) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Uploads a file buffer directly to AWS S3
 */
const uploadToCloudStorage = async (fileBuffer, fileName, mimeType, fileType) => {
  const s3 = getS3Client();
  const s3Key = `assets/${fileType.toLowerCase()}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${s3Key}`;
};

/**
 * Saves a file buffer locally as fallback when AWS S3 is not configured
 */
const saveToLocalStorage = async (fileBuffer, fileName) => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(filePath, fileBuffer);
  return `/uploads/${fileName}`;
};

/**
 * Generates a short-lived presigned URL for private S3 file access
 */
const generateSecurePresignedUrl = async (fileUrl) => {
  const s3 = getS3Client();
  const urlParts = fileUrl.split(`.amazonaws.com/`);
  if (urlParts.length < 2) throw new Error("Invalid S3 URL string structured during parsing");
  const s3Key = urlParts[1];

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 900 });
};

/**
 * Removes a file binary from AWS S3 Bucket or local storage
 */
const deleteFromStorage = async (fileUrl) => {
  if (fileUrl.startsWith("/uploads/")) {
    const fileName = path.basename(fileUrl);
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }
    return;
  }

  if (isS3Configured()) {
    const s3 = getS3Client();
    const urlParts = fileUrl.split(`.amazonaws.com/`);
    if (urlParts.length < 2) return;
    const s3Key = urlParts[1];

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    await s3.send(command).catch((err) => {
      console.warn("Failed to delete S3 object:", err.message);
    });
  }
};

/* ==========================================
   Core Service Export Logic Layers
   ========================================== */

export const getDocumentsByUser = async (userId) => {
  return await documentRepository.findByOwnerId(userId);
};

export const processUpload = async ({ file, fileType, relationType, relationId, ownerId }) => {
  const fileExtension = file.originalname.split(".").pop();
  const uniqueId = crypto.randomUUID();
  const uniqueFileName = `${uniqueId}-${Date.now()}.${fileExtension}`;

  let cloudUrl;
  if (isS3Configured()) {
    cloudUrl = await uploadToCloudStorage(file.buffer, uniqueFileName, file.mimetype, fileType);
  } else {
    console.log("AWS S3 not configured or using placeholders. Falling back to local storage.");
    cloudUrl = await saveToLocalStorage(file.buffer, uniqueFileName);
  }

  const documentData = {
    fileName: file.originalname,
    fileUrl: cloudUrl,
    fileType: fileType,
    mimeType: file.mimetype,
    fileSize: file.size,
    ownerId: String(ownerId),
    relationType: relationType || null,
    relationId: relationId ? String(relationId) : null,
  };

  return await documentRepository.create(documentData);
};

export const getSecureDownloadUrl = async (id, userId) => {
  const document = await documentRepository.findById(id);
  if (!document) throw new Error("Document not found");

  if (String(document.owner_id) !== String(userId)) {
    throw new Error("Unauthorized access to this document");
  }

  // If stored locally
  if (document.file_url.startsWith("/uploads/")) {
    return document.file_url;
  }

  // If stored on AWS S3
  if (isS3Configured() && ["CONTRACT", "PRICING", "PDF"].includes(document.file_type)) {
    return await generateSecurePresignedUrl(document.file_url);
  }

  return document.file_url;
};

export const processDelete = async (id, userId) => {
  const document = await documentRepository.findById(id);
  if (!document) throw new Error("Document not found");

  if (String(document.owner_id) !== String(userId)) {
    throw new Error("Unauthorized to delete this document");
  }

  await deleteFromStorage(document.file_url);
  return await documentRepository.deleteById(id);
};