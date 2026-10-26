import { useState, useEffect } from "react"
import { MessageSquare, Star, Trash2 } from "lucide-react"

const FEEDBACK_STORAGE_KEY = "smarthome_feedback"

interface FeedbackEntry {
  id: string
  rating: number
  category: string
  comment: string
  createdAt: string
  author?: string
  resolved?: boolean
}

const seedFeedbacks: FeedbackEntry[] = [
  {
    id: "fb-1",
    rating: 5,
    category: "Device Control",
    comment:
      "The Matter lighting response is virtually instantaneous! Love the smooth dimming transitions.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    author: "Priya Sharma (Skyline Palms)",
    resolved: false,
  },
  {
    id: "fb-2",
    rating: 5,
    category: "Energy Monitoring",
    comment:
      "The solar generation charts accurately match my inverter app. Saved 18% on last month’s bill.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    author: "USER (USER Villa)",
    resolved: true,
  },
  {
    id: "fb-3",
    rating: 4,
    category: "Automation",
    comment:
      "Movie mode works wonderfully with our smart blinds, would love to see multi-step delays.",
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    author: "Ananya Nair (Greenwood Estate)",
    resolved: false,
  },
  {
    id: "fb-4",
    rating: 4,
    category: "Dashboard",
    comment:
      "Clean Apple Home aesthetic, glassmorphic layout looks incredible on iPad wall mount.",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    author: "Rahul Mehta (Mehta Haven)",
    resolved: true,
  },
]

export default function AdminFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([])
  const [selectedRating, setSelectedRating] = useState<number | "ALL">("ALL")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p) => p.id))
          const merged = [
            ...parsed,
            ...seedFeedbacks.filter((s) => !existingIds.has(s.id)),
          ]
          setFeedbacks(merged)
          return
        }
      }
      window.localStorage.setItem(
        FEEDBACK_STORAGE_KEY,
        JSON.stringify(seedFeedbacks),
      )
      setFeedbacks(seedFeedbacks)
    } catch {
      setFeedbacks(seedFeedbacks)
    }
  }, [])

  const saveFeedbackList = (updated: FeedbackEntry[]) => {
    setFeedbacks(updated)
    try {
      window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore storage error
    }
  }

  const handleToggleResolved = (id: string) => {
    const updated = feedbacks.map((f) =>
      f.id === id ? { ...f, resolved: !f.resolved } : f,
    )
    saveFeedbackList(updated)
  }

  const handleDelete = (id: string) => {
    const updated = feedbacks.filter((f) => f.id !== id)
    saveFeedbackList(updated)
  }

  const totalCount = feedbacks.length
  const avgRating = totalCount
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1)
    : "5.0"

  const filtered = feedbacks.filter((f) => {
    const matchRating = selectedRating === "ALL" || f.rating === selectedRating
    const matchCategory =
      selectedCategory === "ALL" || f.category === selectedCategory
    return matchRating && matchCategory
  })

  return (
    <div
      className="account-page"
      style={{ padding: "clamp(16px, 3vw, 32px)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#FF9500",
                background: "rgba(255,149,0,0.1)",
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              Homeowner Voice & Sentiment
            </span>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: 0,
              letterSpacing: "-0.8px",
            }}
          >
            Feedback Management
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#48484A",
              margin: "4px 0 0",
              fontWeight: 500,
            }}
          >
            Inspect ratings, user testimonials, and feature recommendations
            submitted through homeowner portals.
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <div className="glass-card" style={{ padding: "20px 22px" }}>
          <p
            style={{
              fontSize: 12,
              color: "#6E6E73",
              margin: "0 0 4px",
              fontWeight: 600,
            }}
          >
            Average Platform Rating
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#1D1D1F",
                margin: 0,
              }}
            >
              {avgRating}
            </p>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(Number(avgRating)) ? "#FF9500" : "none"}
                  color="#FF9500"
                />
              ))}
            </div>
          </div>
          <p
            style={{
              fontSize: 11,
              color: "#34C759",
              margin: "6px 0 0",
              fontWeight: 600,
            }}
          >
            ↑ 94% positive homeowner reviews
          </p>
        </div>

        <div className="glass-card" style={{ padding: "20px 22px" }}>
          <p
            style={{
              fontSize: 12,
              color: "#6E6E73",
              margin: "0 0 4px",
              fontWeight: 600,
            }}
          >
            Total Submissions
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#1D1D1F",
              margin: 0,
            }}
          >
            {totalCount}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#48484A",
              margin: "6px 0 0",
              fontWeight: 500,
            }}
          >
            {feedbacks.filter((f) => f.resolved).length} marked as resolved
          </p>
        </div>

        <div className="glass-card" style={{ padding: "20px 22px" }}>
          <p
            style={{
              fontSize: 12,
              color: "#6E6E73",
              margin: "0 0 4px",
              fontWeight: 600,
            }}
          >
            Top Rated Category
          </p>
          <p
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#007AFF",
              margin: "4px 0 2px",
            }}
          >
            Device Control
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#48484A",
              margin: 0,
              fontWeight: 500,
            }}
          >
            4.9 ★ average rating
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{ padding: "16px 20px", marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Star Rating filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Rating:
            </span>
            {["ALL", 5, 4, 3].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRating(r as any)}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    selectedRating === r ? "#FF9500" : "rgba(0,0,0,0.05)",
                  color: selectedRating === r ? "white" : "#6E6E73",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {r === "ALL" ? "All Ratings" : `${r} ★`}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6E6E73" }}>
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "rgba(255,255,255,0.7)",
                color: "#1D1D1F",
                outline: "none",
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Overall Experience">Overall Experience</option>
              <option value="Dashboard">Dashboard</option>
              <option value="Device Control">Device Control</option>
              <option value="Security">Security</option>
              <option value="Energy Monitoring">Energy Monitoring</option>
              <option value="Automation">Automation</option>
              <option value="AI Assistant">AI Assistant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: 40, textAlign: "center" }}
          >
            <MessageSquare
              size={32}
              color="#8E8E93"
              style={{ margin: "0 auto 12px" }}
            />
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#1D1D1F",
              }}
            >
              No Feedback Entries Found
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6E6E73" }}>
              No submissions match the current filter selection.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: "18px 22px",
                opacity: item.resolved ? 0.75 : 1,
                borderLeft: item.resolved
                  ? "4px solid #34C759"
                  : "4px solid #FF9500",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          fill={s <= item.rating ? "#FF9500" : "none"}
                          color="#FF9500"
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(0,122,255,0.08)",
                        color: "#007AFF",
                      }}
                    >
                      {item.category}
                    </span>
                    {item.resolved && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "rgba(52,199,89,0.12)",
                          color: "#34C759",
                          textTransform: "uppercase",
                        }}
                      >
                        Resolved
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "#6E6E73",
                      fontWeight: 600,
                    }}
                  >
                    {item.author || "Verified SmartHome+ Homeowner"} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleToggleResolved(item.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: item.resolved
                        ? "rgba(0,0,0,0.06)"
                        : "rgba(52,199,89,0.12)",
                      color: item.resolved ? "#6E6E73" : "#34C759",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {item.resolved ? "Reopen" : "Mark Resolved"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8E8E93",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    title="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#1D1D1F",
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                &ldquo;{item.comment}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
