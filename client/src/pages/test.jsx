import '../styles/test.css';
import '../components/page-transition-mgmt'
import React, { useEffect } from 'react';
const { google } = require('googleapis');

const test = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.REACT_APP_GOOGLE_CLIENT_ID,
    process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    process.env.REACT_APP_REDIRECT_URL
  );

  const drive = google.drive({
    version: 'v2',
    auth: oauth2Client
  });
  
  async function sendPlainTextToGGDrive(params) {
    const res = await drive.files.create({
      requestBody: {
        name: 'Test',
        mimeType: 'text/plain'
      },
      media: {
        mimeType: 'text/plain',
        body: 'Hello World'
      }
    });
    console.log("data: ", res)
  }


  return (
    <div>
      <button onClick={sendPlainTextToGGDrive}>test</button>
    </div>
  );
};

export default test;
