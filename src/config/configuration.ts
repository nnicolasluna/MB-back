import * as process from 'process';

export async function configuration() {
	return {
		NODE_ENV: process.env.NODE_ENV,
		// captchaPublic: process.env.CATPACHA_GOOGLE_PUBLIC_KEY,
		// captchaPrivate: process.env.CATPACHA_GOOGLE_PRIVATE_KEY,
		geoserver: {
			url: process.env.GEOSERVER_URL,
			workspace: process.env.GEOSERVER_WORKSPACE,
			username: process.env.GEOSERVER_USERNAME,
			password: process.env.GEOSERVER_PASSWORD,
		},
		database: {
			host: process.env.DATABASE_HOST,
			name: process.env.DATABASE_NAME,
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			port: process.env.DATABASE_PORT,
			url: process.env.DATABASE_URL,
		},
		jwt: {
			secret: process.env.JWT_SECRET,
			expiresIn: process.env.JWT_EXPIRES_IN,
			refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
			expiresEmailIn: process.env.JWT_EXPIRES_IN_EMAIL,
		},
		redis: {
			host: process.env.REDIS_HOST || 'localhost',
			port: process.env.REDIS_PORT || 6379,
		},
		email: {
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT),
			user: process.env.EMAIL_USER,
			password: process.env.EMAIL_PASS,
			from: process.env.EMAIL_FROM,
			ssl: process.env.EMAIL_SSL === 'true' ? true : false,
			tls: process.env.EMAIL_TLS === 'true' ? true : false,
		},
		port: parseInt(process.env.PORT, 10) || 3000,
		uploadMaxFileSize: process.env.UPLOAD_MAX_FILE_SIZE,
		useSystemAccessPermission: process.env.USE_SYSTEM_ACCESS_PERMISSION === 'true',
		urlClient: process.env.URL_CLIENT,
	};
}
