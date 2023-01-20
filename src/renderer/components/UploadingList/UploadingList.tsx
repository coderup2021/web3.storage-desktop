import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Progress, Table, Tooltip } from 'antd';
import { optimizeSizeUnit } from 'renderer/utils';
import { ColumnType } from 'antd/es/table';
import './_style.scss';
import { useQuery, useQueryClient } from 'react-query';
import { UploadStatus } from 'main/type';
import { UploadingItem } from 'main/w3Service';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import UploadModal from '../UploadModal/UploadModal';

const UploadingList = () => {
  const [dataSource, setDataSource] = useState<UploadingItem[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const showUpload = useCallback(() => {
    setUploadOpen(true);
  }, []);
  const dataLenRef = useRef<number>(0);
  const queryClient = useQueryClient();

  const { data, isSuccess, isError } = useQuery(
    'uploadingList',
    () => {
      return window.electron.ipcRenderer.invoke('uploadingList', null);
    },
    { refetchInterval: 1000 }
  );
  useEffect(() => {
    if (isSuccess) {
      if (dataLenRef.current !== data.length) {
        dataLenRef.current = data.length;
        queryClient.invalidateQueries('fileList');
        queryClient.resetQueries('fileList');
      }
      setDataSource(data);
    }
  }, [data, isSuccess]);

  const columns: ColumnType<UploadingItem>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (text: number) => {
        return optimizeSizeUnit(text);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: UploadingItem) => {
        return text === UploadStatus.COMPLETE ? (
          'Finish'
        ) : text === UploadStatus.READY ? (
          'Waiting'
        ) : text === UploadStatus.UPLOADING ? (
          'Uploading'
        ) : text === UploadStatus.FAIL ? (
          <Tooltip title={record.failReason}>
            Fail <InfoCircleOutlined />
          </Tooltip>
        ) : (
          ''
        );
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (text: number) => {
        return <Progress percent={Number((text * 100).toFixed(2))} />;
        // `${Number(text.toFixed(2)) * 100}%`;
      },
    },
  ];

  return (
    <>
      <UploadModal open={uploadOpen} setOpen={setUploadOpen} />
      <div className="uploading-list-page">
        <h1>Uploading List</h1>
        <div className="list-wrapper">
          <div className="file-list-header">
            <span className="title">Uploading List</span>
            <Button onClick={showUpload}>
              Upload
              <PlusOutlined />
            </Button>
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            style={{ width: '100%' }}
            pagination={false}
            rowKey={(row: UploadingItem) => row.uuid}
            id="w3-table-list"
          />
        </div>
      </div>
    </>
  );
};
export default UploadingList;
