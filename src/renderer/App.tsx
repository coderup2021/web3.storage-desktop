import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Button } from 'antd';
import ApiToken from './components/ApiToken/ApiToken';

const Hello = () => {
  const onClick = async () => {
    const res = window.electron.store.set('foo', 'bar');
    console.log('res', res);
    console.log(window.electron.store.get('foo'));
  };
  return (
    <div>
      <ApiToken />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
