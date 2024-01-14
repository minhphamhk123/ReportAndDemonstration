import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { debounce } from 'lodash';

import { Col, Drawer, Row, Button, Input, Table, Tooltip } from 'antd';
const { Search } = Input;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Last Modified Date',
    dataIndex: 'modifiedTime',
    key: 'modifiedTime',
    render: (text) => <span>{moment(text).format('Do MMM YYYY HH:mm A')}</span>,
  },
  {
    title: 'Action',
    key: 'id',
    dataIndex: 'id',
    render: (tag) => (
      <span>
        <Tooltip title="View Document">
          <Button type="primary" ghost onClick={() => openDoc(tag)} key={tag}>
            Select
          </Button>
        </Tooltip>
      </span>
    ),
  },
];

const openDoc = async (tag) => {
  const responseBatch = await fetch('http://localhost:8080/createDocumentWithContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: sessionStorage.getItem("TOKEN_GG"), documentId: sessionStorage.getItem("DOCS_EDIT")}),
  });

  if (!responseBatch.ok) {
    throw new Error('Failed to batch document with content');
  }

  const responseDataBatch = await responseBatch.json();

  console.log('Batch document with content:', responseDataBatch);
  console.log(tag);
}

const ListDocuments = ({ visible, onClose, documents = [], onSearch, isLoading }) => {
  const search = (value) => {
    delayedQuery(`name contains '${value}'`);
  };

  const delayedQuery = useCallback(
    debounce((q) => onSearch(q), 500),
    []
  );

  // useEffect to trigger onSearch when the component is mounted
  useEffect(() => {
    // Initial search query, you can customize this based on your requirements
    onSearch()
  }, []);

  return (
    <Drawer
      title="Select Google Drive Document"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      width={900}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ marginBottom: 20 }}>
            {/* <p>Signed In as: {`${signedInUser?.Ad} (${signedInUser?.zu})`}</p>
            <Button type="primary" onClick={onSignOut}>
              Sign Out
            </Button> */}
          </div>

          <div className="table-card-actions-container">
            <div className="table-search-container">
              <Search
                placeholder="Search Google Drive"
                onChange={(e) => search(e.target.value)}
                onSearch={(value) => search(value)}
                className="table-search-input"
                size="large"
                enterButton
              />
            </div>
          </div>
          <Table
            className="table-striped-rows"
            columns={columns}
            dataSource={documents}
            pagination={{ simple: true }}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default ListDocuments;