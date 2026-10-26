import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { Check, MessageSquare, Star, X } from "lucide-react"

const FEEDBACK_STORAGE_KEY = "smarthome_feedback"

const categories = [
  "Overall Experience",

  "Dashboard",

  "Device Control",

  "Security",

  "Energy Monitoring",

  "Automation",

  "AI Assistant",

  "Other",
]

interface FeedbackEntry {
  id: string

  rating: number

  category: string

  comment: string

  createdAt: string
}

interface FeedbackModalProps {
  onClose: () => void
}

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0)

  const [hoveredRating, setHoveredRating] = useState(0)

  const [category, setCategory] = useState(categories[0])

  const [comment, setComment] = useState("")

  const [validationMessage, setValidationMessage] = useState("")

  const [isSubmitted, setIsSubmitted] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    document.body.style.overflow = "hidden"

    modalRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== "Tab" || !modalRef.current) return

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        modalRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (document.activeElement === modalRef.current) {
        event.preventDefault()
        const target = event.shiftKey ? lastElement : firstElement
        target.focus()
      } else if (!modalRef.current.contains(document.activeElement)) {
        event.preventDefault()
        const target = event.shiftKey ? lastElement : firstElement
        target.focus()
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow

      document.removeEventListener("keydown", handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [])

  const submitFeedback = () => {
    if (!rating) {
      setValidationMessage("Please select a rating.")

      return
    }

    const feedback: FeedbackEntry = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,

      rating,

      category,

      comment: comment.trim(),

      createdAt: new Date().toISOString(),
    }

    try {
      const savedFeedback = window.localStorage.getItem(FEEDBACK_STORAGE_KEY)

      const parsedFeedback: unknown = savedFeedback
        ? JSON.parse(savedFeedback)
        : []

      const feedbackEntries: FeedbackEntry[] = Array.isArray(parsedFeedback)
        ? parsedFeedback
        : []

      window.localStorage.setItem(
        FEEDBACK_STORAGE_KEY,
        JSON.stringify([...feedbackEntries, feedback]),
      )
    } catch {
      // The success state should still complete if storage is unavailable.
    }

    setValidationMessage("")

    setIsSubmitted(true)
  }

  const displayedRating = hoveredRating || rating

  return createPortal(
    <div
      className="feedback-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="feedback-success-state">
            <div className="feedback-success-icon" aria-hidden="true">
              <Check size={24} />
            </div>
            <h2 id="feedback-title">Thanks for your feedback! ⭐</h2>
            <p>Your feedback helps us improve SmartHome+.</p>
            <button
              type="button"
              className="feedback-primary-button"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="feedback-modal-header">
              <div className="feedback-modal-heading">
                <div className="feedback-modal-icon" aria-hidden="true">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h2 id="feedback-title">Share Your Feedback</h2>
                  <p>Help us make SmartHome+ better.</p>
                </div>
              </div>
              <button
                type="button"
                className="feedback-close-button"
                onClick={onClose}
                aria-label="Close feedback dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="feedback-field-group">
              <span className="feedback-field-label" id="feedback-rating-label">
                How was your experience?
              </span>
              <div
                className="feedback-stars"
                role="radiogroup"
                aria-labelledby="feedback-rating-label"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`feedback-star-button${
                      star <= displayedRating ? " selected" : ""
                    }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onFocus={() => setHoveredRating(star)}
                    onBlur={() => setHoveredRating(0)}
                    onKeyDown={(event) => {
                      if (
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowLeft"
                      ) {
                        return
                      }

                      event.preventDefault()
                      const nextRating =
                        event.key === "ArrowRight"
                          ? (star % 5) + 1
                          : ((star + 3) % 5) + 1
                      setRating(nextRating)
                      setHoveredRating(nextRating)
                      setValidationMessage("")
                      event.currentTarget.parentElement
                        ?.querySelectorAll<HTMLButtonElement>(
                          ".feedback-star-button",
                        )
                        [nextRating - 1]?.focus()
                    }}
                    onClick={() => {
                      setRating(star)

                      setValidationMessage("")
                    }}
                    role="radio"
                    tabIndex={rating === star || (!rating && star === 1) ? 0 : -1}
                    aria-checked={rating === star}
                    aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                  >
                    <Star size={30} fill="currentColor" />
                  </button>
                ))}
              </div>
              <span
                className={`feedback-rating-hint${
                  validationMessage ? " validation" : ""
                }`}
              >
                {validationMessage ||
                  (displayedRating
                    ? `${displayedRating} = ${["Poor", "Needs Improvement", "Good", "Very Good", "Excellent"][displayedRating - 1]}`
                    : "Select a rating from 1 to 5")}
              </span>
            </div>

            <label className="feedback-field-group">
              <span className="feedback-field-label">
                What would you like to share?
              </span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell us what you think about SmartHome+..."
                rows={4}
              />
            </label>

            <label className="feedback-field-group">
              <span className="feedback-field-label">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <div className="feedback-modal-actions">
              <button
                type="button"
                className="feedback-secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="feedback-primary-button"
                onClick={submitFeedback}
              >
                Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
