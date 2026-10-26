import { Home } from "lucide-react"

interface SmartHomeLoaderProps {
  compact?: boolean
}

export default function SmartHomeLoader({
  compact = false,
}: SmartHomeLoaderProps) {
  return (
    <div
      className={`smart-home-loader${
        compact ? " smart-home-loader-compact" : ""
      }`}
      role="status"
      aria-label="Loading SmartHome+"
    >
      <span
        className="smart-home-loader-accent smart-home-loader-accent-left"
        aria-hidden="true"
      />
      <span
        className="smart-home-loader-accent smart-home-loader-accent-right"
        aria-hidden="true"
      />
      <div className="smart-home-loader-mark" aria-hidden="true">
        <Home size={compact ? 24 : 34} strokeWidth={2.2} />
      </div>
    </div>
  )
}
