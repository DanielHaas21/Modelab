import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';

interface BaseProps {
  children?: React.ReactNode;
  bordered:boolean
}

export const BaseLayout: React.FC<BaseProps> = ({ children,bordered = true }) => {

  return (
    <>
      <Header className={bordered ? 'bordered-h' : 'w-100'}></Header>
      {children}
      <Footer className={bordered ? 'bordered-f' : 'w-100'}></Footer>
    </>
  );
};
