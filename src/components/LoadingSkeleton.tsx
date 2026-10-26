import { useState } from "react"

interface LoadingSkeletonProps {
  className?: string

  style?: React.CSSProperties
}

export function LoadingSkeleton({
  className = "",
  style,
}: LoadingSkeletonProps) {
  return (
    <span
      className={`loading-skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

interface LoadingImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string
}

export function LoadingImage({
  wrapperClassName = "",
  className = "",
  onLoad,
  onError,
  ...props
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={`loading-image ${wrapperClassName}`}>
      {!loaded && <LoadingSkeleton className="loading-image-skeleton" />}
      <img
        {...props}
        className={`${className}${loaded ? " is-loaded" : ""}`}
        onLoad={(event) => {
          setLoaded(true)

          onLoad?.(event)
        }}
        onError={(event) => {
          setLoaded(true)

          onError?.(event)
        }}
      />
    </span>
  )
}
