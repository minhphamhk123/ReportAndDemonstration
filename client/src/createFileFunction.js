// createFileFunction.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const authorize = async (uid) => {
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  const { accessToken, refreshToken } = userDoc.data();

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  });

  return headers;
};

const createFile = async (headers) => {
  const metadata = {
    name: 'New Document',
    mimeType: 'application/vnd.google-apps.document',
  };

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(metadata),
  });

  const location = response.headers.get('Location');
  const fileId = location.split('/').pop();

  return fileId;
};

exports.createFile = functions.https.onCall(async (data, context) => {
  try {
    const { uid } = data;
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
    }

    const headers = await authorize(uid);
    const fileId = await createFile(headers);

    return { fileId };
  } catch (error) {
    console.error('Error creating file:', error);
    throw new functions.https.HttpsError('internal', 'Internal Server Error');
  }
});
