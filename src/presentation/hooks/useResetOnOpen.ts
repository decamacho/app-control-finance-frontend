import { useState } from 'react'

export function useResetOnOpen(open: boolean, reset: () => void) {
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) reset()
  }
}