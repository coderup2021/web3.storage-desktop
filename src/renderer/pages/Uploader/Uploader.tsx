import { useCallback, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UploadingList from 'renderer/components/UploadingList/UploadingList';
import './_style.scss';

const Uploader = () => {
  const [disabled, setDisabled] = useState(false);

  const openDialog = useCallback(async () => {
    setDisabled(true);
    const filePaths = await window.electron.ipcRenderer.invoke(
      'openDialog',
      null
    );
    if (filePaths) {
      uploadFile(filePaths);
    }
    setDisabled(false);
  }, []);

  const uploadFile = useCallback(async (filePaths: string[]) => {
    const res = await window.electron.ipcRenderer.invoke(
      'uploadFiles',
      filePaths
    );
  }, []);

  return (
    <div className="uploader-container">
      <Button size="large" onClick={openDialog} disabled={disabled}>
        <PlusOutlined />
      </Button>
      <UploadingList />
    </div>
  );
};
export default Uploader;
