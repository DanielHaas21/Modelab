import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';
import { Image } from '../../types/Image';

interface ModelDetailProps {
  children?: React.ReactNode;
  image?: Image;
  bordered: boolean;
}

export const ModelDetailLayout: React.FC<ModelDetailProps> = ({ children, bordered = true }) => {
  return (
    <>
      <Header className={bordered ? 'bordered-h' : 'w-100'}></Header>
      {children}
      <Footer className={bordered ? 'bordered-f' : 'w-100'}></Footer>
    </>
  );
};
