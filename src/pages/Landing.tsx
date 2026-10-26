import React, { useEffect, useRef, useState } from "react"
import {
  Activity,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Cpu,
  DoorOpen,
  Droplets,
  Flame,
  Home,
  Layers,
  Lightbulb,
  Lock,
  Menu,
  Play,
  Radio,
  Search,
  Shield,
  Sparkles,
  Star,
  Wind,
  X,
  Zap,
} from "lucide-react"
import type { Page } from "../App"
import roomLiving from "../Assets/room.png"
import roomBedroom from "../Assets/room5.jpg"
import roomKitchen from "../Assets/kitchen.jpg"
import roomBathroom from "../Assets/bathroom.jpg"
import garden from "../Assets/garden.jpg"

interface Props {
  onNavigate: (p: Page) => void
}

/* ---------------- DATA DEFINITIONS ---------------- */

const solutions = [
  {
    title: "Intelligent Lighting",
    desc: "Control lights, brightness, and schedules",
    icon: <Lightbulb size={18} />,
    color: "#FF9F0A",
    target: "devices" as Page,
  },
  {
    title: "Climate Control",
    desc: "Manage AC, fans, and room temperature",
    icon: <Wind size={18} />,
    color: "#007AFF",
    target: "devices" as Page,
  },
  {
    title: "Smart Device Control",
    desc: "Control connected home appliances",
    icon: <Cpu size={18} />,
    color: "#34C759",
    target: "devices" as Page,
  },
  {
    title: "Home Security",
    desc: "Manage locks, sensors, and security status",
    icon: <Lock size={18} />,
    color: "#FF3B30",
    target: "security" as Page,
  },
  {
    title: "Surveillance",
    desc: "Monitor cameras and security devices",
    icon: <Camera size={18} />,
    color: "#AF52DE",
    target: "security" as Page,
  },
  {
    title: "Voice & Interactive Control",
    desc: "Control your home through voice and the app",
    icon: <Sparkles size={18} />,
    color: "#5AC8FA",
    target: "dashboard" as Page,
  },
  {
    title: "Protection",
    desc: "Monitor smoke, gas, and water-leak sensors",
    icon: <Shield size={18} />,
    color: "#FF9F0A",
    target: "security" as Page,
  },
  {
    title: "Energy Efficiency",
    desc: "Track energy usage and reduce waste",
    icon: <Zap size={18} />,
    color: "#34C759",
    target: "energy" as Page,
  },
]

const products = [
  {
    title: "Smart Lights",
    desc: "Bulbs, ambient lighting, and switches",
    icon: <Lightbulb size={18} />,
    color: "#FF9F0A",
    target: "devices" as Page,
  },
  {
    title: "Smart Locks",
    desc: "Door access, biometrics, and security",
    icon: <Lock size={18} />,
    color: "#34C759",
    target: "security" as Page,
  },
  {
    title: "Smart Cameras",
    desc: "2K home surveillance & live video feeds",
    icon: <Camera size={18} />,
    color: "#007AFF",
    target: "security" as Page,
  },
  {
    title: "Sensors",
    desc: "Motion, door, and presence detection",
    icon: <Radio size={18} />,
    color: "#AF52DE",
    target: "security" as Page,
  },
  {
    title: "Smart Plugs",
    desc: "Control connected appliances & loads",
    icon: <Zap size={18} />,
    color: "#5AC8FA",
    target: "devices" as Page,
  },
  {
    title: "Smart Hubs",
    desc: "Central local hub for all smart devices",
    icon: <Cpu size={18} />,
    color: "#FF3B30",
    target: "dashboard" as Page,
  },
]

const locations = [
  {
    title: "Living Room",
    desc: "6 connected devices · 22°C",
    icon: <Home size={18} />,
    target: "rooms" as Page,
  },
  {
    title: "Bedroom",
    desc: "4 connected devices · Night mode",
    icon: <DoorOpen size={18} />,
    target: "rooms" as Page,
  },
  {
    title: "Kitchen",
    desc: "5 connected devices · Sensors active",
    icon: <Flame size={18} />,
    target: "rooms" as Page,
  },
  {
    title: "Bathroom",
    desc: "3 connected devices · Humidity safe",
    icon: <Droplets size={18} />,
    target: "rooms" as Page,
  },
  {
    title: "All Rooms",
    desc: "Explore all 6 spaces across your home",
    icon: <Layers size={18} />,
    target: "rooms" as Page,
  },
]

const showcaseDevices = [
  {
    id: "1",
    name: "Smart Ambient Light",
    category: "Lighting",
    popular: true,
    status: "Active · 80%",
    color: "#FF9F0A",
    icon: <Lightbulb size={22} />,
    desc: "Tunable warm-to-cool LED with scene sync and daylight curves.",
    target: "devices" as Page,
  },
  {
    id: "2",
    name: "Smart Deadbolt Lock",
    category: "Security",
    popular: true,
    status: "Locked · Secure",
    color: "#34C759",
    icon: <Lock size={22} />,
    desc: "Biometric and remote-access door lock with activity logs.",
    target: "security" as Page,
  },
  {
    id: "3",
    name: "2K HDR Security Camera",
    category: "Security",
    popular: true,
    status: "Live · 1080p",
    color: "#007AFF",
    icon: <Camera size={22} />,
    desc: "Wide-angle feed with AI presence detection and night vision.",
    target: "security" as Page,
  },
  {
    id: "4",
    name: "Smart AC Climate Hub",
    category: "Climate",
    popular: true,
    status: "Cooling · 22°C",
    color: "#5AC8FA",
    icon: <Wind size={22} />,
    desc: "Precision temperature & humidity control with automated schedules.",
    target: "devices" as Page,
  },
  {
    id: "5",
    name: "PIR Motion Sensor",
    category: "Sensors",
    popular: false,
    status: "Armed · Clear",
    color: "#AF52DE",
    icon: <Radio size={22} />,
    desc: "Instant presence detection with 120° coverage and zero latency.",
    target: "security" as Page,
  },
  {
    id: "6",
    name: "Water Leak Sensor",
    category: "Sensors",
    popular: false,
    status: "Dry · Safe",
    color: "#34C759",
    icon: <Droplets size={22} />,
    desc: "Sub-second moisture detection with instant push alarms.",
    target: "security" as Page,
  },
  {
    id: "7",
    name: "High-Current Smart Plug",
    category: "Energy",
    popular: true,
    status: "Online · 18W",
    color: "#FF9F0A",
    icon: <Zap size={22} />,
    desc: "Appliance power monitoring, auto-cutoff, and surge protection.",
    target: "energy" as Page,
  },
  {
    id: "8",
    name: "Home Energy Gateway",
    category: "Energy",
    popular: false,
    status: "18.4 kWh today",
    color: "#34C759",
    icon: <Activity size={22} />,
    desc: "Whole-home real-time energy metering and cost forecasting.",
    target: "energy" as Page,
  },
  {
    id: "9",
    name: "Smart Ceiling Fan",
    category: "Climate",
    popular: false,
    status: "Speed 3 · Auto",
    color: "#5AC8FA",
    icon: <Wind size={22} />,
    desc: "Whisper-quiet automated circulation tied to room temperature.",
    target: "devices" as Page,
  },
]

const showcaseRooms = [
  {
    name: "Living Room",
    image: roomLiving,
    features: [
      "Smart lighting",
      "TV and appliance control",
      "Climate control",
      "Automation",
    ],
  },
  {
    name: "Bedroom",
    image: roomBedroom,
    features: [
      "Lighting schedules",
      "Climate control",
      "Motion sensors",
      "Curtain automation",
    ],
  },
  {
    name: "Kitchen",
    image: roomKitchen,
    features: [
      "Smart plugs",
      "Lighting",
      "Sensor monitoring",
      "Appliance control",
    ],
  },
  {
    name: "Bathroom",
    image: roomBathroom,
    features: [
      "Lighting",
      "Humidity monitoring",
      "Water-leak detection",
      "Water-heater control",
    ],
  },
]

const steps = [
  {
    number: "01",
    title: "Connect",
    text: "Bring every smart device into one calm, intelligent system.",
    icon: <Cpu />,
    visual: "Devices online",
    detail: "24+ devices connected",
    tone: "blue",
  },
  {
    number: "02",
    title: "Organize",
    text: "Arrange devices into rooms that make sense for the way you live.",
    icon: <Home />,
    visual: "Your spaces",
    detail: "Living room · Kitchen · Bedroom",
    tone: "green",
  },
  {
    number: "03",
    title: "Automate",
    text: "Create routines that quietly take care of the everyday.",
    icon: <Sparkles />,
    visual: "Morning routine",
    detail: "Lights on · Curtains open · AC 24°C",
    tone: "amber",
  },
  {
    number: "04",
    title: "Secure",
    text: "See what is happening and protect what matters, wherever you are.",
    icon: <Shield />,
    visual: "Home protected",
    detail: "4 cameras live · All doors locked",
    tone: "red",
  },
  {
    number: "05",
    title: "Optimize",
    text: "Understand your energy and make more thoughtful choices.",
    icon: <Zap />,
    visual: "Energy today",
    detail: "2.4 kWh · 12% less than yesterday",
    tone: "violet",
  },
]

const faqs = [
  [
    "What devices can SmartHome+ control?",
    "SmartHome+ brings lights, climate, appliances, cameras, locks, and Matter-compatible devices into one interface.",
  ],
  [
    "Can I automate multiple rooms?",
    "Yes. Build routines that span your whole home, or target one room with precise triggers and schedules.",
  ],
  [
    "How does the AI Assistant work?",
    "Ask in natural language and SmartHome+ translates your request into a safe, actionable home command.",
  ],
  [
    "Can I monitor energy consumption?",
    "Yes. View daily usage, peak demand, estimated cost, and carbon footprint from the Energy view.",
  ],
  [
    "Can multiple users access the home?",
    "Family members can use shared access while admins keep control of permissions and connected devices.",
  ],
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    quote:
      "SmartHome+ makes the whole house feel calmer. My routines run quietly in the background, and I always know what is happening.",
    initials: "SC",
    color: "#4A90E2",
  },
  {
    name: "Marcus Williams",
    role: "Software Engineer",
    quote:
      "The AI Assistant is genuinely useful. I can ask for what I need naturally and still keep precise control of every device.",
    initials: "MW",
    color: "#34C759",
  },
  {
    name: "Priya Nair",
    role: "Architect",
    quote:
      "I love how thoughtful the experience feels. From energy insights to security, SmartHome+ gives our home a better rhythm.",
    initials: "PN",
    color: "#FF9F0A",
  },
]

export default function Landing({ onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [usage, setUsage] = useState(8)
  const [hours, setHours] = useState(6)

  // Smartify-inspired interactive states
  const [openDropdown, setOpenDropdown] =
    useState<"solutions" | "products" | "locations" | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Popular")
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const navRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(
              Number((entry.target as HTMLElement).dataset.step ?? 0),
            )
          }
        })
      },
      { rootMargin: "-35% 0px -45% 0px" },
    )
    document
      .querySelectorAll<HTMLElement>(".landing-step")
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null)
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
    setOpenDropdown(null)
  }

  const cost = Math.round(usage * hours * 30 * 8.5)

  // Search collection aggregation
  const allSearchItems = [
    ...solutions.map((s) => ({
      title: s.title,
      desc: s.desc,
      category: "Solution",
      target: s.target,
    })),
    ...products.map((p) => ({
      title: p.title,
      desc: p.desc,
      category: "Product",
      target: p.target,
    })),
    ...locations.map((l) => ({
      title: l.title,
      desc: l.desc,
      category: "Room",
      target: l.target,
    })),
  ]

  const filteredSearchResults = searchQuery.trim()
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allSearchItems.slice(0, 6)

  const filteredDevices = showcaseDevices.filter((d) =>
    activeCategory === "Popular" ? d.popular : d.category === activeCategory,
  )

  return (
    <main
      className="landing-page"
      style={{ backgroundImage: `url(${roomLiving})` }}
    >
      {/* Search Modal */}
      {searchOpen && (
        <div
          className="landing-search-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false)
          }}
        >
          <div
            className="landing-search-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Search SmartHome+"
          >
            <div className="landing-search-bar">
              <Search size={20} color="#007AFF" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search solutions, devices, or rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
                aria-label="Close search"
              >
                <X size={18} color="#000000" />
              </button>
            </div>
            <div className="landing-search-results">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((res, idx) => (
                  <button
                    key={`${res.title}-${idx}`}
                    type="button"
                    className="search-result-item"
                    onClick={() => {
                      setSearchOpen(false)
                      onNavigate(res.target)
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          fontSize: 14,
                          color: "#000000",
                        }}
                      >
                        {res.title}
                      </strong>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#000000",
                          fontWeight: 500,
                        }}
                      >
                        {res.desc}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "rgba(0,122,255,0.08)",
                        color: "#007AFF",
                      }}
                    >
                      {res.category}
                    </span>
                  </button>
                ))
              ) : (
                <div style={{ padding: "36px 16px", textAlign: "center" }}>
                  <Search
                    size={32}
                    color="#000000"
                    style={{ margin: "0 auto 10px", opacity: 0.8 }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#000000",
                    }}
                  >
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: "#000000",
                      fontWeight: 500,
                    }}
                  >
                    Try searching for &ldquo;lighting&rdquo;,
                    &ldquo;security&rdquo;, &ldquo;camera&rdquo;, or
                    &ldquo;living room&rdquo;.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        ref={navRef}
        className={`landing-nav ${scrolled ? "is-scrolled" : ""}`}
      >
        {/* Brand */}
        <button
          type="button"
          className="landing-brand"
          onClick={() => scrollTo("home")}
          aria-label="SmartHome+ home"
        >
          <span className="brand-mark">
            <Home size={16} />
          </span>
          <span>
            SmartHome<span className="accent">+</span>
          </span>
        </button>

        {/* Desktop Nav Links with Dropdowns */}
        <div className={`landing-nav-links ${menuOpen ? "open" : ""}`}>
          {/* Solutions Dropdown */}
          <div
            className="landing-nav-item"
            onMouseEnter={() => setOpenDropdown("solutions")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`landing-dropdown-btn ${
                openDropdown === "solutions" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "solutions" ? null : "solutions",
                )
              }
              aria-haspopup="true"
              aria-expanded={openDropdown === "solutions"}
            >
              <span>Solutions</span>
              <ChevronDown size={14} className="chevron" />
            </button>
            {openDropdown === "solutions" && (
              <div
                className="landing-dropdown-panel solutions-panel"
                role="menu"
              >
                <div className="dropdown-col-2">
                  {solutions.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setOpenDropdown(null)
                        onNavigate(item.target)
                      }}
                      role="menuitem"
                    >
                      <div
                        className="dropdown-icon"
                        style={{ background: item.color }}
                      >
                        {item.icon}
                      </div>
                      <div className="dropdown-text">
                        <b>{item.title}</b>
                        <small>{item.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Dropdown */}
          <div
            className="landing-nav-item"
            onMouseEnter={() => setOpenDropdown("products")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`landing-dropdown-btn ${
                openDropdown === "products" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenDropdown(openDropdown === "products" ? null : "products")
              }
              aria-haspopup="true"
              aria-expanded={openDropdown === "products"}
            >
              <span>Products</span>
              <ChevronDown size={14} className="chevron" />
            </button>
            {openDropdown === "products" && (
              <div
                className="landing-dropdown-panel products-panel"
                role="menu"
              >
                <div className="dropdown-col-2">
                  {products.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setOpenDropdown(null)
                        onNavigate(item.target)
                      }}
                      role="menuitem"
                    >
                      <div
                        className="dropdown-icon"
                        style={{ background: item.color }}
                      >
                        {item.icon}
                      </div>
                      <div className="dropdown-text">
                        <b>{item.title}</b>
                        <small>{item.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button
                    type="button"
                    className="dropdown-footer-link"
                    onClick={() => {
                      setOpenDropdown(null)
                      onNavigate("devices")
                    }}
                  >
                    View All Products <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    className="dropdown-footer-link"
                    onClick={() => scrollTo("devices-showcase")}
                  >
                    Browse Categories <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Locations Dropdown */}
          <div
            className="landing-nav-item"
            onMouseEnter={() => setOpenDropdown("locations")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              className={`landing-dropdown-btn ${
                openDropdown === "locations" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "locations" ? null : "locations",
                )
              }
              aria-haspopup="true"
              aria-expanded={openDropdown === "locations"}
            >
              <span>Locations</span>
              <ChevronDown size={14} className="chevron" />
            </button>
            {openDropdown === "locations" && (
              <div
                className="landing-dropdown-panel locations-panel"
                role="menu"
              >
                <div
                  style={{
                    paddingBottom: 6,
                    marginBottom: 8,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#000000",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Rooms in Your Home
                  </span>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {locations.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setOpenDropdown(null)
                        onNavigate(item.target)
                      }}
                      role="menuitem"
                    >
                      <div
                        className="dropdown-icon"
                        style={{ background: "#007AFF" }}
                      >
                        {item.icon}
                      </div>
                      <div className="dropdown-text">
                        <b>{item.title}</b>
                        <small>{item.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side actions: Search + Auth */}
        <div className="landing-nav-actions">
          <button
            type="button"
            className="search-nav-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search dialog"
          >
            <Search size={14} />
            <span>Search</span>
          </button>
          <button
            type="button"
            className="nav-signin"
            onClick={() => onNavigate("auth")}
          >
            Sign in
          </button>
          <button
            type="button"
            className="landing-button small"
            onClick={() => onNavigate("auth")}
          >
            Get Started
          </button>
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="landing-hero landing-container">
        <div className="hero-copy reveal">
          <p className="eyebrow">
            <Sparkles size={14} /> INTELLIGENCE, BUILT IN
          </p>
          <h1>
            Your Home.
            <br />
            <em>Smarter Than Ever.</em>
          </h1>
          <p className="hero-text">
            Control every room, automate everyday routines, protect what
            matters, and understand your home&apos;s energy, all from one
            intelligent system.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="landing-button"
              onClick={() => onNavigate("auth")}
            >
              Get Started <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="landing-button ghost"
              onClick={() => scrollTo("ecosystem")}
            >
              <Play size={15} /> Explore Ecosystem
            </button>
          </div>
          <p className="hero-note">
            <Check size={14} /> Demo experience · no credit card required
          </p>
        </div>
        <DashboardPreview />
      </section>

      {/* Trust Strip */}
      <section className="trust-strip landing-container reveal">
        <div>
          <strong>6</strong>
          <span>Rooms connected</span>
        </div>
        <div>
          <strong>
            24<span className="accent">+</span>
          </strong>
          <span>Smart devices</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Security monitoring</span>
        </div>
        <div>
          <strong>∞</strong>
          <span>Automation possibilities</span>
        </div>
      </section>

      {/* NEW SECTION 1: Designed Around Your Home, Not Just Your Devices */}
      <section id="ecosystem" className="landing-container ecosystem-section">
        <div className="reveal">
          <p className="eyebrow">
            <Sparkles size={14} /> ECOSYSTEM ARCHITECTURE
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 4.5vw, 4.2rem)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              letterSpacing: "-0.04em",
              color: "#000000",
            }}
          >
            Designed Around Your Home,
            <br />
            <em style={{ color: "#1769d2", fontStyle: "normal" }}>
              Not Just Your Devices.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: "#000000",
              fontWeight: 500,
              maxWidth: 520,
              margin: "0 0 24px",
            }}
          >
            SmartHome+ brings your connected devices, rooms, security, energy
            usage, and automations together in one convenient place.
          </p>
          <div className="ecosystem-benefits">
            {[
              {
                title: "One place to monitor your connected home.",
                desc: "A unified living dashboard that harmonizes climate, lighting, and power in real-time.",
                icon: <Home size={18} />,
              },
              {
                title: "Automations that simplify everyday routines.",
                desc: "Intelligent triggers respond seamlessly to time of day, presence, and room schedules.",
                icon: <Sparkles size={18} />,
              },
              {
                title: "A clearer view of security and energy usage.",
                desc: "Stay informed with instant sensor timelines, live cameras, and carbon footprint telemetry.",
                icon: <Shield size={18} />,
              },
            ].map((b, i) => (
              <div key={i} className="ecosystem-benefit-card">
                <div className="ecosystem-benefit-icon">{b.icon}</div>
                <div>
                  <strong
                    style={{ color: "#000000", fontWeight: 700, fontSize: 14 }}
                  >
                    {b.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 13,
                      color: "#000000",
                      fontWeight: 500,
                      marginTop: 3,
                      display: "block",
                    }}
                  >
                    {b.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Ecosystem Illustration */}
        <div className="ecosystem-visual-wrap reveal">
          <svg
            className="ecosystem-svg-board"
            viewBox="0 0 460 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbitLineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1769d2" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6cc8e5" stopOpacity="0.35" />
              </linearGradient>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#007AFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#007AFF" stopOpacity="0.05" />
              </radialGradient>
              <linearGradient id="centerHubGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1769d2" />
                <stop offset="100%" stopColor="#007AFF" />
              </linearGradient>
            </defs>

            {/* Orbit background rings */}
            <circle
              cx="230"
              cy="230"
              r="170"
              stroke="rgba(23,105,210,0.18)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <circle
              cx="230"
              cy="230"
              r="110"
              stroke="rgba(23,105,210,0.22)"
              strokeWidth="1.5"
            />
            <circle cx="230" cy="230" r="70" fill="url(#hubGlow)" />

            {/* Radial Connection Lines */}
            {[
              { x: 230, y: 60 },
              { x: 377, y: 145 },
              { x: 377, y: 315 },
              { x: 230, y: 400 },
              { x: 83, y: 315 },
              { x: 83, y: 145 },
            ].map((pt, i) => (
              <line
                key={i}
                x1="230"
                y1="230"
                x2={pt.x}
                y2={pt.y}
                stroke="url(#orbitLineGrad)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            ))}

            {/* Central Hub: SmartHome+ */}
            <g
              transform="translate(185, 185)"
              style={{ cursor: "pointer" }}
              onClick={() => scrollTo("home")}
            >
              <circle
                cx="45"
                cy="45"
                r="45"
                fill="white"
                filter="drop-shadow(0 12px 28px rgba(23,105,210,0.22))"
                stroke="rgba(23,105,210,0.4)"
                strokeWidth="2"
              />
              <circle cx="45" cy="45" r="36" fill="url(#centerHubGrad)" />
              <foreignObject
                x="0"
                y="0"
                width="90"
                height="90"
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Home size={24} color="white" strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "white",
                      letterSpacing: "-0.2px",
                      marginTop: 3,
                    }}
                  >
                    SmartHome<span style={{ color: "#BFE5ED" }}>+</span>
                  </span>
                </div>
              </foreignObject>
            </g>

            {/* Surrounding Connected Nodes */}
            {[
              {
                name: "Lighting",
                sub: "Tunable scenes",
                x: 230,
                y: 60,
                icon: <Lightbulb size={24} color="#FF9F0A" strokeWidth={2.4} />,
                color: "#FF9F0A",
              },
              {
                name: "Security",
                sub: "Locks & feeds",
                x: 377,
                y: 145,
                icon: <Lock size={24} color="#FF3B30" strokeWidth={2.4} />,
                color: "#FF3B30",
              },
              {
                name: "Climate",
                sub: "Adaptive temp",
                x: 377,
                y: 315,
                icon: <Wind size={24} color="#007AFF" strokeWidth={2.4} />,
                color: "#007AFF",
              },
              {
                name: "Energy",
                sub: "Live analytics",
                x: 230,
                y: 400,
                icon: <Zap size={24} color="#34C759" strokeWidth={2.4} />,
                color: "#34C759",
              },
              {
                name: "Sensors",
                sub: "Motion & leak",
                x: 83,
                y: 315,
                icon: <Radio size={24} color="#AF52DE" strokeWidth={2.4} />,
                color: "#AF52DE",
              },
              {
                name: "Automation",
                sub: "On autopilot",
                x: 83,
                y: 145,
                icon: <Sparkles size={24} color="#06B6D4" strokeWidth={2.4} />,
                color: "#06B6D4",
              },
            ].map((node) => {
              const isHovered = hoveredNode === node.name
              return (
                <g
                  key={node.name}
                  transform={`translate(${node.x - 30}, ${node.y - 30})`}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={() => setHoveredNode(node.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx="30"
                    cy="30"
                    r={isHovered ? 33 : 29}
                    fill="white"
                    stroke={node.color}
                    strokeWidth={isHovered ? 3.5 : 2.5}
                    filter="drop-shadow(0 8px 20px rgba(0,0,0,0.12))"
                  />
                  <foreignObject
                    x="6"
                    y="6"
                    width="48"
                    height="48"
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {node.icon}
                    </div>
                  </foreignObject>
                  <text
                    x="30"
                    y="74"
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="13"
                    fontWeight="800"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {node.name}
                  </text>
                  <text
                    x="30"
                    y="89"
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                  >
                    {node.sub}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </section>

      {/* NEW SECTION 2: Devices for a Smarter Home */}
      <section
        id="devices-showcase"
        className="landing-container devices-showcase-section"
      >
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <Cpu size={14} /> CONNECTED HARDWARE
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: "0 0 14px",
              color: "#000000",
            }}
          >
            Devices for a Smarter Home.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#000000",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Explore devices natively integrated with SmartHome+ for real-time
            monitoring and automation.
          </p>
        </div>

        {/* Category Filters */}
        <div
          className="devices-filter-pills"
          style={{ justifyContent: "center" }}
        >
          {[
            "Popular",
            "Lighting",
            "Security",
            "Sensors",
            "Climate",
            "Energy",
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`device-filter-pill ${
                activeCategory === cat ? "is-active" : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Device Cards Grid */}
        <div className="device-cards-grid">
          {filteredDevices.map((d) => (
            <div key={d.id} className="device-card-item">
              <div className="device-card-top">
                <div
                  className="device-card-icon"
                  style={{ background: d.color }}
                >
                  {d.icon}
                </div>
                <span
                  className={`device-card-status ${
                    d.status.includes("Active") ||
                    d.status.includes("Locked") ||
                    d.status.includes("Cooling") ||
                    d.status.includes("Live") ||
                    d.status.includes("Online")
                      ? "on"
                      : "off"
                  }`}
                >
                  ● {d.status}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: d.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {d.category}
              </span>
              <h3
                style={{
                  margin: "4px 0 6px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#000000",
                }}
              >
                {d.name}
              </h3>
              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: 13,
                  color: "#000000",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {d.desc}
              </p>
              <button
                type="button"
                className="device-card-btn"
                onClick={() => onNavigate(d.target)}
              >
                <span>Explore Device</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#000000",
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          * Devices shown are simulated in the interactive SmartHome+
          environment.
        </p>
      </section>

      {/* NEW SECTION 3: Start With One Room, or Automate Your Whole Home */}
      <section
        id="rooms-showcase"
        className="landing-container rooms-showcase-section"
      >
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            <DoorOpen size={14} /> SPATIAL AUTOMATION
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: "0 0 14px",
              color: "#000000",
            }}
          >
            Start With One Room.
            <br />
            <em style={{ color: "#1769d2", fontStyle: "normal" }}>
              Make Your Whole Home Smarter.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#000000",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            Customize individual zones or link them seamlessly across
            whole-house scenes.
          </p>
        </div>

        {/* 4 Room Cards */}
        <div className="room-showcase-grid">
          {showcaseRooms.map((room) => (
            <div
              key={room.name}
              className="room-showcase-card"
              style={{ backgroundImage: `url(${room.image})` }}
              onClick={() => onNavigate("rooms")}
            >
              <div className="room-showcase-content">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#BFE5ED",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ROOM AUTOMATION
                </span>
                <h3
                  style={{
                    margin: "4px 0 8px",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {room.name}
                </h3>
                <div className="room-features-list">
                  {room.features.map((feat, i) => (
                    <span key={i} className="room-feature-tag">
                      <Check size={11} color="#34C759" /> {feat}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="room-explore-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate("rooms")
                  }}
                >
                  Explore Room <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-section landing-container">
        <div className="how-intro">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>
            Your entire home,
            <br />
            <em>working together.</em>
          </h2>
          <p>
            Connect your devices, organize your spaces, automate everyday
            routines, protect your home, and understand your energy, all from
            one place.
          </p>
          <div className="step-progress">
            <span>0{activeStep + 1}</span>
            <div>
              <i
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span>05</span>
          </div>
          <div className="step-list">
            {steps.map((step, index) => (
              <button
                type="button"
                className={index === activeStep ? "active" : ""}
                key={step.number}
                onClick={() =>
                  document
                    .querySelector(`[data-step="${index}"]`)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <b>{step.number}</b>
                {step.title}
              </button>
            ))}
          </div>
        </div>
        <div className="steps-column">
          {steps.map((step, index) => (
            <article
              className={`landing-step glass-panel ${
                index === activeStep ? "active" : ""
              }`}
              data-step={index}
              key={step.number}
            >
              <div className="step-heading">
                <span>{step.number}</span>
                <div>
                  <p className="eyebrow">{step.title}</p>
                  <h3>{step.text}</h3>
                </div>
              </div>
              <div className={`step-visual ${step.tone}`}>
                <div className="visual-top">
                  <span>
                    {step.icon}
                    {step.visual}
                  </span>
                  <b>● Live</b>
                </div>
                <div className="visual-line">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <p>{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Assistant Section */}
      <section className="assistant-section landing-container">
        <div className="assistant-copy">
          <p className="eyebrow">SMART ASSISTANT</p>
          <h2>
            Just ask
            <br />
            <em>your home.</em>
          </h2>
          <p>
            A natural way to make things happen. SmartHome+ understands the
            little requests that make a day flow.
          </p>
          <button
            type="button"
            className="landing-button ghost"
            onClick={() => onNavigate("dashboard")}
          >
            Try the assistant <ArrowRight size={16} />
          </button>
        </div>
        <div className="assistant-card glass-panel">
          <div className="assistant-head">
            <span className="assistant-orb">
              <Sparkles size={18} />
            </span>
            <div>
              <b>SmartHome+ Assistant</b>
              <small>Always listening</small>
            </div>
            <span className="live-dot" />
          </div>
          <div className="chat user-chat">Turn off the living room lights.</div>
          <div className="chat ai-chat">
            <Sparkles size={14} /> Done. Living room lights are off.
          </div>
          <div className="assistant-suggestions">
            <span>Set bedroom AC to 24°C</span>
            <span>Are all doors locked?</span>
            <span>Start movie night</span>
          </div>
        </div>
      </section>

      {/* Security Feature Band */}
      <section id="security" className="feature-band landing-container">
        <div
          className="feature-image"
          style={{ backgroundImage: `url(${garden})` }}
        >
          <span className="camera-label">
            <span className="live-dot" /> LIVE · BACKYARD
          </span>
        </div>
        <div className="feature-copy">
          <p className="eyebrow">SECURITY</p>
          <h2>
            Peace of mind,
            <br />
            <em>built in.</em>
          </h2>
          <p>
            See a live view, check every lock, and follow your home&apos;s
            security timeline from wherever life takes you.
          </p>
          <div className="status-row">
            <Shield />
            <span>
              <b>Home protected</b>
              <small>All doors locked · 4 cameras live</small>
            </span>
            <Check className="status-check" />
          </div>
        </div>
      </section>

      {/* Energy Section */}
      <section id="energy" className="energy-section landing-container">
        <div className="section-heading">
          <p className="eyebrow">ENERGY</p>
          <h2>
            Know where
            <br />
            <em>your energy goes.</em>
          </h2>
          <p>
            Small insights add up to a home that works smarter and lives
            lighter.
          </p>
        </div>
        <div className="energy-card glass-panel">
          <div className="energy-metrics">
            <div>
              <small>Today&apos;s usage</small>
              <strong>
                8.4 <i>kWh</i>
              </strong>
            </div>
            <div>
              <small>Peak demand</small>
              <strong>
                2.4 <i>kW</i>
              </strong>
            </div>
            <div>
              <small>Monthly cost</small>
              <strong>₹1,428</strong>
            </div>
          </div>
          <div className="energy-bars">
            <i style={{ height: "35%" }} />
            <i style={{ height: "48%" }} />
            <i style={{ height: "42%" }} />
            <i style={{ height: "68%" }} />
            <i style={{ height: "54%" }} />
            <i style={{ height: "86%" }} />
            <i style={{ height: "62%" }} />
          </div>
          <div className="calculator">
            <label>
              Daily usage <b>{usage} kWh</b>
              <input
                type="range"
                min="2"
                max="20"
                value={usage}
                onChange={(e) => setUsage(Number(e.target.value))}
              />
            </label>
            <label>
              Hours per day <b>{hours} hours</b>
              <input
                type="range"
                min="1"
                max="12"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </label>
            <div className="estimated">
              <span>Estimated monthly cost</span>
              <strong>₹{cost.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Routines / Automation Section */}
      <section id="automation" className="automation-section landing-container">
        <SectionTitle
          eyebrow="AUTOMATION"
          title={
            <>
              Your routines.
              <br />
              <em>On autopilot.</em>
            </>
          }
        />
        <div className="routine-grid">
          {[
            [
              "Good Morning",
              "07:00 AM",
              "Lights ON · Curtains OPEN · AC 24°C",
              "☀",
            ],
            ["Movie Night", "08:00 PM", "Lights DIM · TV ON · AC 23°C", "◐"],
            [
              "Good Night",
              "11:00 PM",
              "Lights OFF · Doors LOCKED · Security ON",
              "◒",
            ],
          ].map(([name, time, detail, icon]) => (
            <div className="routine-card glass-panel" key={name}>
              <span className="routine-icon">{icon}</span>
              <p className="eyebrow">{time}</p>
              <h3>{name}</h3>
              <p>{detail}</p>
              <span className="routine-status">
                <Check size={12} /> Active
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section landing-container">
        <div className="testimonials-heading">
          <p className="eyebrow">CUSTOMER FEEDBACK</p>
          <h2>
            Loved by <span>homeowners worldwide</span>
          </h2>
          <p>
            See how SmartHome+ makes everyday home automation simpler, smarter,
            and more effortless.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-stars" aria-label="5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={15} fill="currentColor" />
                ))}
              </div>
              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div className="testimonial-author">
                <span
                  className="testimonial-avatar"
                  style={{ background: testimonial.color }}
                >
                  {testimonial.initials}
                </span>
                <span>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Capabilities Strip */}
      <section className="landing-container features-list">
        <SectionTitle
          eyebrow="CAPABILITIES"
          title="A calmer way to live with technology."
        />
        <div className="feature-list-grid">
          {[
            "Smart Device Control",
            "Home Security",
            "Energy Monitoring",
            "Automation & Scheduling",
            "AI Assistant",
            "User & Admin Management",
          ].map((name, index) => (
            <div key={name}>
              <span>0{index + 1}</span>
              <strong>{name}</strong>
              <ArrowRight size={16} />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="landing-container pricing-section">
        <SectionTitle
          eyebrow="SIMPLE PLANS"
          title="Choose your level of smart."
        />
        <p className="demo-note">Demo project pricing</p>
        <div className="pricing-grid">
          {[
            ["Free", "₹0", "Explore the essentials"],
            ["Smart", "₹299", "For connected homes"],
            ["Premium", "₹599", "For the whole household"],
          ].map(([name, price, desc], index) => (
            <div
              className={`price-card glass-panel ${
                index === 1 ? "recommended" : ""
              }`}
              key={name}
            >
              {index === 1 && (
                <span className="recommended-label">RECOMMENDED</span>
              )}
              <p className="eyebrow">{name}</p>
              <h3>
                {price}
                <small>{index ? "/month" : ""}</small>
              </h3>
              <p>{desc}</p>
              <button
                type="button"
                className={
                  index === 1 ? "landing-button" : "landing-button ghost"
                }
                onClick={() => onNavigate("auth")}
              >
                Get Started <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-container faq-section">
        <SectionTitle eyebrow="FAQ" title="Questions, answered." />
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div
              className={`faq-item ${openFaq === index ? "open" : ""}`}
              key={question}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{question}</span>
                <ChevronDown size={18} />
              </button>
              <div className="faq-answer">
                <p>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-container final-cta">
        <div>
          <p className="eyebrow">A BETTER HOME STARTS HERE</p>
          <h2>
            Your home is ready
            <br />
            <em>to become smarter.</em>
          </h2>
          <p>
            Connect your devices. Automate your routines. Protect what matters.
          </p>
          <button
            type="button"
            className="landing-button"
            onClick={() => onNavigate("auth")}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <button
              type="button"
              className="landing-brand"
              onClick={() => scrollTo("home")}
            >
              <span className="brand-mark">
                <Home size={16} />
              </span>
              <span>
                SmartHome<span className="accent">+</span>
              </span>
            </button>
            <p>
              Intelligent home
              <br />
              automation.
            </p>
          </div>
          <div>
            <b>Product</b>
            <button type="button" onClick={() => onNavigate("dashboard")}>
              Dashboard
            </button>
            <button type="button" onClick={() => onNavigate("devices")}>
              Devices
            </button>
            <button type="button" onClick={() => onNavigate("rooms")}>
              Rooms
            </button>
            <button type="button" onClick={() => onNavigate("automation")}>
              Automation
            </button>
          </div>
          <div>
            <b>Company</b>
            <button type="button">About</button>
            <button type="button">Contact</button>
            <button type="button" onClick={() => scrollTo("faq")}>
              FAQ
            </button>
          </div>
          <div>
            <b>Resources</b>
            <button type="button">Help Center</button>
            <button type="button">Documentation</button>
            <button type="button">Legal</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SmartHome+. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </footer>
    </main>
  )
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: React.ReactNode
}) {
  return (
    <div className="section-title reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="dashboard-preview glass-panel reveal">
      <div className="preview-head">
        <div>
          <small>Good morning</small>
          <b>USER</b>
        </div>
        <span className="online-pill">
          <i /> 12 devices on
        </span>
      </div>
      <div className="preview-grid">
        <MiniTile icon={<Wind />} label="Climate" value="22°C" tone="blue" />
        <MiniTile
          icon={<Lightbulb />}
          label="Lights"
          value="8 on"
          tone="amber"
        />
        <MiniTile
          icon={<Camera />}
          label="Cameras"
          value="4 live"
          tone="green"
        />
        <MiniTile icon={<Lock />} label="Security" value="Armed" tone="red" />
      </div>
      <div className="preview-ai">
        <Sparkles size={17} />
        <span>
          <small>SmartHome+ Assistant</small>
          <b>Good morning. Your home is secure.</b>
        </span>
      </div>
    </div>
  )
}

function MiniTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: string
}) {
  return (
    <div className={`mini-tile ${tone}`}>
      {icon}
      <small>{label}</small>
      <b>{value}</b>
    </div>
  )
}
