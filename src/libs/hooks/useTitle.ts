import { useEffect } from 'react';
import { SITE_META } from '../../global/siteMeta';

export interface EmptyTitleVariant {
  type: 'empty';
}

export interface NameTitleVariant {
  type: 'name';
  name: string;
}

export type TitleVariant = EmptyTitleVariant | NameTitleVariant;

/**
 * Changes the site title
 */
export const useTitle = (variant: TitleVariant) => {
  useEffect(() => {
    let title: string = SITE_META.Name;
    switch (variant.type) {
      case 'empty':
        // empty
        break;
      case 'name':
        title = `${SITE_META.Name} - ${variant.name}`;
        break;
    }
    document.title = title;
  }, [variant]);
};