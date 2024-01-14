import React, { useEffect, useState } from "react";
import { Table, Spin, Space } from 'antd';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Navigate, useNavigate } from "react-router-dom";

const DriveContainer = styled.div`
  padding: 20px;
`;

const DriveTitle = styled.h1`
  margin-bottom: 20px;
`;

function Test() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState(null);

  const listFiles = async (searchTerm = null, page, pageToken) => {
    setIsFetchingGoogleDriveFiles(true);

    const accessToken = sessionStorage.getItem('TOKEN_GG');
    const apiUrl = 'https://www.googleapis.com/drive/v3/files';
    let q = "mimeType='application/vnd.google-apps.document'";
    var stringURL = '';
    if(pageToken) { stringURL = `&pageToken=${pageToken}`}
    try {
      const response = await fetch(`${apiUrl}?pageSize=20&q=${q}&fields=nextPageToken,files(id,name,mimeType,modifiedTime,parents)${stringURL}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Google Drive files');
      }

      const data = await response.json();
      console.log('All files drive: ', data);
      setIsFetchingGoogleDriveFiles(false);
      setNextPageToken(data.nextPageToken);
      setCurrentPage(page);
      setFiles((prevFiles) => [...prevFiles, ...data.files]);
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
      setIsFetchingGoogleDriveFiles(false);
    }
  };

  useEffect(() => {
    // Call the listFiles function to load initial data
    listFiles();
  }, []); // The empty dependency array means this useEffect will run once when the component mounts

  const handleTableChange = (pagination, filters, sorter) => {
    // Triggers when changing page
    if (pagination.current !== currentPage && pagination.total === pagination.pageSize * pagination.current) {
      listFiles(null, pagination.current, nextPageToken);
    }
  };

  const handleRowClick = (record) => {
    // Xử lý khi click vào một dòng trong bảng
    setSelectedDocumentID(record.id); // Lưu trữ documentID đã chọn
    console.log(record.id);
    sessionStorage.setItem("DOCS_EDIT",record.id );
    navigate('/docs-edit');
  };

  return (
    <DriveContainer>
      <DriveTitle>Google Drive Explorer</DriveTitle>
      <Spin spinning={isFetchingGoogleDriveFiles}>
        <Table
          dataSource={files}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text, record) => (
                <Space onClick={() => handleRowClick(record)}>
                  {record.mimeType === 'application/vnd.google-apps.folder' ? (
                    <FolderOutlined style={{ fontSize: '24px' }} />
                  ) : (
                    <FileOutlined style={{ fontSize: '24px' }} />
                  )}
                  {text}
                </Space>
              ),
            },
            {
              title: 'Modified Time',
              dataIndex: 'modifiedTime',
              key: 'modifiedTime',
            },
          ]}
          pagination={{
            pageSize: 10,
            total: files.length,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
        />
      </Spin>
    </DriveContainer>
  );
}

export default Test;
