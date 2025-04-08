import * as React from 'react';
import { cn } from '../../utils';
import darkIcon from '../assets/icon/black/black_logo.svg';
import lightIcon from '../assets/icon/white/white_logo@0.5x.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface HeaderProps{
  className?: string;
  children?: React.ReactNode[];
}

export const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  const Mode = useSelector((state: RootState) => state.Mode.value);

  return (
    <header
      className={cn(
        className ,
        'd-flex flex-row justify-content-start align-items-center h-8-vh  lts-2 bg-light'
      )}
      {...props}
    >
      <img src={Mode === 'dark' ? lightIcon : darkIcon } className='ms-3  w-60-px' alt='logo'></img>
      <h1 className="ms-1 mt-3 kanit-extralight">Modelab</h1>
      {children}
    </header>
  );
};
