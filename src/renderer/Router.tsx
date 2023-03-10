import { Routes, HashRouter, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import TokenManage from './pages/TokenManage/TokenManage';
import Uploader from 'renderer/pages/UploadList/UploadList';

const Web3Router = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Home />} />
      <Route path={'/token'} element={<TokenManage />} />
      <Route path={'/upload'} element={<Uploader />} />
    </Routes>
  );
};
export default Web3Router;
