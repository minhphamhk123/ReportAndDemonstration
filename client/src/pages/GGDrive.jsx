import React, { useEffect, useState } from "react";
import { gapi } from 'gapi-script'
import { style } from '../styles/DriveStyle';
import styled from 'styled-components';
import { Row, Col, Spin } from 'antd';
import ListDocuments from './ListDocuments';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata';


const NewDocumentWrapper = styled.div`
  ${style}
`;

function GGDrive() {
  const [listDocumentsVisible, setListDocumentsVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [signedInUser, setSignedInUser] = useState();
  const handleChange = (file) => {};

  /**
   * Print files.
   */
  const listFiles = async (searchTerm = null) => {
    setIsFetchingGoogleDriveFiles(true);
  
    const accessToken = sessionStorage.getItem("TOKEN_GG")
    const apiUrl = 'https://www.googleapis.com/drive/v3/files';
    //?pageSize=10&fields=nextPageToken,files(id,name,mimeType,modifiedTime)&q=${searchTerm}
    var test = '';
    if(searchTerm) {test = `&q=${searchTerm}`}
    try {
      const response = await fetch(`${apiUrl}?pageSize=10&fields=nextPageToken,files(id,name,mimeType,modifiedTime)${test}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch Google Drive files');
      }
  
      const data = await response.json();
      console.log("All files drive: ", data)
      setIsFetchingGoogleDriveFiles(false);
      setListDocumentsVisibility(true);
      setDocuments(data.files);
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
      setIsFetchingGoogleDriveFiles(false);
    }
  };
  
  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */

  const showDocuments = () => {
    setListDocumentsVisibility(true);
    console.log("showDocuments")
  };

  const onClose = () => {
    setListDocumentsVisibility(false);
  };

  return (
    <NewDocumentWrapper>
        <ListDocuments
          visible={listDocumentsVisible}
          onClose={onClose}
          documents={documents}
          onSearch={listFiles}
          // signedInUser={signedInUser}
          // onSignOut={handleSignOutClick}
          isLoading={isFetchingGoogleDriveFiles}
        />
          <Spin spinning={isLoadingGoogleDriveApi}>
            <div onClick={showDocuments} className="source-container">
              <div className="icon-container">
                <div className="icon icon-success">
                  <img height="30" width="30" src="/google-drive.png" />
                </div>
              </div>
            </div>
          </Spin>
    </NewDocumentWrapper>
  );
};

export default GGDrive;