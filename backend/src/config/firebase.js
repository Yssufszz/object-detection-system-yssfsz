const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');

const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

let bucket = null;
if (process.env.CLOUD_STORAGE_BUCKET) {
  const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  bucket = storage.bucket(process.env.CLOUD_STORAGE_BUCKET);
}

module.exports = {
  firestore,
  bucket
};