import * as React from 'react';
import { Header } from '../components/Header';
import { Footer, MessageWrapper } from '../components';

interface BaseProps {
  children?: React.ReactNode;
  bordered: boolean;
}

export const BaseLayout: React.FC<BaseProps> = ({ children, bordered = true }) => {
  return (
    <>
      <Header className={'h-8-vh ' + (bordered ? 'bordered-h icon-rel' : 'w-100')} />
      <div className="h-86-vh w-100">{children}</div>
      <Footer className={'h-6-vh ' + (bordered ? 'bordered-f' : 'w-100')} />
      <MessageWrapper />
    </>
  );
};
