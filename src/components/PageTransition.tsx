import { useEffect, useState } from "react"

interface PageTransitionProps {
  pageKey: string

  children: React.ReactNode
}

export default function PageTransition({
  pageKey,
  children,
}: PageTransitionProps) {
  const [visibleKey, setVisibleKey] = useState(pageKey)

  useEffect(() => {
    setVisibleKey(pageKey)
  }, [pageKey])

  return (
    <div key={visibleKey} className="page-transition" data-page={visibleKey}>
      {children}
    </div>
  )
}
