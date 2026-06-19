import * as documentRepository from "../repositories/document.repository.js";
import crypto from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. Initialize the S3 Client using environment variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Uploads a file buffer directly to AWS S3
 */
const uploadToCloudStorage = async (fileBuffer, fileName, mimeType, fileType) => {
  // Organize assets neatly into folder structures inside your bucket
  const s3Key = `assets/${fileType.toLowerCase()}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Return the permanent base S3 URL format
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${s3Key}`;
};

/**
 * Generates a short-lived, highly secure presigned URL for private file access
 */
const generateSecurePresignedUrl = async (fileUrl) => {
  // Extract the unique S3 Key path out of the full permanent URL
  // e.g., "https://bucket.s3.region.amazonaws.com/assets/pdf/file.pdf" -> "assets/pdf/file.pdf"
  const urlParts = fileUrl.split(`.amazonaws.com/`);
  if (urlParts.length < 2) throw new Error("Invalid S3 URL string structured during parsing");
  const s3Key = urlParts[1];

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  // Generate a link that automatically expires after 15 minutes (900 seconds)
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

/**
 * Removes a file binary physically from the AWS S3 Bucket storage layer
 */
const deleteFromCloudStorage = async (fileUrl) => {
  const urlParts = fileUrl.split(`.amazonaws.com/`);
  if (urlParts.length < 2) return; // Fail-safe check
  const s3Key = urlParts[1];

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  await s3Client.send(command);
};

/* ==========================================
   Core Service Export Logic Layers
   ========================================== */

export const processUpload = async ({ file, fileType, relationType, relationId, ownerId }) => {
  const fileExtension = file.originalname.split(".").pop();
  const uniqueId = crypto.randomUUID();
  const uniqueFileName = `${uniqueId}-${Date.now()}.${fileExtension}`;

  // Upload the live binary buffer chunk array to AWS S3
  const cloudUrl = await uploadToCloudStorage(file.buffer, uniqueFileName, file.mimetype, fileType);

  const documentData = {
    fileName: file.originalname,
    fileUrl: cloudUrl,
    fileType: fileType,
    mimeType: file.mimetype,
    fileSize: file.size,
    ownerId: ownerId,
    relationType: relationType || null,
    relationId: relationId || null
  };

  return await documentRepository.create(documentData);
};

export const getSecureDownloadUrl = async (id, userId) => {
  const document = await documentRepository.findById(id);
  if (!document) throw new Error("Document not found");

  if (String(document.owner_id) !== String(userId)) {
    throw new Error("Unauthorized access to this document");
  }

  // Security layer: Private files (PDFs, Contracts) generate an authenticated link.
  // Public files (profile avatars, decorative inline dashboard images) can return safely directly.
  if (["CONTRACT", "PRICING", "PDF"].includes(document.file_type)) {
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

  // 1. Purge physical binary from the AWS Cloud Storage block
  await deleteFromCloudStorage(document.file_url);

  // 2. Clear out row footprint out of SQL database
  return await documentRepository.deleteById(id);
};