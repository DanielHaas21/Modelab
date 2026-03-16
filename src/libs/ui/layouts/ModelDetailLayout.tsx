import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils';
import { ModelDetailImageCarousel } from '../components/ModelDetailImageCarousel';
import { DetailFile } from '../../../middleware/types';

interface ModelDetailProps {
  children?: React.ReactNode;
  files?: DetailFile[] | null;
  bordered: boolean;
  buttons?: React.ReactNode;
}
/**
 *  Layout used for the model detail page, it renders a header, a footer, a main section with the model information and an aside section with the model images.
 */
export const ModelDetailLayout: React.FC<ModelDetailProps> = ({
  children,
  files = null,
  bordered = true,
  buttons,
}) => {
  const { isDesktop } = useResponsive();

  return (
    <>
      <Header className={'h-[8vh] ' + (bordered ? 'border-b border-ui-border' : 'w-full')} />
      <main className={cn("w-full h-[86vh] flex items-center overflow-hidden", isDesktop ? "px-32" : "px-4")}>
        <div className={cn("flex flex-col h-full py-10", isDesktop ? "w-1/2" : "w-full")}>
          <section className="flex flex-col grow overflow-y-auto custom-scrollbar pr-4">{children}</section>
          <section className="flex items-end justify-start w-full flex-wrap mb-8 mt-4">
            {buttons}
          </section>
        </div>
        {isDesktop && (
          <aside className={cn("flex flex-col items-center justify-center min-h-[70vh] overflow-hidden w-1/2 ml-10")}>
            <div className="w-full h-full overflow-hidden">
              <ModelDetailImageCarousel files={files ?? []} />
            </div>
          </aside>
        )}
      </main >
      <Footer className={'h-[6vh]'} variant={bordered ? 'bordered' : 'borderless'} />
    </>
  );
};
