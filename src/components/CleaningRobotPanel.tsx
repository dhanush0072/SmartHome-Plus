import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  Battery,
  Bot,
  CalendarDays,
  Check,
  Clock3,
  House,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  Wind,
} from "lucide-react"
import {
  getCleaningRobotData,
  pauseRobotIfCleaning,
  saveCleaningRobotData,
  type CleaningMode,
  type CleaningRepeat,
  type CleaningRobotData,
  type CleaningSchedule,
} from "../services/cleaningRobot"
import type { RoomState } from "../utils/aiCommandParser"

const repeatOptions: { value: CleaningRepeat; label: string }[] = [
  { value: "once", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom days" },
]

const weekdays = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
]

const localDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

interface CleaningRobotPanelProps {
  ownerId: string
  rooms: RoomState[]
  onBack: () => void
}

export default function CleaningRobotPanel({
  ownerId,
  rooms,
  onBack,
}: CleaningRobotPanelProps) {
  const initialData = useMemo(
    () => getCleaningRobotData(ownerId),
    [ownerId],
  )
  const [data, setData] = useState<CleaningRobotData>(initialData)
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>(
    initialData.session?.roomIds ?? [],
  )
  const [scheduleName, setScheduleName] = useState("")
  const [scheduleDate, setScheduleDate] = useState(localDate(new Date()))
  const [scheduleEndDate, setScheduleEndDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("08:00")
  const [scheduleEnabled, setScheduleEnabled] = useState(true)
  const [scheduleRepeat, setScheduleRepeat] =
    useState<CleaningRepeat>("weekdays")
  const [scheduleDays, setScheduleDays] = useState<number[]>([])
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null,
  )
  const [formError, setFormError] = useState("")
  const [startError, setStartError] = useState("")
  const [notice, setNotice] = useState("")
  const [saving, setSaving] = useState(false)
  const serializedData = useRef(JSON.stringify(initialData))
  const dataRef = useRef(data)

  useEffect(() => {
    dataRef.current = data
    const serialized = JSON.stringify(data)
    if (serialized === serializedData.current) return
    saveCleaningRobotData(ownerId, data)
    serializedData.current = serialized
  }, [data, ownerId])

  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ ownerId: string; data: CleaningRobotData }>).detail
      if (!detail || detail.ownerId !== ownerId) return
      const serialized = JSON.stringify(detail.data)
      if (serialized === serializedData.current) return
      serializedData.current = serialized
      dataRef.current = detail.data
      setData(detail.data)
      if (detail.data.session?.roomIds) {
        setSelectedRoomIds(detail.data.session.roomIds)
      }
    }
    window.addEventListener("smarthome_cleaning_robot_change", sync)
    return () =>
      window.removeEventListener("smarthome_cleaning_robot_change", sync)
  }, [ownerId])

  useEffect(() => {
    if (data.status !== "Cleaning" || !data.session) return
    const timer = window.setInterval(() => {
      setData((current) => {
        const session = current.session
        if (current.status !== "Cleaning" || !session) return current

        const nextProgress = Math.min(100, session.progress + 1)
        const nextElapsed = session.elapsedSeconds + 1
        const roomIndex = Math.min(
          session.roomIds.length - 1,
          Math.floor((nextProgress / 100) * session.roomIds.length),
        )
        if (nextProgress < 100) {
          return {
            ...current,
            session: {
              ...session,
              progress: nextProgress,
              elapsedSeconds: nextElapsed,
              currentRoomId: session.roomIds[roomIndex] ?? null,
            },
          }
        }

        const returnToDock = current.returnAfterCleaning
        return {
          ...current,
          battery: Math.max(5, current.battery - 2),
          status: returnToDock ? "Returning to Dock" : "Idle",
          session: {
            ...session,
            progress: 100,
            elapsedSeconds: nextElapsed,
            currentRoomId: null,
            status: "Completed",
          },
          history: [
            {
              id: session.id,
              roomIds: [...session.roomIds],
              mode: session.mode,
              result: "Completed" as const,
              completedAt: Date.now(),
            },
            ...current.history,
          ].slice(0, 10),
        }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [data.status, data.session?.id])

  useEffect(() => {
    if (data.status === "Returning to Dock") {
      const timer = window.setTimeout(() => {
        setData((current) =>
          current.status === "Returning to Dock"
            ? { ...current, status: "Charging" }
            : current,
        )
      }, 1800)
      return () => window.clearTimeout(timer)
    }
    if (data.status === "Charging" && data.battery < 100) {
      const timer = window.setInterval(() => {
        setData((current) => {
          if (current.status !== "Charging") return current
          const battery = Math.min(100, current.battery + 1)
          return { ...current, battery, status: battery === 100 ? "Idle" : "Charging" }
        })
      }, 5000)
      return () => window.clearInterval(timer)
    }
  }, [data.status, data.battery])

  useEffect(() => {
    return () => pauseRobotIfCleaning(ownerId)
  }, [ownerId])

  const roomById = useMemo(() => new Map(rooms.map((room) => [room.id, room])), [rooms])
  const isCleaning = data.status === "Cleaning"
  const canStart = data.status === "Idle" && data.battery > 5
  const activeSession = data.session
  const selectedRoomNames = selectedRoomIds
    .map((id) => roomById.get(id)?.name)
    .filter((name): name is string => Boolean(name))

  const setRobotOption = <K extends keyof CleaningRobotData>(
    key: K,
    value: CleaningRobotData[K],
  ) => {
    setData((current) => ({ ...current, [key]: value }))
  }

  const selectRooms = (ids: number[]) => {
    setSelectedRoomIds(ids)
    setFormError("")
    setStartError("")
  }

  const startCleaning = (
    roomIds = selectedRoomIds,
    mode: CleaningMode = data.mode,
  ) => {
    if (data.status !== "Idle" || data.battery <= 5) return
    if (!roomIds.length) {
      setStartError("Choose at least one room before starting.")
      return
    }
    setFormError("")
    setStartError("")
    setNotice("")
    const session = {
      id: `session-${Date.now()}`,
      roomIds: [...roomIds],
      mode,
      status: "Cleaning" as const,
      currentRoomId: roomIds[0],
      progress: 0,
      elapsedSeconds: 0,
      startedAt: Date.now(),
    }
    setSelectedRoomIds(roomIds)
    setData((current) => ({ ...current, status: "Cleaning", mode, session }))
  }

  const pauseCleaning = () => {
    setData((current) => {
      if (current.status !== "Cleaning" || !current.session) return current
      return {
        ...current,
        status: "Paused",
        session: { ...current.session, status: "Paused" },
      }
    })
  }

  const resumeCleaning = () => {
    setData((current) => {
      if (current.status !== "Paused" || !current.session) return current
      return {
        ...current,
        status: "Cleaning",
        session: { ...current.session, status: "Cleaning" },
      }
    })
  }

  const stopCleaning = () => {
    setData((current) => {
      if (!current.session || !["Cleaning", "Paused"].includes(current.status)) {
        return current
      }
      return {
        ...current,
        status: "Idle",
        session: { ...current.session, status: "Stopped" },
        history: [
          {
            id: current.session.id,
            roomIds: [...current.session.roomIds],
            mode: current.session.mode,
            result: "Stopped" as const,
            completedAt: Date.now(),
          },
          ...current.history,
        ].slice(0, 10),
      }
    })
    setNotice("Cleaning session stopped.")
  }

  const returnToDock = () => {
    if (!["Idle", "Paused"].includes(data.status)) return
    setData((current) => ({ ...current, status: "Returning to Dock" }))
  }

  const clearScheduleForm = () => {
    setScheduleName("")
    setScheduleDate(localDate(new Date()))
    setScheduleEndDate("")
    setScheduleTime("08:00")
    setScheduleEnabled(true)
    setScheduleRepeat("weekdays")
    setScheduleDays([])
    setEditingScheduleId(null)
    setFormError("")
  }

  const saveSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    const trimmedName = scheduleName.trim()
    if (!trimmedName) {
      setFormError("Enter a name for this schedule.")
      return
    }
    if (!selectedRoomIds.length) {
      setFormError("Choose at least one room for the schedule.")
      return
    }
    if (!scheduleDate || !scheduleTime) {
      setFormError("Choose a date and start time.")
      return
    }
    if (scheduleRepeat === "custom" && !scheduleDays.length) {
      setFormError("Choose at least one day for a custom schedule.")
      return
    }
    if (scheduleDate < localDate(new Date())) {
      setFormError("The schedule date cannot be in the past.")
      return
    }
    if (scheduleEndDate && scheduleEndDate < scheduleDate) {
      setFormError("The end date must be on or after the start date.")
      return
    }
    if (
      scheduleRepeat === "once" &&
      new Date(`${scheduleDate}T${scheduleTime}`).getTime() <= Date.now()
    ) {
      setFormError("A one-time schedule must be set for a future time.")
      return
    }

    setSaving(true)
    const schedule: CleaningSchedule = {
      id: editingScheduleId ?? `schedule-${Date.now()}`,
      ownerId,
      name: trimmedName,
      roomIds: [...selectedRoomIds],
      mode: data.mode,
      date: scheduleDate,
      endDate: scheduleEndDate || undefined,
      time: scheduleTime,
      repeat: scheduleRepeat,
      customDays: [...scheduleDays],
      enabled: scheduleEnabled,
    }
    setData((current) => ({
      ...current,
      schedules: editingScheduleId
        ? current.schedules.map((item) =>
            item.id === editingScheduleId ? schedule : item,
          )
        : [schedule, ...current.schedules],
    }))
    setNotice(editingScheduleId ? "Schedule updated." : "Schedule saved.")
    clearScheduleForm()
    window.setTimeout(() => setSaving(false), 0)
  }

  const editSchedule = (schedule: CleaningSchedule) => {
    setEditingScheduleId(schedule.id)
    setScheduleName(schedule.name)
    setScheduleDate(schedule.date)
    setScheduleEndDate(schedule.endDate ?? "")
    setScheduleTime(schedule.time)
    setScheduleEnabled(schedule.enabled)
    setScheduleRepeat(schedule.repeat)
    setScheduleDays(schedule.customDays)
    setSelectedRoomIds(schedule.roomIds)
    setRobotOption("mode", schedule.mode)
    setFormError("")
    document.getElementById("robot-schedule-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const deleteSchedule = (schedule: CleaningSchedule) => {
    if (!window.confirm(`Delete the "${schedule.name}" cleaning schedule?`)) {
      return
    }
    setData((current) => ({
      ...current,
      schedules: current.schedules.filter((item) => item.id !== schedule.id),
    }))
    if (editingScheduleId === schedule.id) clearScheduleForm()
    setNotice("Schedule deleted.")
  }

  const toggleSchedule = (schedule: CleaningSchedule) => {
    setData((current) => ({
      ...current,
      schedules: current.schedules.map((item) =>
        item.id === schedule.id ? { ...item, enabled: !item.enabled } : item,
      ),
    }))
  }

  const leavePanel = () => {
    if (dataRef.current.status === "Cleaning") {
      pauseRobotIfCleaning(ownerId)
      setData((current) => ({
        ...current,
        status: "Paused",
        session: current.session
          ? { ...current.session, status: "Paused" }
          : null,
      }))
    }
    onBack()
  }

  const nextScheduleText = (schedule: CleaningSchedule) => {
    const nextDate = nextOccurrence(schedule)
    if (!nextDate) return "No upcoming cleaning"
    return nextDate.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const statusDescription =
    data.status === "Idle"
      ? "Ready for a cleaning session"
      : data.status === "Paused"
        ? "Cleaning is paused"
        : data.status === "Cleaning"
          ? "Cleaning is in progress"
          : data.status === "Charging"
            ? "Charging at the dock"
            : "Returning to the charging dock"

  return (
    <div className="robot-control-page">
      <div className="robot-control-topbar">
        <button type="button" className="robot-back-button" onClick={leavePanel}>
          <ArrowLeft size={17} /> Back to Devices
        </button>
        <span className="robot-simulation-note">Simulated device</span>
      </div>

      <header className="robot-hero dashboard-glass">
        <div className="robot-hero-icon"><Bot size={30} /></div>
        <div className="robot-hero-copy">
          <p className="robot-eyebrow">ROBOT VACUUM · SIMULATED</p>
          <h1>Smart Cleaning Robot</h1>
          <p>{statusDescription}</p>
        </div>
        <div className="robot-hero-metrics">
          <span className="robot-online-pill"><i /> Online · Simulation</span>
          <div className="robot-battery">
            <Battery size={18} />
            <strong>{data.battery}%</strong>
            <div className="robot-battery-track">
              <span style={{ width: `${data.battery}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="robot-control-grid">
        <section className="robot-section dashboard-glass robot-status-section">
          <div className="robot-section-heading">
            <div>
              <p className="robot-eyebrow">LIVE STATUS</p>
              <h2>{data.status}</h2>
            </div>
            <span className={`robot-status-tag ${data.status.toLowerCase().replace(/ /g, "-")}`}>
              {data.status}
            </span>
          </div>

          {activeSession && (
            <div className="robot-progress-panel">
              <div className="robot-progress-copy">
                <span>
                  {activeSession.status === "Completed"
                    ? "Cleaning complete"
                    : activeSession.status === "Stopped"
                      ? "Session stopped"
                      : `Now cleaning ${roomById.get(activeSession.currentRoomId ?? -1)?.name ?? "selected rooms"}`}
                </span>
                <strong>{activeSession.progress}%</strong>
              </div>
              <div className="robot-progress-track">
                <span style={{ width: `${activeSession.progress}%` }} />
              </div>
              <div className="robot-progress-meta">
                <span>{formatDuration(activeSession.elapsedSeconds)} elapsed</span>
                {activeSession.status === "Cleaning" && (
                  <span>
                    About {formatDuration(100 - activeSession.progress)} simulated remaining
                  </span>
                )}
              </div>
              <p className="robot-session-rooms">
                Rooms: {activeSession.roomIds.map((id) => roomById.get(id)?.name).filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {activeSession?.status === "Completed" && (
            <div className="robot-success-message">
              <Check size={17} /> Cleaning completed. Your robot is ready to dock.
            </div>
          )}
          {startError && <p className="robot-form-error">{startError}</p>}
          {notice && <p className="robot-notice" role="status">{notice}</p>}

          <div className="robot-actions">
            <button
              type="button"
              className="robot-action-primary"
              disabled={!canStart}
              onClick={() => startCleaning()}
            >
              <Play size={16} fill="currentColor" />
              Start Cleaning
            </button>
            <button
              type="button"
              className="robot-action-secondary"
              disabled={!isCleaning}
              onClick={pauseCleaning}
            >
              <Pause size={16} /> Pause
            </button>
            <button
              type="button"
              className="robot-action-secondary"
              disabled={data.status !== "Paused"}
              onClick={resumeCleaning}
            >
              <Play size={16} /> Resume
            </button>
            <button
              type="button"
              className="robot-action-secondary"
              disabled={!["Cleaning", "Paused"].includes(data.status)}
              onClick={stopCleaning}
            >
              <span className="robot-stop-icon" /> Stop
            </button>
            <button
              type="button"
              className="robot-action-secondary"
              disabled={!["Idle", "Paused"].includes(data.status)}
              onClick={returnToDock}
            >
              <House size={16} /> Return to Dock
            </button>
          </div>
          {data.battery <= 5 && data.status === "Idle" && (
            <p className="robot-form-error">Battery is too low to start a cleaning session.</p>
          )}
        </section>

        <section className="robot-section dashboard-glass">
          <div className="robot-section-heading">
            <div>
              <p className="robot-eyebrow">ROOM ASSIGNMENT</p>
              <h2>Choose Rooms to Clean</h2>
            </div>
            <div className="robot-selection-actions">
              <button type="button" onClick={() => selectRooms(rooms.map((room) => room.id))}>Select all</button>
              <button type="button" onClick={() => selectRooms([])}>Clear</button>
            </div>
          </div>
          {rooms.length ? (
            <div className="robot-room-grid">
              {rooms.map((room) => {
                const selected = selectedRoomIds.includes(room.id)
                return (
                  <label
                    key={room.id}
                    className={`robot-room-choice${selected ? " selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        selectRooms(
                          selected
                            ? selectedRoomIds.filter((id) => id !== room.id)
                            : [...selectedRoomIds, room.id],
                        )
                      }
                    />
                    <span className="robot-room-check">{selected && <Check size={13} />}</span>
                    <House size={18} />
                    <span className="robot-room-name">{room.name}</span>
                    <small>~20 min</small>
                  </label>
                )
              })}
            </div>
          ) : (
            <p className="robot-empty-state">Add a room in Rooms before scheduling cleaning.</p>
          )}
          <p className="robot-selection-summary">
            {selectedRoomNames.length
              ? `${selectedRoomNames.length} selected · ${selectedRoomNames.join(", ")}`
              : "Select at least one room to start or schedule a clean."}
          </p>
        </section>

        <section className="robot-section dashboard-glass">
          <div className="robot-section-heading">
            <div>
              <p className="robot-eyebrow">PERSONALIZE</p>
              <h2>Cleaning Preferences</h2>
            </div>
            <Wind size={20} className="robot-heading-icon" />
          </div>
          <div className="robot-preference-grid">
            <label className="robot-field">
              <span>Cleaning mode</span>
              <select
                value={data.mode}
                disabled={isCleaning}
                onChange={(event) => setRobotOption("mode", event.target.value as CleaningMode)}
              >
                <option value="Auto">Auto</option>
                <option value="Vacuum">Vacuum</option>
              </select>
              <small>Mopping is not supported by this simulated device.</small>
            </label>
            <label className="robot-field">
              <span>Suction power</span>
              <select
                value={data.suction}
                disabled={isCleaning}
                onChange={(event) => setRobotOption("suction", event.target.value as CleaningRobotData["suction"])}
              >
                {["Quiet", "Standard", "Strong", "Max"].map((power) => (
                  <option key={power}>{power}</option>
                ))}
              </select>
            </label>
            <label className="robot-field">
              <span>Cleaning passes</span>
              <select
                value={data.passes}
                disabled={isCleaning}
                onChange={(event) => setRobotOption("passes", Number(event.target.value) as 1 | 2)}
              >
                <option value={1}>One pass</option>
                <option value={2}>Two passes</option>
              </select>
            </label>
            <label className="robot-switch-field">
              <span><Sparkles size={16} /> Clean along room edges</span>
              <input
                type="checkbox"
                checked={data.edgeCleaning}
                disabled={isCleaning}
                onChange={(event) => setRobotOption("edgeCleaning", event.target.checked)}
              />
            </label>
            <label className="robot-switch-field">
              <span><House size={16} /> Return to dock after cleaning</span>
              <input
                type="checkbox"
                checked={data.returnAfterCleaning}
                disabled={isCleaning}
                onChange={(event) => setRobotOption("returnAfterCleaning", event.target.checked)}
              />
            </label>
          </div>
        </section>

        <section className="robot-section dashboard-glass robot-schedule-section">
          <div className="robot-section-heading">
            <div>
              <p className="robot-eyebrow">AUTOMATION</p>
              <h2>Schedule Cleaning</h2>
            </div>
            <CalendarDays size={20} className="robot-heading-icon" />
          </div>
          <form id="robot-schedule-form" className="robot-schedule-form" onSubmit={saveSchedule}>
            <label className="robot-field robot-field-wide">
              <span>Schedule name</span>
              <input
                value={scheduleName}
                onChange={(event) => setScheduleName(event.target.value)}
                placeholder="Morning Cleaning"
                maxLength={48}
              />
            </label>
            <div className="robot-schedule-summary">
              <span>Selected rooms</span>
              <strong>{selectedRoomNames.length ? selectedRoomNames.join(", ") : "Choose rooms above"}</strong>
            </div>
            <label className="robot-field">
              <span>Cleaning mode</span>
              <select
                value={data.mode}
                onChange={(event) => setRobotOption("mode", event.target.value as CleaningMode)}
              >
                <option value="Auto">Auto</option>
                <option value="Vacuum">Vacuum</option>
              </select>
            </label>
            <label className="robot-field">
              <span>Date</span>
              <input
                type="date"
                value={scheduleDate}
                min={localDate(new Date())}
                onChange={(event) => setScheduleDate(event.target.value)}
              />
            </label>
            <label className="robot-field">
              <span>Start time</span>
              <input
                type="time"
                value={scheduleTime}
                onChange={(event) => setScheduleTime(event.target.value)}
              />
            </label>
            <label className="robot-field">
              <span>End date (optional)</span>
              <input
                type="date"
                value={scheduleEndDate}
                min={scheduleDate || localDate(new Date())}
                onChange={(event) => setScheduleEndDate(event.target.value)}
              />
            </label>
            <label className="robot-field">
              <span>Repeat</span>
              <select
                value={scheduleRepeat}
                onChange={(event) => setScheduleRepeat(event.target.value as CleaningRepeat)}
              >
                {repeatOptions.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="robot-switch-field robot-field-wide">
              <span>Enable this schedule</span>
              <input
                type="checkbox"
                checked={scheduleEnabled}
                onChange={(event) => setScheduleEnabled(event.target.checked)}
              />
            </label>
            {scheduleRepeat === "custom" && (
              <fieldset className="robot-custom-days robot-field-wide">
                <legend>Repeat on</legend>
                {weekdays.map((day) => (
                  <label key={day.value}>
                    <input
                      type="checkbox"
                      checked={scheduleDays.includes(day.value)}
                      onChange={() =>
                        setScheduleDays((current) =>
                          current.includes(day.value)
                            ? current.filter((value) => value !== day.value)
                            : [...current, day.value],
                        )
                      }
                    />
                    {day.label}
                  </label>
                ))}
              </fieldset>
            )}
            {formError && <p className="robot-form-error robot-field-wide">{formError}</p>}
            <div className="robot-schedule-form-actions robot-field-wide">
              {editingScheduleId && (
                <button type="button" className="robot-action-secondary" onClick={clearScheduleForm}>Cancel edit</button>
              )}
              <button type="submit" className="robot-action-primary" disabled={saving}>
                <CalendarDays size={16} />
                {editingScheduleId ? "Update Schedule" : "Save Schedule"}
              </button>
            </div>
          </form>

          <div className="robot-schedules-list">
            <h3>Saved schedules <span>{data.schedules.length}</span></h3>
            {data.schedules.length ? data.schedules.map((schedule) => (
              <article className="robot-schedule-card" key={schedule.id}>
                <div className="robot-schedule-card-main">
                  <div className="robot-schedule-calendar"><Clock3 size={18} /></div>
                  <div>
                    <h4>{schedule.name}</h4>
                    <p>{schedule.roomIds.map((id) => roomById.get(id)?.name).filter(Boolean).join(", ") || "Room removed"}</p>
                    <small>{repeatLabel(schedule)} · {schedule.mode} · Next: {nextScheduleText(schedule)}</small>
                  </div>
                </div>
                <div className="robot-schedule-card-actions">
                  <span className={`robot-enabled-label${schedule.enabled ? " enabled" : ""}`}>
                    {schedule.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <button type="button" aria-label={`Edit ${schedule.name}`} title="Edit schedule" onClick={() => editSchedule(schedule)}>Edit</button>
                  <button
                    type="button"
                    aria-label={`${schedule.enabled ? "Disable" : "Enable"} ${schedule.name}`}
                    onClick={() => toggleSchedule(schedule)}
                  >
                    {schedule.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    aria-label={`Run ${schedule.name} now`}
                    disabled={!canStart}
                    onClick={() => startCleaning(schedule.roomIds, schedule.mode)}
                  >
                    Run now
                  </button>
                  <button type="button" className="robot-delete-button" aria-label={`Delete ${schedule.name}`} onClick={() => deleteSchedule(schedule)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )) : (
              <p className="robot-empty-state">No cleaning schedules yet.</p>
            )}
          </div>
        </section>

        <section className="robot-section dashboard-glass robot-history-section">
          <div className="robot-section-heading">
            <div>
              <p className="robot-eyebrow">RECENT ACTIVITY</p>
              <h2>Cleaning Sessions</h2>
            </div>
            <RotateCcw size={19} className="robot-heading-icon" />
          </div>
          {data.history.length ? (
            <div className="robot-history-list">
              {data.history.slice(0, 5).map((item) => (
                <div className="robot-history-item" key={item.id}>
                  <span className={`robot-history-dot ${item.result.toLowerCase()}`} />
                  <span>{item.result} · {item.roomIds.map((id) => roomById.get(id)?.name).filter(Boolean).join(", ")}</span>
                  <time>{new Date(item.completedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
                </div>
              ))}
            </div>
          ) : (
            <p className="robot-empty-state">Completed and stopped sessions will appear here.</p>
          )}
        </section>
      </div>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes ? `${minutes}m ${remainder}s` : `${remainder}s`
}

function repeatLabel(schedule: CleaningSchedule): string {
  if (schedule.repeat === "once") return "Does not repeat"
  if (schedule.repeat === "daily") return "Daily"
  if (schedule.repeat === "weekdays") return "Weekdays"
  if (schedule.repeat === "weekends") return "Weekends"
  if (schedule.repeat === "weekly") return "Weekly"
  return `Custom · ${schedule.customDays
    .map((day) => weekdays.find((item) => item.value === day)?.label)
    .filter(Boolean)
    .join(", ")}`
}

function nextOccurrence(schedule: CleaningSchedule): Date | null {
  const [year, month, day] = schedule.date.split("-").map(Number)
  const [hours, minutes] = schedule.time.split(":").map(Number)
  const start = new Date(year, month - 1, day, hours, minutes, 0, 0)
  if (schedule.repeat === "once") {
    return schedule.enabled && start.getTime() > Date.now() ? start : null
  }
  const now = new Date()
  for (let offset = 0; offset < 366; offset += 1) {
    const candidate = new Date(
      year,
      month - 1,
      day + offset,
      hours,
      minutes,
      0,
      0,
    )
    if (schedule.endDate && localDate(candidate) > schedule.endDate) return null
    if (candidate.getTime() <= now.getTime()) continue
    const weekday = candidate.getDay()
    const matches =
      schedule.repeat === "daily" ||
      (schedule.repeat === "weekdays" && weekday >= 1 && weekday <= 5) ||
      (schedule.repeat === "weekends" && (weekday === 0 || weekday === 6)) ||
      (schedule.repeat === "weekly" && weekday === start.getDay()) ||
      (schedule.repeat === "custom" && schedule.customDays.includes(weekday))
    if (matches && schedule.enabled) return candidate
  }
  return null
}
