import React from 'react';
import '../styles/GoogleDocs.css';
import { Button } from 'antd';
import { GoogleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import GGDrive from './GGDrive';


const GoogleDocsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container_GG_docs">
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => {navigate("/test")}}>

        </Button>
        <GGDrive/>
      </div>
      <iframe
        title="Google Docs Editor"
        src={`https://docs.google.com/document/d/${sessionStorage.getItem("DOCS_EDIT")}`}
        className="google-docs-iframe"
      />
    </div>
  );
};

export default GoogleDocsPage;
