import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Button } from 'antd';

const Hello = () => {
  const onClick = async () => {
    const res = window.electron.store.set('foo', 'bar');
    console.log('res', res);
    console.log(window.electron.store.get('foo'));
  };
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <Button type="primary">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </Button>
        </a>
        <Button type="primary" onClick={onClick}>
          <span role="img" aria-label="folded hands">
            🙏
          </span>
          Donate
        </Button>
      </div>
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
