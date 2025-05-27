export const UPLOAD_MAP_QUEUE_TOKEN = 'upload-map';

export enum MapUploadStatus {
	PENDING = 'PENDING',
	DECOMPRESSION = 'DECOMPRESSION',
	PROCESSING = 'PROCESSING',
	UPLOADING = 'UPLOADING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
}

export const cartographicSchema = process.env.DATABASE_CARTOGRAPHIC_SCHEMA || 'cartographic';
