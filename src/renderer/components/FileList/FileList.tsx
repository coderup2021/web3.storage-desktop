import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, message, Popover, Space } from 'antd';
import {
  CopyOutlined,
  RedoOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Table } from 'antd';
import { Upload } from 'web3.storage';
import { optimizeSizeUnit } from 'renderer/utils';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from 'react-query';
import { useWindowSize } from 'renderer/hooks/useWindowSize';
import { useNavigate } from 'react-router-dom';
import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import './_style.scss';
import UploadModal from '../UploadModal/UploadModal';

interface UploadExtra extends Upload {
  updated: string;
}
//prettier-ignore
const isEditStatus = (record: Upload, currEditCID: string) => record.cid === currEditCID;

const FileList = () => {
  const [dataSource, setDataSource] = useState<UploadExtra[]>([]);
  const [currEditCID, setCurrEditCID] = useState('');
  const [currName, setCurrName] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isSuccess, isError, isFetching } = useQuery<
    ApiData<UploadExtra[]>
  >(
    'fileList',
    async () => window.electron.ipcRenderer.invoke('fileList', null),
    {
      staleTime: Infinity,
    }
  );
  const baseLink = 'https://w3s.link/ipfs';
  useEffect(() => {
    if (isSuccess && data) {
      if (data?.error) {
        // console.log(data.error.message);
        message.error(data.error.message);
        setDataSource([]);
      } else {
        setDataSource(data.list);
      }
    }

    if (isError) message.error('get data error');
  }, [data, isSuccess, isError]);

  const copyToClipBoard = useCallback(async (cid: string) => {
    try {
      await window.electron.ipcRenderer.invoke('copyToClipBoard', cid);
      message.success('copy to clipboard success');
    } catch (error) {
      console.error('error', error);
    }
  }, []);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setCurrName(event.target.value);
    },
    []
  );

  const onNameIconClick = useCallback((item: UploadExtra) => {
    setCurrEditCID(item.cid);
    setCurrName(item.name);
  }, []);

  const onSaveClick = useCallback(async () => {
    await window.electron.ipcRenderer.invoke('renameFile', {
      name: currName,
      cid: currEditCID,
    });
  }, [currEditCID, currName]);

  const onCancelClick = useCallback(() => {
    setCurrEditCID('');
    setCurrName('');
  }, []);
  const [uploadOpen, setUploadOpen] = useState(false);
  const showUpload = useCallback(() => {
    setUploadOpen(true);
  }, []);
  //   const onAddSuccess = useCallback(() => {
  //     queryClient.invalidateQueries('tokens');
  //   }, [queryClient]);
  const refresh = useCallback(() => {
    console.log('refresh');
    queryClient.invalidateQueries('fileList');
  }, [queryClient]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof UploadExtra
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (
    dataIndex: keyof UploadExtra
  ): ColumnType<UploadExtra> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]!.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnType<UploadExtra>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'CID',
      dataIndex: 'cid',
      key: 'cid',
      render: (text: string) => (
        <span className="cid-wrapper">
          <span className="cid">
            <Popover title={text}>
              <a
                href={`${baseLink}/${text}`}
                target={'_blank'}
                className="hash-string"
              >
                {`${text.substring(0, 5)}.....${text.substring(
                  text.length - 8,
                  text.length
                )}`}
              </a>
            </Popover>
          </span>
          <span className="paste" onClick={() => copyToClipBoard(text)}>
            <CopyOutlined />
          </span>
        </span>
      ),
      ...getColumnSearchProps('cid'),
    },
    {
      title: 'Size',
      dataIndex: 'dagSize',
      key: 'size',
      render: (text: number) => {
        return optimizeSizeUnit(text);
      },
      sorter: (a: UploadExtra, b: UploadExtra) => a.dagSize - b.dagSize,
    },
    {
      title: 'Date',
      dataIndex: 'updated',
      key: 'updated',
      render(text: string) {
        return dayjs(text).format('YYYY/M/DD');
      },
      defaultSortOrder: 'descend',
      sorter: (a: UploadExtra, b: UploadExtra) =>
        dayjs(a.updated).valueOf() - dayjs(b.updated).valueOf(),
    },
  ];
  const [selectedCids, setSelectedCids] = useState<string[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Upload[]) => {
      setSelectedCids(selectedRowKeys as string[]);
    },
  };
  const { height } = useWindowSize();
  const DeleteSelectedFiles = useCallback(async () => {
    try {
      const res = await window.electron.ipcRenderer.invoke(
        'deleteFileList',
        selectedCids
      );
    } catch (errors) {}
  }, [selectedCids]);
  return (
    <>
      <UploadModal open={uploadOpen} setOpen={setUploadOpen} />
      <div className="file-list-page">
        <h1>Files</h1>
        <div className="file-list-wrapper">
          <div className="file-list-header">
            <span className="title">Files</span>
            <span className="other">
              <span onClick={showUpload} className={'upload-icon-wrapper'}>
                Upload
                <PlusOutlined />
              </span>
              <span onClick={refresh}>
                Refresh
                <RedoOutlined />
              </span>
            </span>
          </div>
          <Table
            size="small"
            bordered={false}
            //   rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            style={{ width: '100%', height: 'calc(100% - 60px)' }}
            pagination={{
              hideOnSinglePage: false,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 40, 100, 200],
            }}
            scroll={{ y: height - 160 - 192 - 26 }}
            rowKey={(row) => row.cid}
            id="w3-table-list"
            loading={isFetching}
          />
          <footer
            className="file-list-footer"
            style={{
              display: 'none' /*(web3.storage).delete not implemented yet*/,
            }}
          >
            <div
              className="left"
              style={{
                display: 'none' /*(web3.storage).delete not implemented yet*/,
              }}
            >
              <Button
                type="default"
                disabled={selectedCids.length === 0}
                onClick={DeleteSelectedFiles}
              >
                Delete Selected
              </Button>
            </div>
            <div className="right"></div>
          </footer>
        </div>
      </div>
    </>
  );
};
export default FileList;
