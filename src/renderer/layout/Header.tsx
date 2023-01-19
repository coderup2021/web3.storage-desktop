import { Row } from 'antd';
import Logo from 'renderer/components/Logo/Logo';
import Web3Menu from './Web3Menu';

const Header = () => {
  return (
    <Row className="header">
      <Logo />
      <Web3Menu />
    </Row>
  );
};
export default Header;
