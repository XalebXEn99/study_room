// Public service URLs only. Database and storage credentials stay on the backend.
window.studyRoomCloudConfig = {
  authUrl: "https://ep-long-haze-b966nzfz.neonauth.c-7.eu-central-1.aws.neon.tech/neondb/auth",
  apiUrl: "https://br-muddy-snow-b9tpdqfd-studyapi.compute.c-7.eu-central-1.aws.neon.tech/"
};
window.studyRoomCloudConfigured = Boolean(window.studyRoomCloudConfig.authUrl && window.studyRoomCloudConfig.apiUrl);
