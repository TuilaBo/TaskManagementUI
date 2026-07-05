import type { ReactNode } from 'react'
import { RouterProvider } from './router'

export function AppProviders({ children }: { children: ReactNode }) {
  return <RouterProvider>{children}</RouterProvider>
}
