export type CleaningMode = "Auto" | "Vacuum"
export type SuctionPower = "Quiet" | "Standard" | "Strong" | "Max"
export type CleaningRepeat =
  | "once"
  | "daily"
  | "weekdays"
  | "weekends"
  | "weekly"
  | "custom"
export type RobotStatus =
  | "Idle"
  | "Cleaning"
  | "Paused"
  | "Returning to Dock"
  | "Charging"

export interface CleaningSchedule {
  id: string
  ownerId: string
  name: string
  roomIds: number[]
  mode: CleaningMode
  date: string
  endDate?: string
  time: string
  repeat: CleaningRepeat
  customDays: number[]
  enabled: boolean
  lastRunDate?: string
}

export interface CleaningSession {
  id: string
  roomIds: number[]
  mode: CleaningMode
  status: "Cleaning" | "Paused" | "Completed" | "Stopped"
  currentRoomId: number | null
  progress: number
  elapsedSeconds: number
  startedAt: number
}

export interface CleaningSessionRecord {
  id: string
  roomIds: number[]
  mode: CleaningMode
  result: "Completed" | "Stopped"
  completedAt: number
}

export interface CleaningRobotData {
  battery: number
  status: RobotStatus
  mode: CleaningMode
  suction: SuctionPower
  passes: 1 | 2
  edgeCleaning: boolean
  returnAfterCleaning: boolean
  session: CleaningSession | null
  schedules: CleaningSchedule[]
  history: CleaningSessionRecord[]
}

const storageKey = (ownerId: string) =>
  `smarthome-cleaning-robot:${encodeURIComponent(ownerId)}`

export const defaultCleaningRobotData: CleaningRobotData = {
  battery: 85,
  status: "Idle",
  mode: "Auto",
  suction: "Standard",
  passes: 1,
  edgeCleaning: true,
  returnAfterCleaning: true,
  session: null,
  schedules: [],
  history: [],
}

export function getCleaningRobotData(ownerId: string): CleaningRobotData {
  if (typeof window === "undefined") return defaultCleaningRobotData
  const raw = window.localStorage.getItem(storageKey(ownerId))
  if (!raw) return defaultCleaningRobotData

  try {
    const stored = JSON.parse(raw) as Partial<CleaningRobotData>
    return {
      ...defaultCleaningRobotData,
      ...stored,
      schedules: Array.isArray(stored.schedules) ? stored.schedules : [],
      history: Array.isArray(stored.history) ? stored.history : [],
    }
  } catch {
    return defaultCleaningRobotData
  }
}

export function saveCleaningRobotData(
  ownerId: string,
  data: CleaningRobotData,
): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(storageKey(ownerId), JSON.stringify(data))
  window.dispatchEvent(
    new CustomEvent("smarthome_cleaning_robot_change", {
      detail: { ownerId, data },
    }),
  )
}

export function pauseRobotIfCleaning(ownerId: string): void {
  const data = getCleaningRobotData(ownerId)
  if (data.status !== "Cleaning" || !data.session) return
  saveCleaningRobotData(ownerId, {
    ...data,
    status: "Paused",
    session: { ...data.session, status: "Paused" },
  })
}

export function runDueCleaningSchedule(ownerId: string, now = new Date()): void {
  const data = getCleaningRobotData(ownerId)
  if (!["Idle", "Charging"].includes(data.status) || data.battery <= 5) return
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
  const weekday = now.getDay()
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  const due = data.schedules.find((schedule) => {
    if (
      !schedule.enabled ||
      !schedule.roomIds.length ||
      schedule.time !== currentTime ||
      schedule.date > today ||
      (schedule.endDate !== undefined && schedule.endDate < today) ||
      schedule.lastRunDate === today
    ) {
      return false
    }
    if (schedule.repeat === "once") return schedule.date === today
    if (schedule.repeat === "weekdays") return weekday >= 1 && weekday <= 5
    if (schedule.repeat === "weekends") return weekday === 0 || weekday === 6
    if (schedule.repeat === "weekly") {
      return new Date(`${schedule.date}T12:00:00`).getDay() === weekday
    }
    if (schedule.repeat === "custom") return schedule.customDays.includes(weekday)
    return true
  })
  if (!due) return

  const session: CleaningSession = {
    id: `session-${Date.now()}`,
    roomIds: [...due.roomIds],
    mode: due.mode,
    status: "Cleaning",
    currentRoomId: due.roomIds[0],
    progress: 0,
    elapsedSeconds: 0,
    startedAt: Date.now(),
  }
  saveCleaningRobotData(ownerId, {
    ...data,
    status: "Cleaning",
    mode: due.mode,
    session,
    schedules: data.schedules.map((schedule) =>
      schedule.id === due.id ? { ...schedule, lastRunDate: today } : schedule,
    ),
  })
}
