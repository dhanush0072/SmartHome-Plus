export type Page = "landing" | "auth" | "dashboard" | "rooms" | "devices" | "security" | "energy" | "automation" | "notifications" | "profile" | "settings" | "admin"

export interface DeviceState {
  id: number
  name: string
  type: string
  room: string
  on: boolean
  brightness?: number
  speed?: number
  temp?: number
  energy: number
  schedule?: string
  color: string
}

export interface RoomState {
  id: number
  name: string
  temp: number
  humidity: number
  devices: number
  activeDevices: number
  status: string
  lights: boolean
  ac: boolean
}

export interface SecurityState {
  armed: boolean
  doors: Array<{ name: string; locked: boolean; lastAction: string; who: string }>
}

export interface AutomationState {
  id: number
  name: string
  active: boolean
  trigger: string
  actions: string[]
}

const STORAGE_DEVICES = "smarthome-plus-devices"
const STORAGE_ROOMS = "smarthome-plus-rooms"
const STORAGE_SECURITY = "smarthome-plus-security"
const STORAGE_AUTOMATIONS = "smarthome-plus-automations"

const defaultDevices: DeviceState[] = [
  {
    id: 1,
    name: "Living Room Light",
    type: "light",
    room: "Living Room",
    on: true,
    brightness: 100,
    energy: 0.06,
    color: "#FF9F0A",
    schedule: "Auto off 11pm",
  },
  {
    id: 2,
    name: "Bedroom Ceiling",
    type: "light",
    room: "Bedroom",
    on: false,
    brightness: 100,
    energy: 0,
    color: "#FF9F0A",
    schedule: "Sunrise",
  },
  {
    id: 3,
    name: "Kitchen Fan",
    type: "fan",
    room: "Kitchen",
    on: true,
    speed: 3,
    energy: 0.05,
    color: "#5AC8FA",
    schedule: "Manual",
  },
  {
    id: 4,
    name: "Living AC",
    type: "ac",
    room: "Living Room",
    on: true,
    temp: 22,
    energy: 1.2,
    color: "#007AFF",
    schedule: "Auto",
  },
  {
    id: 5,
    name: "Samsung TV",
    type: "tv",
    room: "Living Room",
    on: false,
    energy: 0,
    color: "#1D1D1F",
    schedule: "None",
  },
  {
    id: 6,
    name: "Smart Plug A",
    type: "plug",
    room: "Office",
    on: true,
    energy: 0.3,
    color: "#34C759",
    schedule: "None",
  },
  {
    id: 7,
    name: "Refrigerator",
    type: "fridge",
    room: "Kitchen",
    on: true,
    temp: 4,
    energy: 0.15,
    color: "#5AC8FA",
    schedule: "Always on",
  },
  {
    id: 8,
    name: "Washing Machine",
    type: "washer",
    room: "Utility",
    on: false,
    energy: 0,
    color: "#AF52DE",
    schedule: "8:00 AM",
  },
  {
    id: 9,
    name: "Water Heater",
    type: "heater",
    room: "Bathroom",
    on: true,
    temp: 55,
    energy: 2.1,
    color: "#FF3B30",
    schedule: "6am - 8am",
  },
  {
    id: 10,
    name: "Bedroom AC",
    type: "ac",
    room: "Bedroom",
    on: true,
    temp: 21,
    energy: 0.9,
    color: "#007AFF",
    schedule: "Night mode",
  },
  {
    id: 11,
    name: "Garden Light",
    type: "light",
    room: "Garden",
    on: true,
    brightness: 100,
    energy: 0.04,
    color: "#FF9F0A",
    schedule: "Dusk to dawn",
  },
  {
    id: 12,
    name: "Office Fan",
    type: "fan",
    room: "Office",
    on: false,
    speed: 0,
    energy: 0,
    color: "#5AC8FA",
    schedule: "Manual",
  },
]

const defaultRooms: RoomState[] = [
  {
    id: 1,
    name: "Living Room",
    temp: 22,
    humidity: 48,
    devices: 6,
    activeDevices: 4,
    status: "active",
    lights: true,
    ac: true,
  },
  {
    id: 2,
    name: "Bedroom",
    temp: 21,
    humidity: 52,
    devices: 4,
    activeDevices: 1,
    status: "active",
    lights: false,
    ac: true,
  },
  {
    id: 3,
    name: "Kitchen",
    temp: 24,
    humidity: 60,
    devices: 5,
    activeDevices: 2,
    status: "active",
    lights: true,
    ac: false,
  },
  {
    id: 4,
    name: "Bathroom",
    temp: 26,
    humidity: 70,
    devices: 3,
    activeDevices: 0,
    status: "idle",
    lights: false,
    ac: false,
  },
  {
    id: 5,
    name: "Garage",
    temp: 19,
    humidity: 42,
    devices: 2,
    activeDevices: 1,
    status: "active",
    lights: false,
    ac: false,
  },
  {
    id: 6,
    name: "Garden",
    temp: 24,
    humidity: 65,
    devices: 3,
    activeDevices: 2,
    status: "active",
    lights: true,
    ac: false,
  },
  {
    id: 7,
    name: "Office",
    temp: 22,
    humidity: 50,
    devices: 2,
    activeDevices: 1,
    status: "active",
    lights: true,
    ac: false,
  },
]

const defaultSecurity: SecurityState = {
  armed: true,
  doors: [
    { name: "Front Door", locked: true, lastAction: "9:05 AM", who: "USER" },
    {
      name: "Back Door",
      locked: true,
      lastAction: "8:30 AM",
      who: "Auto-lock",
    },
    {
      name: "Garage Door",
      locked: false,
      lastAction: "11:20 AM",
      who: "Member 1",
    },
    { name: "Side Gate", locked: true, lastAction: "Yesterday", who: "Manual" },
  ],
}

const defaultAutomations: AutomationState[] = [
  {
    id: 1,
    name: "Good Morning",
    active: true,
    trigger: "Time: 7:00 AM",
    actions: ["Turn on kitchen lights", "Set AC to 24°C", "Start coffee maker"],
  },
  {
    id: 2,
    name: "Good Night",
    active: true,
    trigger: "Time: 10:30 PM",
    actions: [
      "Turn off all lights",
      "Lock all doors",
      "Set AC to 21°C",
      "Arm security",
    ],
  },
  {
    id: 3,
    name: "Away Mode",
    active: true,
    trigger: "When I leave home",
    actions: ["Lock all doors", "Turn off lights", "Arm cameras"],
  },
  {
    id: 4,
    name: "Vacation",
    active: false,
    trigger: "Manual / Schedule",
    actions: ["Full security mode", "Minimal energy mode"],
  },
  {
    id: 5,
    name: "Movie Mode",
    active: false,
    trigger: "Manual",
    actions: ["Dim lights to 30%", "Turn on TV", "Set AC to 22°C"],
  },
]

// State Helpers
export function getStoredDevices(): DeviceState[] {
  try {
    const raw = localStorage.getItem(STORAGE_DEVICES)
    return raw ? JSON.parse(raw) : defaultDevices
  } catch {
    return defaultDevices
  }
}

export function saveStoredDevices(devices: DeviceState[]) {
  try {
    localStorage.setItem(STORAGE_DEVICES, JSON.stringify(devices))
    window.dispatchEvent(
      new CustomEvent("smarthome_devices_change", { detail: devices }),
    )
  } catch {}
}

export function getStoredRooms(): RoomState[] {
  try {
    const raw = localStorage.getItem(STORAGE_ROOMS)
    return raw ? JSON.parse(raw) : defaultRooms
  } catch {
    return defaultRooms
  }
}

export function saveStoredRooms(rooms: RoomState[]) {
  try {
    localStorage.setItem(STORAGE_ROOMS, JSON.stringify(rooms))
    window.dispatchEvent(
      new CustomEvent("smarthome_rooms_change", { detail: rooms }),
    )
  } catch {}
}

export function getStoredSecurity(): SecurityState {
  try {
    const raw = localStorage.getItem(STORAGE_SECURITY)
    return raw ? JSON.parse(raw) : defaultSecurity
  } catch {
    return defaultSecurity
  }
}

export function saveStoredSecurity(sec: SecurityState) {
  try {
    localStorage.setItem(STORAGE_SECURITY, JSON.stringify(sec))
    window.dispatchEvent(
      new CustomEvent("smarthome_security_change", { detail: sec }),
    )
  } catch {}
}

export function getStoredAutomations(): AutomationState[] {
  try {
    const raw = localStorage.getItem(STORAGE_AUTOMATIONS)
    return raw ? JSON.parse(raw) : defaultAutomations
  } catch {
    return defaultAutomations
  }
}

export function saveStoredAutomations(autos: AutomationState[]) {
  try {
    localStorage.setItem(STORAGE_AUTOMATIONS, JSON.stringify(autos))
    window.dispatchEvent(
      new CustomEvent("smarthome_automations_change", { detail: autos }),
    )
  } catch {}
}

// Master Command Parser Function
export function parseAndExecuteCommand(
  rawInput: string,
  onNavigate?: (p: Page) => void,
): { text: string; actionTaken?: boolean } {
  const input = rawInput.trim().toLowerCase()
  const clean = input.replace(/[.,?!]/g, "").trim()

  let devices = getStoredDevices()
  const rooms = getStoredRooms()
  const security = getStoredSecurity()
  const automations = getStoredAutomations()

  // Helper to update device
  const updateDeviceWhere = (
    predicate: (d: DeviceState) => boolean,
    updater: (d: DeviceState) => DeviceState,
  ) => {
    const next = devices.map((d) => (predicate(d) ? updater({ ...d }) : d))
    saveStoredDevices(next)
    devices = next
    return next
  }

  // 1. COMPOUND COMMAND: "Turn off bedroom lights and turn on living room lights"
  if (
    clean.includes("bedroom") &&
    clean.includes("living room") &&
    (clean.includes("turn off") || clean.includes("switch off")) &&
    (clean.includes("turn on") || clean.includes("switch on"))
  ) {
    updateDeviceWhere(
      (d) => d.room.toLowerCase().includes("bedroom") && d.type === "light",
      (d) => ({ ...d, on: false }),
    )
    updateDeviceWhere(
      (d) => d.room.toLowerCase().includes("living") && d.type === "light",
      (d) => ({ ...d, on: true }),
    )
    return {
      text: "Done. Bedroom lights are turned off and Living Room lights are turned on.",
      actionTaken: true,
    }
  }

  // 2. SCHEDULE COMMANDS (Check before instant commands)
  if (
    clean.includes("schedule") ||
    clean.includes("cancel my evening") ||
    clean.includes("cancel evening") ||
    /\bat\s+\d+\s*(?:am|pm)\b/i.test(clean)
  ) {
    if (clean.includes("cancel")) {
      return {
        text: "Your evening automation schedule has been cancelled.",
        actionTaken: true,
      }
    }
    if (
      clean.includes("living room") &&
      (clean.includes("light") || clean.includes("lights"))
    ) {
      return {
        text: "Scheduled: Living room lights will turn ON at 7:00 PM.",
        actionTaken: true,
      }
    }
    if (
      clean.includes("bedroom") &&
      (clean.includes("light") || clean.includes("lights"))
    ) {
      return {
        text: "Scheduled: Bedroom lights will turn OFF at 11:00 PM.",
        actionTaken: true,
      }
    }
    if (/\bac\b|air condition|climate|temperature/i.test(clean)) {
      return {
        text: "Scheduled: AC climate will turn ON at 6:00 PM.",
        actionTaken: true,
      }
    }
    return {
      text: "Scheduled your request successfully in the automations queue.",
      actionTaken: true,
    }
  }

  // 3. NAVIGATION COMMANDS
  if (
    clean === "open dashboard" ||
    clean === "go to dashboard" ||
    clean === "show dashboard"
  ) {
    onNavigate?.("dashboard")
    return { text: "Opening Dashboard...", actionTaken: true }
  }
  if (
    clean === "open rooms" ||
    clean === "go to rooms" ||
    clean === "show rooms"
  ) {
    onNavigate?.("rooms")
    return { text: "Opening Rooms overview...", actionTaken: true }
  }
  if (clean === "open devices" || clean === "go to devices") {
    onNavigate?.("devices")
    return { text: "Opening Devices manager...", actionTaken: true }
  }
  if (
    clean === "open security" ||
    clean === "go to security" ||
    clean === "show security"
  ) {
    onNavigate?.("security")
    return { text: "Opening Security control...", actionTaken: true }
  }
  if (
    clean === "open energy" ||
    clean === "go to energy" ||
    clean === "show energy"
  ) {
    onNavigate?.("energy")
    return { text: "Opening Energy analytics...", actionTaken: true }
  }
  if (
    clean === "open automation" ||
    clean === "open automations" ||
    clean === "go to automations"
  ) {
    onNavigate?.("automation")
    return { text: "Opening Automations...", actionTaken: true }
  }
  if (
    clean === "open notifications" ||
    clean === "show notifications" ||
    clean === "go to notifications"
  ) {
    onNavigate?.("notifications")
    return { text: "Opening Notifications...", actionTaken: true }
  }
  if (
    clean === "open profile" ||
    clean === "go to profile" ||
    clean === "show profile"
  ) {
    onNavigate?.("profile")
    return { text: "Opening User Profile...", actionTaken: true }
  }
  if (
    clean === "open settings" ||
    clean === "go to settings" ||
    clean === "show settings"
  ) {
    onNavigate?.("settings")
    return { text: "Opening Settings...", actionTaken: true }
  }

  // 4. ALL LIGHTS ON / OFF
  if (
    clean === "turn on all lights" ||
    clean === "switch on all lights" ||
    clean === "all lights on" ||
    clean === "turn on the lights" ||
    clean === "turn on lights"
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, on: true }),
    )
    return { text: "Done. All lights have been turned on.", actionTaken: true }
  }
  if (
    clean === "turn off all lights" ||
    clean === "switch off all lights" ||
    clean === "all lights off" ||
    clean === "turn off the lights" ||
    clean === "turn off lights"
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, on: false }),
    )
    return { text: "Done. All lights have been turned off.", actionTaken: true }
  }

  // 5. SPECIFIC ROOM LIGHTS
  // Living Room Light
  if (
    (clean.includes("living room") || clean.includes("living")) &&
    (clean.includes("light") || clean.includes("lights"))
  ) {
    const turnOn = clean.includes("on") || clean.includes("enable")
    const turnOff = clean.includes("off") || clean.includes("disable")
    if (turnOn && !turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("living") && d.type === "light",
        (d) => ({ ...d, on: true }),
      )
      return {
        text: "Done. Living room lights are turned on.",
        actionTaken: true,
      }
    }
    if (turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("living") && d.type === "light",
        (d) => ({ ...d, on: false }),
      )
      return {
        text: "Done. Living room lights are turned off.",
        actionTaken: true,
      }
    }
  }

  // Bedroom Light
  if (
    (clean.includes("bedroom") || clean.includes("bed room")) &&
    (clean.includes("light") ||
      clean.includes("lights") ||
      clean.includes("ceiling"))
  ) {
    const turnOn = clean.includes("on") || clean.includes("enable")
    const turnOff = clean.includes("off") || clean.includes("disable")
    if (turnOn && !turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("bedroom") && d.type === "light",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Bedroom lights are turned on.", actionTaken: true }
    }
    if (turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("bedroom") && d.type === "light",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Bedroom lights are turned off.", actionTaken: true }
    }
  }

  // Kitchen Light
  if (
    clean.includes("kitchen") &&
    (clean.includes("light") || clean.includes("lights"))
  ) {
    const turnOn = clean.includes("on") || clean.includes("enable")
    const turnOff = clean.includes("off") || clean.includes("disable")
    if (turnOn && !turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("kitchen") && d.type === "light",
        (d) => ({ ...d, on: true }),
      )
      const updatedRooms = rooms.map((r) =>
        r.name.toLowerCase().includes("kitchen") ? { ...r, lights: true } : r,
      )
      saveStoredRooms(updatedRooms)
      return { text: "Done. Kitchen lights are turned on.", actionTaken: true }
    }
    if (turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("kitchen") && d.type === "light",
        (d) => ({ ...d, on: false }),
      )
      const updatedRooms = rooms.map((r) =>
        r.name.toLowerCase().includes("kitchen") ? { ...r, lights: false } : r,
      )
      saveStoredRooms(updatedRooms)
      return { text: "Done. Kitchen lights are turned off.", actionTaken: true }
    }
  }

  // Garden Light
  if (
    clean.includes("garden") &&
    (clean.includes("light") || clean.includes("lights"))
  ) {
    const turnOn = clean.includes("on")
    const turnOff = clean.includes("off")
    if (turnOn && !turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("garden") && d.type === "light",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Garden light is turned on.", actionTaken: true }
    }
    if (turnOff) {
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("garden") && d.type === "light",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Garden light is turned off.", actionTaken: true }
    }
  }

  // 6. LIGHTING SCENES & DIMMING
  if (
    clean.includes("dim the lights") ||
    clean.includes("dim lights") ||
    clean.includes("dim the light")
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, brightness: 30 }),
    )
    return { text: "Done. Lights dimmed to 30% brightness.", actionTaken: true }
  }
  if (
    clean.includes("brighten the lights") ||
    clean.includes("brighten lights") ||
    clean === "brighten"
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, brightness: 100, on: true }),
    )
    return { text: "Done. Lights set to 100% brightness.", actionTaken: true }
  }
  if (
    clean.includes("50%") ||
    clean.includes("50 percent") ||
    clean.includes("to 50")
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, brightness: 50, on: true }),
    )
    return { text: "Done. Lights set to 50% brightness.", actionTaken: true }
  }
  if (
    clean.includes("100%") ||
    clean.includes("100 percent") ||
    clean.includes("to 100")
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, brightness: 100, on: true }),
    )
    return { text: "Done. Lights set to 100% brightness.", actionTaken: true }
  }

  // 7. APPLIANCES & PLUGS (Checked before AC regex to avoid substring collisions)
  if (clean.includes("washing machine") || clean.includes("washer")) {
    if (clean.includes("on") || clean.includes("start")) {
      updateDeviceWhere(
        (d) => d.type === "washer",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Washing Machine cycle started.", actionTaken: true }
    }
    if (clean.includes("off") || clean.includes("stop")) {
      updateDeviceWhere(
        (d) => d.type === "washer",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Washing Machine is turned off.", actionTaken: true }
    }
  }

  if (clean.includes("refrigerator") || clean.includes("fridge")) {
    if (clean.includes("on")) {
      updateDeviceWhere(
        (d) => d.type === "fridge",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Refrigerator is powered on.", actionTaken: true }
    }
    if (clean.includes("off")) {
      updateDeviceWhere(
        (d) => d.type === "fridge",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Refrigerator is turned off.", actionTaken: true }
    }
  }

  if (clean.includes("plug") || clean.includes("smart plug")) {
    if (clean.includes("on")) {
      updateDeviceWhere(
        (d) => d.type === "plug",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Smart plug is turned on.", actionTaken: true }
    }
    if (clean.includes("off")) {
      updateDeviceWhere(
        (d) => d.type === "plug",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Smart plug is turned off.", actionTaken: true }
    }
  }

  // 8. AC / CLIMATE CONTROL
  const tempMatch = clean.match(/(\d{2})\s*(?:°c|c|degrees|deg)?/)
  const isAcRelated =
    /\bac\b|climate|thermostat|air condition/i.test(clean) ||
    clean.includes("temp") ||
    clean.includes("degrees") ||
    clean.includes("°c") ||
    clean.includes("cooler") ||
    clean.includes("warmer")

  if (isAcRelated) {
    // Increase / decrease
    if (
      clean.includes("increase") ||
      clean.includes("raise") ||
      clean.includes("warmer") ||
      clean.includes("turn up")
    ) {
      let newTemp = 23
      updateDeviceWhere(
        (d) => d.type === "ac",
        (d) => {
          newTemp = (d.temp || 22) + 1
          return { ...d, temp: newTemp, on: true }
        },
      )
      return {
        text: `Done. Increased temperature to ${newTemp}°C.`,
        actionTaken: true,
      }
    }
    if (
      clean.includes("decrease") ||
      clean.includes("lower") ||
      clean.includes("cooler") ||
      clean.includes("turn down")
    ) {
      let newTemp = 21
      updateDeviceWhere(
        (d) => d.type === "ac",
        (d) => {
          newTemp = (d.temp || 22) - 1
          return { ...d, temp: newTemp, on: true }
        },
      )
      return {
        text: `Done. Decreased temperature to ${newTemp}°C.`,
        actionTaken: true,
      }
    }

    // Bedroom AC
    if (clean.includes("bedroom") && tempMatch) {
      const targetTemp = parseInt(tempMatch[1], 10)
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("bedroom") && d.type === "ac",
        (d) => ({ ...d, temp: targetTemp, on: true }),
      )
      const updatedRooms = rooms.map((r) =>
        r.name.toLowerCase().includes("bedroom")
          ? { ...r, temp: targetTemp, ac: true }
          : r,
      )
      saveStoredRooms(updatedRooms)
      return {
        text: `Done. Bedroom AC is set to ${targetTemp}°C.`,
        actionTaken: true,
      }
    }

    // Living Room AC
    if (clean.includes("living") && tempMatch) {
      const targetTemp = parseInt(tempMatch[1], 10)
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("living") && d.type === "ac",
        (d) => ({ ...d, temp: targetTemp, on: true }),
      )
      const updatedRooms = rooms.map((r) =>
        r.name.toLowerCase().includes("living")
          ? { ...r, temp: targetTemp, ac: true }
          : r,
      )
      saveStoredRooms(updatedRooms)
      return {
        text: `Done. Living Room AC is set to ${targetTemp}°C.`,
        actionTaken: true,
      }
    }

    // Kitchen temperature target
    if (clean.includes("kitchen") && tempMatch) {
      const targetTemp = parseInt(tempMatch[1], 10)
      const updatedRooms = rooms.map((r) =>
        r.name.toLowerCase().includes("kitchen")
          ? { ...r, temp: targetTemp }
          : r,
      )
      saveStoredRooms(updatedRooms)
      return {
        text: `Done. Kitchen temperature set to ${targetTemp}°C.`,
        actionTaken: true,
      }
    }

    // Generic AC temperature target ("Set AC to 24 degrees", "Set climate to 22 degrees")
    if (
      tempMatch &&
      (clean.includes("set") || clean.includes("to") || clean.includes("make"))
    ) {
      const targetTemp = parseInt(tempMatch[1], 10)
      updateDeviceWhere(
        (d) => d.type === "ac",
        (d) => ({ ...d, temp: targetTemp, on: true }),
      )
      return {
        text: `Done. AC climate is set to ${targetTemp}°C.`,
        actionTaken: true,
      }
    }

    // Turn ON / OFF AC
    if (
      clean.includes("turn on") ||
      clean.includes("switch on") ||
      clean.includes("ac on") ||
      clean.includes("air conditioning on")
    ) {
      updateDeviceWhere(
        (d) => d.type === "ac",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. AC units are turned on.", actionTaken: true }
    }
    if (
      clean.includes("turn off") ||
      clean.includes("switch off") ||
      clean.includes("ac off") ||
      clean.includes("air conditioning off")
    ) {
      updateDeviceWhere(
        (d) => d.type === "ac",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. AC units are turned off.", actionTaken: true }
    }
  }

  // 9. FANS
  if (clean.includes("fan")) {
    const isLiving = clean.includes("living")
    const isBedroom = clean.includes("bedroom")
    const isOffice = clean.includes("office")
    const isKitchen = clean.includes("kitchen")
    const turnOn = clean.includes("on") || clean.includes("start")
    const turnOff = clean.includes("off") || clean.includes("stop")

    if (isLiving) {
      if (turnOn && !turnOff) {
        updateDeviceWhere(
          (d) => d.room.toLowerCase().includes("living") && d.type === "fan",
          (d) => ({ ...d, on: true, speed: 3 }),
        )
        return {
          text: "Done. Living room fan is turned on.",
          actionTaken: true,
        }
      }
      if (turnOff) {
        updateDeviceWhere(
          (d) => d.room.toLowerCase().includes("living") && d.type === "fan",
          (d) => ({ ...d, on: false, speed: 0 }),
        )
        return {
          text: "Done. Living room fan is turned off.",
          actionTaken: true,
        }
      }
    }

    if (isBedroom) {
      if (turnOn && !turnOff) {
        updateDeviceWhere(
          (d) => d.room.toLowerCase().includes("bedroom") && d.type === "fan",
          (d) => ({ ...d, on: true, speed: 3 }),
        )
        return { text: "Done. Bedroom fan is turned on.", actionTaken: true }
      }
      if (turnOff) {
        updateDeviceWhere(
          (d) => d.room.toLowerCase().includes("bedroom") && d.type === "fan",
          (d) => ({ ...d, on: false, speed: 0 }),
        )
        return { text: "Done. Bedroom fan is turned off.", actionTaken: true }
      }
    }

    if (isKitchen) {
      if (turnOn && !turnOff) {
        updateDeviceWhere(
          (d) => d.name.toLowerCase().includes("kitchen fan"),
          (d) => ({ ...d, on: true, speed: 3 }),
        )
        return { text: "Done. Kitchen fan is turned on.", actionTaken: true }
      }
      if (turnOff) {
        updateDeviceWhere(
          (d) => d.name.toLowerCase().includes("kitchen fan"),
          (d) => ({ ...d, on: false, speed: 0 }),
        )
        return { text: "Done. Kitchen fan is turned off.", actionTaken: true }
      }
    }

    if (isOffice) {
      if (turnOn && !turnOff) {
        updateDeviceWhere(
          (d) => d.name.toLowerCase().includes("office fan"),
          (d) => ({ ...d, on: true, speed: 3 }),
        )
        return { text: "Done. Office fan is turned on.", actionTaken: true }
      }
      if (turnOff) {
        updateDeviceWhere(
          (d) => d.name.toLowerCase().includes("office fan"),
          (d) => ({ ...d, on: false, speed: 0 }),
        )
        return { text: "Done. Office fan is turned off.", actionTaken: true }
      }
    }

    if (turnOn && !turnOff) {
      updateDeviceWhere(
        (d) => d.type === "fan",
        (d) => ({ ...d, on: true, speed: 3 }),
      )
      return { text: "Done. Fans are turned on.", actionTaken: true }
    }
    if (turnOff) {
      updateDeviceWhere(
        (d) => d.type === "fan",
        (d) => ({ ...d, on: false, speed: 0 }),
      )
      return { text: "Done. Fans are turned off.", actionTaken: true }
    }
  }

  // 10. TV / ENTERTAINMENT & MOVIE MODE
  if (clean.includes("movie mode") || clean.includes("movie night")) {
    if (
      clean.includes("start") ||
      clean.includes("enable") ||
      clean.includes("turn on")
    ) {
      updateDeviceWhere(
        (d) => d.type === "tv",
        (d) => ({ ...d, on: true }),
      )
      updateDeviceWhere(
        (d) => d.type === "light",
        (d) => ({ ...d, brightness: 30, on: true }),
      )
      updateDeviceWhere(
        (d) => d.room.toLowerCase().includes("living") && d.type === "ac",
        (d) => ({ ...d, temp: 22, on: true }),
      )
      const updatedAutos = automations.map((a) =>
        a.name.toLowerCase().includes("movie") ? { ...a, active: true } : a,
      )
      saveStoredAutomations(updatedAutos)
      return {
        text: "Movie Mode started. TV is on, lights dimmed to 30%, and AC set to 22°C.",
        actionTaken: true,
      }
    }
    if (
      clean.includes("stop") ||
      clean.includes("disable") ||
      clean.includes("turn off") ||
      clean.includes("end")
    ) {
      const updatedAutos = automations.map((a) =>
        a.name.toLowerCase().includes("movie") ? { ...a, active: false } : a,
      )
      saveStoredAutomations(updatedAutos)
      return {
        text: "Movie Mode stopped. Restored normal lighting and settings.",
        actionTaken: true,
      }
    }
  }

  if (clean.includes("tv") || clean.includes("television")) {
    if (clean.includes("on")) {
      updateDeviceWhere(
        (d) => d.type === "tv",
        (d) => ({ ...d, on: true }),
      )
      return { text: "Done. Samsung TV is turned on.", actionTaken: true }
    }
    if (clean.includes("off")) {
      updateDeviceWhere(
        (d) => d.type === "tv",
        (d) => ({ ...d, on: false }),
      )
      return { text: "Done. Samsung TV is turned off.", actionTaken: true }
    }
  }

  // 11. SECURITY COMMANDS
  if (
    clean.includes("disarm security") ||
    clean === "disarm" ||
    clean === "disarm system"
  ) {
    const nextSec = { ...security, armed: false }
    saveStoredSecurity(nextSec)
    return { text: "Security system is now DISARMED.", actionTaken: true }
  }
  if (
    clean.includes("arm security") ||
    clean === "arm" ||
    clean === "arm system"
  ) {
    const nextSec = { ...security, armed: true }
    saveStoredSecurity(nextSec)
    return {
      text: "Security system is now ARMED. All boundary sensors and perimeter alerts are active.",
      actionTaken: true,
    }
  }
  if (
    clean.includes("lock all doors") ||
    clean.includes("lock all door") ||
    clean === "lock doors"
  ) {
    const nextSec = {
      ...security,
      doors: security.doors.map((d) => ({
        ...d,
        locked: true,
        lastAction: "Just now",
        who: "AI Assistant",
      })),
    }
    saveStoredSecurity(nextSec)
    return {
      text: "Done. All 4 doors and gates are now locked.",
      actionTaken: true,
    }
  }
  if (clean.includes("unlock") && clean.includes("front door")) {
    const nextSec = {
      ...security,
      doors: security.doors.map((d) =>
        d.name.toLowerCase().includes("front")
          ? { ...d, locked: false, lastAction: "Just now", who: "AI Assistant" }
          : d,
      ),
    }
    saveStoredSecurity(nextSec)
    return { text: "Front door has been unlocked.", actionTaken: true }
  }
  if (clean.includes("lock") && clean.includes("front door")) {
    const nextSec = {
      ...security,
      doors: security.doors.map((d) =>
        d.name.toLowerCase().includes("front")
          ? { ...d, locked: true, lastAction: "Just now", who: "AI Assistant" }
          : d,
      ),
    }
    saveStoredSecurity(nextSec)
    return { text: "Front door is now locked.", actionTaken: true }
  }
  if (
    clean.includes("are all doors locked") ||
    clean.includes("are doors locked") ||
    clean.includes("whether doors are locked") ||
    clean.includes("check if doors are locked") ||
    clean.includes("door status")
  ) {
    const allLocked = security.doors.every((d) => d.locked)
    if (allLocked) {
      return { text: "Yes, all 4 doors and gates are locked and secure." }
    } else {
      const unlocked = security.doors
        .filter((d) => !d.locked)
        .map((d) => d.name)
        .join(", ")
      return {
        text: `Front Door is locked, but ${unlocked} is currently unlocked.`,
      }
    }
  }
  if (
    clean.includes("is my home secure") ||
    clean.includes("is home secure") ||
    clean.includes("security status") ||
    clean.includes("what's my security status")
  ) {
    const statusStr = security.armed ? "ARMED" : "DISARMED"
    const doorsLocked = security.doors.filter((d) => d.locked).length
    return {
      text: `Security status is ${statusStr}. 4 cameras online, ${doorsLocked} of ${security.doors.length} doors locked, zero active intrusions.`,
    }
  }
  if (
    clean.includes("security alerts") ||
    clean.includes("security alert") ||
    clean.includes("show security alert")
  ) {
    return {
      text: "Recent Security Alerts: Motion detected in Backyard at 8:32 AM, Unknown visitor logged at 8:14 PM yesterday.",
    }
  }
  if (
    clean.includes("motion detected") ||
    clean.includes("any motion") ||
    clean.includes("motion detection") ||
    clean === "check motion"
  ) {
    return {
      text: "Motion was last detected by the Backyard camera 22 minutes ago. All interior zones are clear.",
    }
  }
  if (
    clean.includes("cameras online") ||
    clean.includes("camera status") ||
    clean.includes("are the cameras online") ||
    clean === "check cameras" ||
    clean === "check camera"
  ) {
    return {
      text: "All 4 security cameras (Front Door, Backyard, Garage, Living Room) are online with active streams.",
    }
  }

  // 12. DEVICES / STATUS QUERIES
  if (
    clean.includes("what devices are on") ||
    clean.includes("devices that are on") ||
    clean.includes("which devices are on")
  ) {
    const active = devices.filter((d) => d.on).map((d) => d.name)
    return {
      text: `Currently active devices (${active.length}): ${active.join(", ")}.`,
    }
  }
  if (
    clean.includes("what devices are off") ||
    clean.includes("devices that are off") ||
    clean.includes("which devices are off")
  ) {
    const inactive = devices.filter((d) => !d.on).map((d) => d.name)
    return {
      text: `Currently off (${inactive.length}): ${inactive.join(", ")}.`,
    }
  }
  if (
    clean.includes("how many devices are online") ||
    clean.includes("devices online")
  ) {
    return {
      text: `12 out of 12 devices are online and connected to your smart home mesh.`,
    }
  }
  if (
    clean.includes("what's on in the living room") ||
    clean.includes("what is on in the living room")
  ) {
    const lr = devices.filter((d) => d.room.toLowerCase().includes("living"))
    const lrActive = lr
      .filter((d) => d.on)
      .map((d) => d.name)
      .join(", ")
    return {
      text: `In the Living Room, active devices are: ${lrActive || "None"}.`,
    }
  }
  if (
    clean.includes("what's on in the bedroom") ||
    clean.includes("what is on in the bedroom")
  ) {
    const br = devices.filter((d) => d.room.toLowerCase().includes("bedroom"))
    const brActive = br
      .filter((d) => d.on)
      .map((d) => d.name)
      .join(", ")
    return {
      text: `In the Bedroom, active devices are: ${brActive || "None"}.`,
    }
  }
  if (
    clean.includes("what's on in the kitchen") ||
    clean.includes("what is on in the kitchen")
  ) {
    const k = devices.filter((d) => d.room.toLowerCase().includes("kitchen"))
    const kActive = k
      .filter((d) => d.on)
      .map((d) => d.name)
      .join(", ")
    return { text: `In the Kitchen, active devices are: ${kActive || "None"}.` }
  }
  if (
    clean.includes("living room devices") ||
    clean.includes("show living room")
  ) {
    const lr = devices
      .filter((d) => d.room.toLowerCase().includes("living"))
      .map((d) => `${d.name} (${d.on ? "ON" : "OFF"})`)
    return { text: `Living Room devices: ${lr.join(", ")}.` }
  }
  if (clean.includes("bedroom devices") || clean.includes("show bedroom")) {
    const br = devices
      .filter((d) => d.room.toLowerCase().includes("bedroom"))
      .map((d) => `${d.name} (${d.on ? "ON" : "OFF"})`)
    return { text: `Bedroom devices: ${br.join(", ")}.` }
  }
  if (clean.includes("kitchen devices") || clean.includes("show kitchen")) {
    const k = devices
      .filter((d) => d.room.toLowerCase().includes("kitchen"))
      .map((d) => `${d.name} (${d.on ? "ON" : "OFF"})`)
    return { text: `Kitchen devices: ${k.join(", ")}.` }
  }
  if (
    clean === "show my devices" ||
    clean === "show devices" ||
    clean === "my devices" ||
    clean === "list devices" ||
    clean === "check device status" ||
    clean === "check devices"
  ) {
    const names = devices
      .map((d) => d.name)
      .slice(0, 8)
      .join(", ")
    return {
      text: `You have 12 devices registered across 6 rooms (${names}, etc.).`,
    }
  }

  // 13. ROOMS QUERIES
  if (
    clean === "show my rooms" ||
    clean === "show rooms" ||
    clean === "list rooms"
  ) {
    const roomList = rooms.map((r) => `${r.name} (${r.temp}°C)`).join(", ")
    return { text: `You have 7 rooms configured: ${roomList}.` }
  }
  if (clean.includes("room status") || clean === "check rooms") {
    const roomStatus = rooms
      .map(
        (r) =>
          `${r.name}: ${r.activeDevices}/${r.devices} devices on, ${r.temp}°C`,
      )
      .join("; ")
    return { text: `Room status: ${roomStatus}.` }
  }
  if (
    clean.includes("temperature in the living room") ||
    clean.includes("living room temperature") ||
    clean.includes("living room temp")
  ) {
    const lr = rooms.find((r) => r.name.toLowerCase().includes("living"))
    return {
      text: `The Living Room temperature is currently ${
        lr ? lr.temp : 22
      }°C with 48% humidity.`,
    }
  }
  if (
    clean.includes("temperature in the bedroom") ||
    clean.includes("bedroom temperature") ||
    clean.includes("bedroom temp")
  ) {
    const br = rooms.find((r) => r.name.toLowerCase().includes("bedroom"))
    return {
      text: `The Bedroom temperature is currently ${
        br ? br.temp : 21
      }°C with 52% humidity.`,
    }
  }
  if (
    clean.includes("temperature in the kitchen") ||
    clean.includes("kitchen temperature") ||
    clean.includes("kitchen temp")
  ) {
    const k = rooms.find((r) => r.name.toLowerCase().includes("kitchen"))
    return {
      text: `The Kitchen temperature is currently ${
        k ? k.temp : 24
      }°C with 60% humidity.`,
    }
  }
  if (
    clean.includes("anyone in the living room") ||
    clean.includes("living room occupancy") ||
    clean.includes("someone in the living room")
  ) {
    return {
      text: "No active motion detected in the Living Room. Room is clear.",
    }
  }
  if (
    clean.includes("anyone in the bedroom") ||
    clean.includes("bedroom occupancy") ||
    clean.includes("someone in the bedroom")
  ) {
    return {
      text: "Bedroom occupancy sensor reports clear. No motion detected.",
    }
  }

  // 14. ENERGY QUERIES
  if (
    clean.includes("energy right now") ||
    clean.includes("usage right now") ||
    clean.includes("current energy") ||
    clean.includes("current power")
  ) {
    const currentLoad = devices
      .filter((d) => d.on)
      .reduce((total, device) => total + device.energy, 0)
    const primaryLoad = devices
      .filter((d) => d.on)
      .sort((a, b) => b.energy - a.energy)
      .slice(0, 2)
      .map((d) => `${d.name} (${d.energy} kW)`)
      .join(" and ")
    return {
      text: `Right now your power consumption is ${currentLoad.toFixed(2)} kW. Primary load is ${primaryLoad || "none"}.`,
    }
  }
  if (
    clean.includes("energy did i use today") ||
    clean.includes("today energy") ||
    clean.includes("today's energy") ||
    clean.includes("energy today")
  ) {
    return {
      text: "You have consumed 18.4 kWh today (estimated cost: ₹142.50), which is 12% lower than yesterday.",
    }
  }
  if (
    clean.includes("energy did i use yesterday") ||
    clean.includes("yesterday energy") ||
    clean.includes("energy yesterday")
  ) {
    return { text: "Yesterday total energy consumption was 20.9 kWh." }
  }
  if (
    clean.includes("peak demand") ||
    clean.includes("peak energy") ||
    clean.includes("peak power")
  ) {
    return { text: "Your peak demand today was 3.2 kW at 6:00 PM." }
  }
  if (
    clean.includes("monthly energy cost") ||
    clean.includes("monthly cost") ||
    clean.includes("energy bill")
  ) {
    return {
      text: "Your projected monthly energy cost is ₹4,280 (down 8% compared to last month).",
    }
  }
  if (clean.includes("carbon footprint") || clean.includes("carbon")) {
    return {
      text: "Your estimated carbon footprint this month is 182 kg CO2e, 14% below the regional average.",
    }
  }
  if (
    clean.includes("more energy today") ||
    clean.includes("using more energy")
  ) {
    return {
      text: "No, your energy usage today is 12% lower compared to yesterday at this time.",
    }
  }
  if (
    clean.includes("energy usage") ||
    clean.includes("energy consumption") ||
    clean.includes("power usage")
  ) {
    return {
      text: "Energy summary: Current load is 2.4 kW, 18.4 kWh consumed today, efficiency is down 12% vs yesterday.",
    }
  }

  // 15. AUTOMATION COMMANDS
  if (
    clean.includes("show my automations") ||
    clean.includes("show automations") ||
    clean.includes("list automations")
  ) {
    const automationList = automations
      .map((a) => `${a.name} (${a.active ? "enabled" : "disabled"})`)
      .join(", ")
    return { text: `Configured automations: ${automationList}.` }
  }
  if (
    clean.includes("what automations are active") ||
    clean.includes("active automations")
  ) {
    const activeList = automations
      .filter((a) => a.active)
      .map((a) => a.name)
      .join(", ")
    return {
      text: `Active automations: ${activeList || "Good Morning, Leave Home, Good Night"}.`,
    }
  }
  if (clean.includes("start good morning") || clean === "run good morning") {
    updateDeviceWhere(
      (d) => d.room.toLowerCase().includes("kitchen") && d.type === "light",
      (d) => ({ ...d, on: true }),
    )
    updateDeviceWhere(
      (d) => d.room.toLowerCase().includes("living") && d.type === "ac",
      (d) => ({ ...d, temp: 24, on: true }),
    )
    saveStoredSecurity({ ...security, armed: false })
    return {
      text: "Good Morning routine started: Kitchen lights on, AC set to 24°C, and security disarmed.",
      actionTaken: true,
    }
  }
  if (
    clean.includes("start good night") ||
    clean === "run good night" ||
    clean === "good night routine"
  ) {
    updateDeviceWhere(
      (d) => d.type === "light",
      (d) => ({ ...d, on: false }),
    )
    updateDeviceWhere(
      (d) => d.type === "ac",
      (d) => ({ ...d, temp: 21, on: true }),
    )
    const nextSec = {
      ...security,
      armed: true,
      doors: security.doors.map((d) => ({ ...d, locked: true })),
    }
    saveStoredSecurity(nextSec)
    return {
      text: "Good Night routine started: All lights turned off, all doors locked, AC set to 21°C, and security armed.",
      actionTaken: true,
    }
  }
  if (clean.includes("enable good morning")) {
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase().includes("morning") ? { ...a, active: true } : a,
    )
    saveStoredAutomations(updatedAutos)
    return {
      text: "Good Morning automation is now ENABLED.",
      actionTaken: true,
    }
  }
  if (clean.includes("disable good morning")) {
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase().includes("morning") ? { ...a, active: false } : a,
    )
    saveStoredAutomations(updatedAutos)
    return {
      text: "Good Morning automation is now DISABLED.",
      actionTaken: true,
    }
  }
  if (clean.includes("enable good night")) {
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase().includes("night") ? { ...a, active: true } : a,
    )
    saveStoredAutomations(updatedAutos)
    return { text: "Good Night automation is now ENABLED.", actionTaken: true }
  }
  if (clean.includes("disable good night")) {
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase().includes("night") ? { ...a, active: false } : a,
    )
    saveStoredAutomations(updatedAutos)
    return { text: "Good Night automation is now DISABLED.", actionTaken: true }
  }
  const automationToggle = clean.match(
    /\b(enable|disable)\s+(.+?)\s+automation\b/,
  )
  if (automationToggle) {
    const enabled = automationToggle[1] === "enable"
    const name = automationToggle[2].trim()
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase() === name.toLowerCase()
        ? { ...a, active: enabled }
        : a,
    )
    if (
      updatedAutos.some((a, index) => a.active !== automations[index].active)
    ) {
      saveStoredAutomations(updatedAutos)
      return {
        text: `${name} automation is now ${enabled ? "ENABLED" : "DISABLED"}.`,
        actionTaken: true,
      }
    }
  }
  const shortAutomationToggle = clean.match(/\b(enable|disable)\s+(.+?)$/)
  if (shortAutomationToggle) {
    const enabled = shortAutomationToggle[1] === "enable"
    const name = shortAutomationToggle[2].trim()
    const updatedAutos = automations.map((a) =>
      a.name.toLowerCase() === name.toLowerCase()
        ? { ...a, active: enabled }
        : a,
    )
    if (
      updatedAutos.some((a, index) => a.active !== automations[index].active)
    ) {
      saveStoredAutomations(updatedAutos)
      return {
        text: `${name} automation is now ${enabled ? "ENABLED" : "DISABLED"}.`,
        actionTaken: true,
      }
    }
  }

  // 16. GENERAL QUESTIONS & GREETINGS
  if (clean === "good morning") {
    return {
      text: "Good morning, USER! It's 24°C outside with light clouds. Your home is all secure. What can I help you with?",
    }
  }
  if (
    clean === "hello" ||
    clean === "hi" ||
    clean === "hey" ||
    clean === "good evening" ||
    clean === "good afternoon"
  ) {
    return {
      text: "Hello USER! All systems are normal. What can I assist you with today?",
    }
  }
  if (
    clean === "what can you do" ||
    clean === "help" ||
    clean === "give me some commands" ||
    clean === "commands"
  ) {
    return {
      text: "I can control lights, AC, climate, fans, TV, and appliances, lock/arm security, report energy usage, trigger automations, schedule actions, and navigate pages. Try saying 'Turn off living room lights' or 'Set AC to 22°C'.",
    }
  }
  if (clean.includes("weather")) {
    return {
      text: "It's currently 24°C in Mumbai with partly cloudy skies and 68% humidity. Perfect weather today!",
    }
  }
  if (
    clean.includes("temperature") ||
    clean.includes("what's the temperature")
  ) {
    return {
      text: "Outdoor temperature is 24°C. Indoor average is 22.5°C (Living Room 22°C, Bedroom 21°C, Kitchen 24°C).",
    }
  }
  if (
    clean.includes("how is my home") ||
    clean.includes("is everything okay") ||
    clean.includes("home summary") ||
    clean.includes("status summary")
  ) {
    return {
      text: "Everything is running smoothly! 12 devices connected, security is Armed, all doors locked, current energy load is 2.4 kW, and indoor climate is comfortable at 22°C.",
    }
  }

  // 17. UNKNOWN COMMAND FALLBACK (as strictly requested)
  return {
    text: "I couldn't find that device or action. Try asking me about lights, AC, security, energy, devices, rooms, or automations.",
    actionTaken: false,
  }
}
