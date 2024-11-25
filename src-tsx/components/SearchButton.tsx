import { clmx } from '@/utils/classConcat';
import { FolderOpenIcon } from 'lucide-react';
import { forwardRef } from 'react';

const SearchButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => {
  return (
    <>
      <button
        ref={ref}
        aria-label="select files"
        className={clmx(
          'flex size-5 items-center justify-center rounded-full p-px text-zinc-400 transition hover:text-zinc-200',
          className,
        )}
        {...props}
      >
        <FolderOpenIcon className="h-full w-auto" />
      </button>
    </>
  );
});
SearchButton.displayName = 'SearchButton';
export default SearchButton;
