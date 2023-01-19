import { useCallback } from 'react';
import { To, useNavigate } from 'react-router-dom';
import FileList from 'renderer/components/FileList/FileList';

const Home = () => {
  const navigator = useNavigate();
  const goToUploadPage = useCallback(() => {
    navigator('upload' as To);
  }, []);
  return <FileList />;
};
export default Home;
