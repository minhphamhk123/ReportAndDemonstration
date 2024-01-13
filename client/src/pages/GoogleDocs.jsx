import React from 'react';
import '../styles/GoogleDocs.css';

const GoogleDocsPage = () => {

  return (
    <div className="container">
      <iframe
        title="Google Docs Editor"
        src="https://docs.google.com/document/d/1KHexw85b7oB0QY8-hr8Kann_xWhnxXJv/edit#heading=h.gjdgxs"
        className="google-docs-iframe"
      />
    </div>
  );
};

export default GoogleDocsPage;
