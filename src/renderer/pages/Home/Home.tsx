import { Button } from 'antd';
import { useCallback } from 'react';
import { To, useNavigate } from 'react-router-dom';
import FileList from 'renderer/components/FileList/FileList';

const Home = () => {
  const navigator = useNavigate();
  const goToUploadPage = useCallback(() => {
    navigator('upload' as To);
  }, []);
  return (
    <div>
      <Button onClick={goToUploadPage}>Upload</Button>
      <FileList />
    </div>
  );
};
export default Home;
