import { useCallback, useEffect, useState } from 'react';
import { Button, Progress, Table, Tooltip, message, Row, Col, Tag } from 'antd';
import { Upload } from 'web3.storage';
import { ColumnType } from 'antd/es/table';
import { useQuery, useQueryClient } from 'react-query';
import { formateHash } from '../../../util';
import './_style.scss';
import TokenForm from './TokenForm';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';

const ApiToken = () => {
  const [dataSource, setDataSource] = useState<Token[]>([]);
  const [currToken, setCurrToken] = useState('');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const onAdd = useCallback(() => {
    setOpen(true);
  }, []);

  const onAddSuccess = useCallback(() => {
    queryClient.invalidateQueries('tokens');
  }, [queryClient]);

  const { data, isSuccess, isError } = useQuery('tokens', () =>
    Promise.resolve(window.electron.store.get('tokens'))
  );

  useEffect(() => {
    if (isSuccess) {
      setDataSource(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    setCurrToken(window.electron.store.get('currToken'));
  }, []);

  const onTokenChange = useCallback((value: string) => {
    window.electron.store.set('currToken', value);
    setCurrToken(window.electron.store.get('currToken') || '');
    message.success('switch token success');
    queryClient.invalidateQueries('fileList');
    queryClient.resetQueries('fileList');
  }, []);

  const onDelete = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, token: Token) => {
      const tokens: Token[] = window.electron.store.get('tokens') || [];
      window.electron.store.set(
        'tokens',
        tokens.filter((t) => t.hash !== token.hash)
      );
      message.success('delete token success');
      queryClient.invalidateQueries('tokens');
    },
    [queryClient]
  );

  const columns: ColumnType<Token>[] = [
    {
      title: 'comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (text: string) => {
        return formateHash(text);
      },
    },
    {
      title: 'is Current',
      key: 'hash',
      render: (_: string, record: Token) => {
        return record.hash === currToken ? <CheckOutlined /> : null;
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text: string, record: Token) => (
        <>
          <Button
            onClick={(e) => onDelete(e, record)}
            style={{ marginRight: 10, color: '#fff' }}
          >
            Delete
          </Button>
          {currToken !== record.hash && (
            <Button
              onClick={() => onTokenChange(record.hash)}
              style={{ marginRight: 10, color: '#fff' }}
            >
              Set Current
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <TokenForm open={open} setOpen={setOpen} onAddSuccess={onAddSuccess} />
      <div className="token-list-page">
        <h1>Token Manage</h1>
        <div className="list-wrapper">
          <div className="token-list-header">
            <span className="title">Token Manage</span>
            <span>Current Token: {formateHash(currToken)}</span>
            <Button onClick={onAdd}>
              Add
              <PlusOutlined />
            </Button>
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            style={{ width: '100%' }}
            pagination={false}
            rowKey={(row: Token) => row.hash}
            id="w3-table-list"
          />
        </div>
      </div>
    </>
  );
};
export default ApiToken;
