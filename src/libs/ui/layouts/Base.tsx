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
      <Header className={'h-[8vh] ' + (bordered ? 'border-b border-ui-border relative' : 'w-full')} />
      <div className="h-[86vh] w-full overflow-hidden">{children}</div>
      <Footer className={'h-[6vh] ' + (bordered ? 'border-t border-ui-border' : 'w-full')} />
      <MessageWrapper />
    </>
  );
};
