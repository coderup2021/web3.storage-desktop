import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Upload = () => {
  const [disabled, setDisabled] = useState(false);

  const openDialog = useCallback(async () => {
    setDisabled(true);
    const filePaths = await window.electron.ipcRenderer.invoke(
      'openDialog',
      null
    );
    console.log('filePaths', filePaths);
    setDisabled(false);
  }, []);

  return (
    <Button onClick={openDialog} disabled={disabled}>
      <PlusOutlined />
    </Button>
  );
};
export default Upload;
