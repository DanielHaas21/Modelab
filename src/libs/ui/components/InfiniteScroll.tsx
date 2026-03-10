import React from 'react';
import { cn } from '../../utils';

interface InfiniteScrollProps {
  children: React.ReactNode;
  className?: string;

  itemCount: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;

  loader: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  className,
  hasMore,
  loadMore,
  itemCount,
  loader,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastItemCount, setLastItemCount] = React.useState<number>(0);

  const scrollDivRef = React.useRef<HTMLDivElement>(null);

  const isReadyToLoad = (): boolean => {
    const div = scrollDivRef.current;
    if (!div) return false;

    const isAtBottom = div.scrollTop + div.offsetHeight >= div.scrollHeight * 0.9;

    return isAtBottom && hasMore;
  };

  const tryLoadMore = async () => {
    if (isLoading || !isReadyToLoad()) return;

    setIsLoading(true);
    await loadMore();
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (itemCount < lastItemCount) {
      const div = scrollDivRef.current;
      if (div) div.scrollTo({ top: 0 });
    }

    tryLoadMore();
    setLastItemCount(itemCount);
  }, [itemCount, hasMore]);

  return (
    <div
      ref={scrollDivRef}
      className={cn('flex-grow overflow-y-auto custom-scrollbar', className)}
      onScroll={tryLoadMore}
    >
      {children}
      <div className="w-full">{isLoading && loader}</div>
    </div>
  );
};
