import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
import './style.scss';
import TokenForm from './TokenForm';
import { formateHash } from '../../../util';

const ApiToken: FC = () => {
  const [open, setOpen] = useState(false);
  const [refreshTokens, setRefreshTokens] = useState(false);
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [currToken, setCurrToken] = useState('');

  const onAddSuccess = useCallback(() => {
    setRefreshTokens((_) => !_);
  }, []);

  const onAdd = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const tokens = window.electron.store.get('tokens') || [];
    setTokenList(tokens);
  }, [refreshTokens]);

  useEffect(() => {
    setCurrToken(window.electron.store.get('currToken') || '');
  }, []);

  const onTokenChange = useCallback((value: string) => {
    window.electron.store.set('currToken', value);
    setCurrToken(window.electron.store.get('currToken') || '');
  }, []);

  const onDelete = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    token: Token
  ) => {
    event.stopPropagation();
    const tokens: Token[] = window.electron.store.get('tokens') || [];
    window.electron.store.set(
      'tokens',
      tokens.filter((t) => t.hash !== token.hash)
    );
    setRefreshTokens((_) => !_);
  };
  return (
    <>
      <span>Token:</span>
      <Select
        className="token-select"
        onChange={onTokenChange}
        value={currToken}
        placeholder={
          tokenList.length < 1
            ? 'please add a token at first'
            : 'Please select a token'
        }
      >
        {tokenList.map((token) => (
          <Option
            key={token.hash}
            value={token.hash}
            className={'token-option'}
          >
            <span className="left">
              {`${formateHash(token.hash)}  ${token.comment}`}{' '}
            </span>
            <span onClickCapture={(e) => onDelete(e, token)} className="right">
              <CloseOutlined />
            </span>
          </Option>
        ))}
      </Select>
      <Button onClick={onAdd}>+</Button>
      <TokenForm open={open} setOpen={setOpen} onAddSuccess={onAddSuccess} />
    </>
  );
};
ApiToken.displayName = 'ApiToken';
export default ApiToken;
