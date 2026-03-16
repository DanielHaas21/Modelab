import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';

interface BaseProps {
  children?: React.ReactNode;
  bordered: boolean;
}

/**
 * A simple layout component that renders a header, a footer and a main section. 
 */
export const BaseLayout: React.FC<BaseProps> = ({ children, bordered = true }) => {
  return (
    <>
      <Header className={'h-[8vh] ' + (bordered ? 'border-b border-ui-border relative' : 'w-full')} />
      <div className="h-[86vh] w-full overflow-hidden">{children}</div>
      <Footer className={'h-[6vh]'} variant={bordered ? 'bordered' : 'borderless'} />
    </>
  );
};
