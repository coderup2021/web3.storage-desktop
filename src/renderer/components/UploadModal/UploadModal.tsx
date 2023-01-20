import { FolderOpenOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Checkbox,
  Row,
  Space,
  Upload,
  Modal,
  UploadProps,
  message,
} from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { FC, PropsWithChildren, useState, useCallback } from 'react';
import './_style.scss';
import { useNavigate } from 'react-router-dom';
import { sleep } from 'renderer/../util';
import bgImg from 'renderer/images/holographic-background.png';
import worldSvg from './world.svg';
import linkSvg from './link.svg';

interface UploadModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadModal: FC<PropsWithChildren<UploadModalProps>> = ({
  open,
  setOpen,
}) => {
  const [agree, setAgree] = useState(true);
  const navigate = useNavigate();
  let loading = false; //解决上传多个文件的时候，会触发多次onChange事件的bug
  const props: UploadProps = {
    multiple: true,
    beforeUpload() {
      return false;
    },
    onChange: useCallback(
      async (info: UploadChangeParam<UploadFile<any>>) => {
        if (loading) return;
        loading = true;
        const paths = info.fileList.map((file) => file.originFileObj!.path);
        try {
          await window.electron.ipcRenderer.invoke('uploadFiles', paths);
          message.success('uploading is start...');
          await sleep(1000);
          loading = false;
          setOpen(false);
          navigate('/upload');
        } catch (error) {
          loading = false;
          message.error(error as string);
        } finally {
        }
      },
      [loading]
    ),
  };
  return (
    <Modal
      open={open}
      footer={false}
      width={800}
      zIndex={1}
      className="upload-modal"
      onCancel={() => setOpen(false)}
    >
      <Ele />
      <Space size="large" direction="vertical">
        <Space
          direction="vertical"
          align="center"
          style={{ width: '100%' }}
          size={'large'}
          className="up-area"
        >
          <h1>Upload a file</h1>
          <Checkbox
            value={agree}
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          >
            I have read and agree to the web3.storage Terms of Service
          </Checkbox>

          <Upload.Dragger
            showUploadList={false}
            disabled={!agree}
            className="upload-box"
            {...props}
          >
            <p className="ant-upload-drag-icon">
              <FolderOpenOutlined style={{ color: '#03040a' }} />
            </p>
            <p className="upload-content">Drag and drop your files here</p>
          </Upload.Dragger>
        </Space>
        <Space className="down-area" direction="vertical" size="large">
          <Space direction="vertical">
            <h2>
              <img src={worldSvg} alt="world" />
              Public Data{' '}
            </h2>
            <div className="description">
              All data uploaded to web3.storage is available to anyone who
              requests it using the correct CID. Do not store any private or
              sensitive information in an unencrypted form using web3.storage.
            </div>
          </Space>
          <Space direction="vertical">
            <h2>
              <img src={linkSvg} alt="link" />
              Permanent Data
            </h2>
            <div className="description">
              Deleting files from the web3.storage site’s Files page will remove
              them from the file listing for your account, but that doesn’t
              prevent nodes on the decentralized storage network from retaining
              copies of the data indefinitely. Do not use web3.storage for data
              that may need to be permanently deleted in the future.
            </div>
          </Space>
        </Space>
      </Space>
    </Modal>
  );
};

const Ele = () => {
  return (
    <div className="file-uploader-container">
      <div className="background-view-wrapper">
        <div className="gradient-background-component upload-cta-gradient">
          <div className="saturated-variant">
            <span
              style={{
                boxSizing: 'border-box',
                display: 'block',
                overflow: 'hidden',
                width: 'initial',
                height: 'initial',
                background: 'none',
                opacity: 1,
                border: 0,
                margin: 0,
                padding: 0,
                position: 'absolute',
                inset: 0,
              }}
            >
              <img
                alt="gradient-background"
                sizes="100vw"
                src={bgImg}
                decoding="async"
                data-nimg="fill"
                className="image-full-width"
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxSizing: 'border-box',
                  padding: 0,
                  border: 'none',
                  margin: 'auto',
                  display: 'block',
                  width: 0,
                  height: 0,
                  minWidth: '100%',
                  maxWidth: '100%',
                  minHeight: '100%',
                  maxHeight: '100%',
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UploadModal;
