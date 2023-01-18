import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, message, Popover } from 'antd';
import { EditOutlined, CopyOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { Upload } from 'web3.storage';
import { optimizeSizeUnit } from 'renderer/utils';
import { ColumnProps, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import './_style.scss';

//prettier-ignore
const isEditStatus = (record: Upload, currEditCID: string) => record.cid === currEditCID;

const FileList = () => {
  const [disabled, setDisabled] = useState(false);
  const [dataSource, setDataSource] = useState<Upload[]>([]);
  const [currEditCID, setCurrEditCID] = useState('');
  const [currName, setCurrName] = useState('');

  const baseLink = 'https://w3s.link/ipfs';
  useEffect(() => {
    const getList = async () => {
      const list: Upload[] = await window.electron.ipcRenderer.invoke(
        'fileList',
        null
      );
      setDataSource(list);
    };
    getList();
  }, []);

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

  const onNameIconClick = useCallback((item: Upload) => {
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

  const columns: ColumnType<Upload>[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      /** edit name is not supported due to authorization Bearer token */
      render(text: string, record: Upload) {
        return isEditStatus(record, currEditCID) ? (
          <span className="input-wrapper">
            <Input value={currName} onChange={onNameChange} />
            <span className="right">
              <Button size="small" type={'primary'} onClick={onSaveClick}>
                Save
              </Button>
              <Button size="small" type={'default'} onClick={onCancelClick}>
                Cancel
              </Button>
            </span>
          </span>
        ) : (
          <span className="name-wrapper">
            <span className="text-wrapper">{text}</span>
            <span
              className="icon-wrpper"
              onClick={() => onNameIconClick(record)}
            >
              <EditOutlined />
            </span>
          </span>
        );
      },
    },
    {
      title: 'CID',
      dataIndex: 'cid',
      key: 'cid',
      render: (text: string) => (
        <span className="cid-wrapper">
          <span className="cid">
            <Popover title={text}>
              <a href={`${baseLink}/${text}`} target={'_blank'}>
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
    },
    {
      title: 'Size',
      dataIndex: 'dagSize',
      key: 'size',
      render: (text: number) => {
        return optimizeSizeUnit(text);
      },
    },
    {
      title: 'Date',
      dataIndex: 'updated',
      key: 'updated',
      render(text: string) {
        return dayjs(text).format('YYYY/M/DD');
      },
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      style={{ width: '100%' }}
      pagination={false}
      rowKey={(row) => row.cid}
    />
  );
};
export default FileList;
