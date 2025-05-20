const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const splitFile = require('split-file');

const { notion } = require('../shared');
const { log } = require('../shared/utils');

const NOTION_FILE_UPLOAD_URL = 'https://api.notion.com/v1/file_uploads';
const PART_SIZE = 10 * 1024 * 1024; // 10MB chunks for multi-part upload
const SINGLE_PART_LIMIT = 20 * 1024 * 1024; // 20MB limit for single-part upload
const MAX_PARTS = 1000;

const NOTION_HEADERS = {
  Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
  'Notion-Version': '2022-06-28',
};

const JSON_HEADERS = {
  ...NOTION_HEADERS,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function createFileUpload(options = { mode: 'single_part' }) {
  try {
    const response = await axios({
      method: 'POST',
      url: NOTION_FILE_UPLOAD_URL,
      headers: JSON_HEADERS,
      data: options,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating file upload:', error);
    throw error;
  }
}

async function attachFileToProperty(upload, page, property = 'File', name = null) {
  const properties = {
    [property]: {
      type: 'files',
      files: [
        {
          type: 'file_upload',
          file_upload: {
            id: upload.id,
          },
          ...(name && { name }),
        },
      ],
    },
  };

  return await notion.pages.update({
    page_id: page.id,
    properties,
  });
}

async function attachFileToPage(upload, page, name = null, afterBlockId = null) {
  const contentType = getContentType(upload.filename);
  const blockType = getNotionBlockType(contentType);

  try {
    const children = [
      {
        type: blockType,
        [blockType]: {
          type: 'file_upload',
          file_upload: { id: upload.id },
          ...(name && { name }),
        },
      },
    ];

    const response = await notion.blocks.children.append({
      block_id: page.id,
      children,
      ...(afterBlockId && { after: afterBlockId }),
    });

    return response;
  } catch (error) {
    console.error('Error adding file block:', error);
    throw error;
  }
}

async function attachFileAsCover(upload, page) {
  return await notion.pages.update({
    page_id: page.id,
    cover: {
      type: 'file_upload',
      file_upload: {
        id: upload.id,
      },
    },
  });
}

async function uploadFileAttachment(filePath, page, property = 'File', name = null) {
  const { upload } = await uploadFile(filePath);
  await attachFileToProperty(upload, page, property, name);
  return upload;
}

async function uploadFileBlock(filePath, page) {
  const { upload } = await uploadFile(filePath);
  await attachFileToPage(upload, page);
  return upload;
}

async function uploadCoverImage(filePath, page) {
  const { upload } = await uploadFile(filePath);
  await attachFileAsCover(upload, page);
  return upload;
}

async function getFileSize(filePath) {
  const stats = await fs.promises.stat(filePath);
  return stats.size;
}

async function uploadPart(fileId, partBuffer, partNumber = null) {
  const formData = new FormData();
  formData.append('file', partBuffer);

  if (partNumber) {
    console.log('uploading part', partNumber);
    formData.append('part_number', partNumber.toString());
  }

  const response = await axios({
    method: 'POST',
    url: `${NOTION_FILE_UPLOAD_URL}/${fileId}/send`,
    data: formData,
    headers: {
      ...NOTION_HEADERS,
      'Content-Type': 'multipart/form-data',
    },
    ...(!partNumber && { maxContentLength: SINGLE_PART_LIMIT }),
  });

  return response.data;
}

async function completeMultiPartUpload(fileId) {
  console.log('completing upload');

  const response = await axios({
    method: 'POST',
    url: `${NOTION_FILE_UPLOAD_URL}/${fileId}/complete`,
    headers: JSON_HEADERS,
  });

  return response.data;
}

async function uploadFile(filePath, fileName = path.basename(filePath)) {
  const fileSize = await getFileSize(filePath);
  const needsMultiPart = fileSize > SINGLE_PART_LIMIT;

  const contentType = getContentType(fileName);

  if (!contentType) {
    throw new Error(`Unsupported file type: ${fileName}`);
  }

  let file,
    upload,
    parts = [];

  try {
    if (needsMultiPart) {
      parts = await splitFile.splitFileBySize(filePath, PART_SIZE);

      if (parts.length > MAX_PARTS) {
        throw new Error(`File is too large. Maximum number of parts is ${MAX_PARTS}.`);
      }

      // Create multi-part upload
      file = await createFileUpload({
        mode: 'multi_part',
        number_of_parts: parts.length,
        filename: fileName,
        content_type: contentType,
      });

      for (let i = 1; i <= parts.length; i++) {
        const fileStream = fs.createReadStream(parts[i - 1]);
        upload = await uploadPart(file.id, fileStream, i);
      }

      // Complete the upload
      upload = await completeMultiPartUpload(file.id);
    } else {
      // Single-part upload
      const fileStream = fs.createReadStream(filePath);
      file = await createFileUpload();
      upload = await uploadPart(file.id, fileStream);
    }

    return { file, upload };
  } catch (error) {
    if (error.response) {
      console.error('Upload error response:', error.response.data);
      throw new Error(`Upload failed with status: ${error.response.status}`);
    }
    throw error;
  } finally {
    // Clean up temporary files
    for (const part of parts) {
      await fs.promises.unlink(part);
    }
  }
}

const mimeGroups = {
  audio: {
    '.aac': 'audio/aac',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.wma': 'audio/x-ms-wma',
  },
  file: {
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
  },
  image: {
    '.gif': 'image/gif',
    '.heic': 'image/heic',
    '.ico': 'image/vnd.microsoft.icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.webp': 'image/webp',
  },
  video: {
    '.amv': 'video/x-amv',
    '.asf': 'video/x-ms-asf',
    '.avi': 'video/x-msvideo',
    '.f4v': 'video/x-f4v',
    '.flv': 'video/x-flv',
    '.gifv': 'video/mp4',
    '.m4v': 'video/mp4',
    '.mkv': 'video/webm',
    '.mov': 'video/quicktime',
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.qt': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
  },
};

const extToMime = {};
const mimeToGroup = {};

for (const [group, extMap] of Object.entries(mimeGroups)) {
  for (const [ext, mime] of Object.entries(extMap)) {
    extToMime[ext] = mime;
    mimeToGroup[mime] = group;
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return extToMime[ext];
}

function getNotionBlockType(contentType) {
  return mimeToGroup[contentType] || 'file';
}

function getNotionBlockTypeFromFilename(filename) {
  return getNotionBlockType(getContentType(filename));
}

module.exports = {
  attachFileAsCover,
  attachFileToPage,
  attachFileToProperty,
  createFileUpload,
  getContentType,
  getNotionBlockType,
  getNotionBlockTypeFromFilename,
  uploadCoverImage,
  uploadFile,
  uploadFileAttachment,
  uploadFileBlock,
};
