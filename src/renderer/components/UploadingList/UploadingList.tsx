import { useEffect, useState } from 'react';
import { Progress, Table, Tooltip } from 'antd';
import { Upload } from 'web3.storage';
import { optimizeSizeUnit } from 'renderer/utils';
import { ColumnType } from 'antd/es/table';
import './_style.scss';
import { useQuery } from 'react-query';
import { UploadStatus } from 'main/type';
import { UploadingItem } from 'main/w3Service';
import { InfoCircleOutlined } from '@ant-design/icons';

//prettier-ignore
const isEditStatus = (record: Upload, currEditCID: string) => record.cid === currEditCID;

const UploadingList = () => {
  const [dataSource, setDataSource] = useState<UploadingItem[]>([]);

  const { data, isSuccess, isError } = useQuery(
    'uploadingList',
    () => {
      return window.electron.ipcRenderer.invoke('uploadingList', null);
    },
    { refetchInterval: 1000 }
  );
  useEffect(() => {
    if (isSuccess) {
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
    <Table
      dataSource={dataSource}
      columns={columns}
      style={{ width: '100%' }}
      pagination={false}
      rowKey={(row: UploadingItem) => row.uuid}
    />
  );
};
export default UploadingList;
