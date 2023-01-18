import React, { FC, PropsWithChildren } from 'react';

const Main: FC<PropsWithChildren<{}>> = ({ children }) => {
  return <div className="w3-main">{children}</div>;
};
export default Main;
