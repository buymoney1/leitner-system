// src/hooks/useRouteChange.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useRouteChange(onChange: (url: string) => void) {
  const pathname = usePathname();

  useEffect(() => {
    onChange(pathname);
  }, [pathname]);
}