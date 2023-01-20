import { useCallback, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UploadingList from 'renderer/components/UploadingList/UploadingList';
import './_style.scss';

const Uploader = () => {
  return (
    <div className="uploader-container">
      <UploadingList />
    </div>
  );
};
export default Uploader;
