import * as documentRepository from "../repositories/document.repository.js";
import crypto from "crypto";

// Mock helper simulating cloud storage SDK calls (AWS S3, etc.)
// Replace this logic with your chosen storage driver initialization later.
const uploadToCloudStorage = async (fileBuffer, fileName, mimeType, fileType) => {
  // In real life: return s3.upload({...}).promise()
  // Private files would go to a secure private bucket path; images to a public one.
  return `https://storage.proposalproai.internal/buckets/${fileType.toLowerCase()}/${fileName}`;
};

const generateSecurePresignedUrl = async (fileUrl) => {
  // In real life: return s3.getSignedUrlPromise('getObject', { Bucket, Key, Expires: 900 })
  return `${fileUrl}?token=${crypto.randomBytes(16).toString("hex")}&expires=${Date.now() + 900000}`;
};

export const processUpload = async ({ file, fileType, relationType, relationId, ownerId }) => {
  // 1. Generate a completely unique, safe filename to prevent overwrites
  const fileExtension = file.originalname.split(".").pop();
  const uniqueId = crypto.randomUUID();
  const uniqueFileName = `${uniqueId}-${Date.now()}.${fileExtension}`;

  // 2. Stream/Upload the file buffer directly to your cloud platform
  const cloudUrl = await uploadToCloudStorage(file.buffer, uniqueFileName, file.mimetype, fileType);

  // 3. Prepare dataset structure for repository insertion
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

  // 4. Record metadata entry inside PostgreSQL
  return await documentRepository.create(documentData);
};

export const getSecureDownloadUrl = async (id, userId) => {
  const document = await documentRepository.findById(id);
  if (!document) throw new Error("Document not found");

  // Multi-tenant check: Only owner (or someone related to the asset) can pull down sensitive files
 if (String(document.owner_id) !== String(userId)) {
    throw new Error("Unauthorized access to this document");
  }

  // Handle access control mechanics:
  // If it's a private asset, create short-lived signed link. Inline images can return original link.
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

  // 1. In production, you would also trigger cloud SDK file elimination here:
  // await deleteFromCloudStorage(document.file_url);

  // 2. Erase row entirely from relational DB layer
  return await documentRepository.deleteById(id);
};