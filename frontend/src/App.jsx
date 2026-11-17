
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Sphere,
  Stars,
  Line
} from "@react-three/drei";
import { motion } from "framer-motion";

import {
  Activity,
  BrainCircuit,
  ShieldCheck,
  Users,
  Zap,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  Gauge,
  TrendingUp,
  RefreshCw,
  Database,
  Target,
  LockKeyhole
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line as ChartLine,
  ReferenceLine
} from "recharts";

import { predictChurn, getAnalytics } from "./services/api";
import "./App.css";

// ==========================================
// 3D NEURAL BRAIN
// ==========================================

const brainNodes = [
  [-1.02, 0.12, 0.02],
  [-0.88, 0.52, 0.02],
  [-0.55, 0.82, 0.02],
  [-0.18, 0.72, 0.10],
  [-0.91, -0.30, 0.02],
  [-0.63, -0.64, 0.02],
  [-0.22, -0.55, 0.10],
  [-0.40, 0.08, 0.30],
  [-0.62, 0.35, 0.28],
  [-0.20, 0.38, 0.30],
  [0.18, 0.72, 0.10],
  [0.55, 0.82, 0.02],
  [0.88, 0.52, 0.02],
  [1.02, 0.12, 0.02],
  [0.91, -0.30, 0.02],
  [0.63, -0.64, 0.02],
  [0.22, -0.55, 0.10],
  [0.40, 0.08, 0.30],
  [0.62, 0.35, 0.28],
  [0.20, 0.38, 0.30],
  [0, 0.05, 0.42],
  [0, -0.35, 0.35]
];

const brainConnections = [
  [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6],
  [1, 8], [8, 7], [7, 9], [9, 3], [8, 2], [7, 6],
  [3, 10], [10, 11], [11, 12], [12, 13],
  [13, 14], [14, 15], [15, 16], [10, 19],
  [19, 17], [17, 18], [18, 12], [17, 16],
  [9, 20], [20, 19], [7, 20], [17, 20],
  [20, 21], [21, 6], [21, 16], [4, 7],
  [14, 17], [2, 8], [11, 18], [5, 7],
  [15, 17], [3, 9], [10, 17], [1, 7]
];

function NeuralBrain() {
  return (
    <Float
      speed={1.15}
      rotationIntensity={0.24}
      floatIntensity={0.38}
    >
      <group rotation={[0.08, 0, 0]}>
        {/* Holographic brain shell */}
        <Sphere
          args={[1, 40, 40]}
          scale={[1.12, 0.88, 0.55]}
        >
          <meshBasicMaterial
            color="#8b7cff"
            wireframe
            transparent
            opacity={0.075}
          />
        </Sphere>

        {/* Left hemisphere */}
        <Sphere
          args={[1, 32, 32]}
          position={[-0.38, 0, 0]}
          scale={[0.70, 0.82, 0.53]}
        >
          <meshBasicMaterial
            color="#39d9e9"
            wireframe
            transparent
            opacity={0.10}
          />
        </Sphere>

        {/* Right hemisphere */}
        <Sphere
          args={[1, 32, 32]}
          position={[0.38, 0, 0]}
          scale={[0.70, 0.82, 0.53]}
        >
          <meshBasicMaterial
            color="#8b7cff"
            wireframe
            transparent
            opacity={0.10}
          />
        </Sphere>

        {/* Neural connections */}
        {brainConnections.map(([start, end], index) => (
          <Line
            key={`connection-${index}`}
            points={[brainNodes[start], brainNodes[end]]}
            color={index % 3 === 0 ? "#39d9e9" : "#8b7cff"}
            lineWidth={1.35}
            transparent
            opacity={0.65}
          />
        ))}

        {/* Neural nodes */}
        {brainNodes.map((position, index) => (
          <Sphere
            key={`node-${index}`}
            args={[index % 4 === 0 ? 0.052 : 0.035, 16, 16]}
            position={position}
          >
            <meshStandardMaterial
              color={index % 3 === 0 ? "#b8faff" : "#a18bff"}
              emissive={index % 3 === 0 ? "#24d9ff" : "#6545ff"}
              emissiveIntensity={2.2}
              roughness={0.2}
              metalness={0.3}
            />
          </Sphere>
        ))}

        {/* Central neural bridge */}
        <Line
          points={[[0, 0.72, 0.12], [0, 0.25, 0.42], [0, -0.18, 0.42], [0, -0.55, 0.12]]}
          color="#b8faff"
          lineWidth={2}
          transparent
          opacity={0.8}
        />

        {/* Brain stem */}
        <mesh position={[0, -0.88, 0]}>
          <cylinderGeometry args={[0.12, 0.19, 0.38, 24]} />
          <meshStandardMaterial
            color="#7864ff"
            emissive="#3924a8"
            emissiveIntensity={1.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

function AIVisualization() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.7], fov: 45 }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={1.2} />
      <pointLight position={[3, 3, 3]} intensity={35} color="#8b7cff" />
      <pointLight position={[-3, -2, 2]} intensity={20} color="#24d9ff" />
      <pointLight position={[0, 0, -3]} intensity={10} color="#7565ff" />

      <Stars
        radius={80}
        depth={40}
        count={1800}
        factor={3}
        fade
        speed={1}
      />

      <NeuralBrain />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.65}
      />
    </Canvas>
  );
}

// ==========================================
// DIGITAL HUMAN AI ASSISTANT
// ==========================================

function DigitalHumanAssistant() {
  return (
    <motion.section
      className="digital-human-section"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="digital-human-copy">
        <span className="digital-human-eyebrow">
          <Sparkles size={14} />
          CHURNSHIELD / AI ASSISTANT
        </span>

        <h2>
          Meet Your
          <span> Intelligence Assistant.</span>
        </h2>

        <p>
          Your AI-powered customer analysis companion is ready.
          Submit a customer profile to generate a churn prediction
          and explore personalized retention insights.
        </p>

        <div className="digital-human-status">
          <span className="digital-human-status-dot" />
          ASSISTANT ONLINE
        </div>

        <div className="digital-human-caption">
          <span>01</span>
          CUSTOMER INTELLIGENCE
          <span className="digital-human-caption-line" />
        </div>
      </div>

      <div className="digital-human-visual">
        <div className="digital-human-orbit orbit-one" />
        <div className="digital-human-orbit orbit-two" />
        <div className="digital-human-orbit orbit-three" />
        <div className="digital-human-glow" />

        <motion.div
          className="digital-human-avatar"
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            className="digital-human-svg"
            viewBox="0 0 260 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="humanFace" x1="70" y1="30" x2="190" y2="250">
                <stop offset="0%" stopColor="#b8faff" />
                <stop offset="45%" stopColor="#7d8dff" />
                <stop offset="100%" stopColor="#8b62ff" />
              </linearGradient>

              <linearGradient id="humanBody" x1="40" y1="180" x2="220" y2="300">
                <stop offset="0%" stopColor="#44dff5" />
                <stop offset="100%" stopColor="#8263ff" />
              </linearGradient>

              <filter id="humanGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M35 290 C38 228 67 202 103 195 L130 215 L157 195 C193 202 222 228 225 290"
              stroke="url(#humanBody)"
              strokeWidth="5"
              fill="rgba(57,217,233,0.10)"
            />

            <path
              d="M80 225 L130 265 L180 225"
              stroke="#56dff5"
              strokeWidth="2"
              opacity="0.7"
            />

            <path
              d="M108 180 L108 210 Q130 228 152 210 L152 180"
              fill="#7e8cff"
              opacity="0.8"
            />

            <path
              d="M130 27 C82 27 65 66 68 111 C69 160 94 192 130 198 C166 192 191 160 192 111 C195 66 178 27 130 27Z"
              fill="rgba(94,133,255,0.10)"
              stroke="url(#humanFace)"
              strokeWidth="3"
              filter="url(#humanGlow)"
            />

            <path
              d="M88 90 Q105 78 119 91"
              stroke="#a5f4ff"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M141 91 Q155 78 172 90"
              stroke="#a5f4ff"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <g className="digital-human-eyes">
              <ellipse cx="104" cy="111" rx="7" ry="4" fill="#a8faff" />
              <ellipse cx="156" cy="111" rx="7" ry="4" fill="#a8faff" />
            </g>

            <path
              d="M130 112 L125 142 L135 142"
              stroke="#a8eaff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />

            <path
              d="M113 160 Q130 171 147 160"
              stroke="#9df4ff"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path d="M74 83 H186" stroke="#39d9e9" strokeWidth="1" opacity="0.35" />
            <path d="M72 130 H188" stroke="#39d9e9" strokeWidth="1" opacity="0.25" />
            <path d="M52 100 H69 M191 100 H208" stroke="#39d9e9" strokeWidth="2" />
            <path d="M57 110 H68 M192 110 H203" stroke="#8978ff" strokeWidth="2" />

            <circle cx="130" cy="58" r="5" fill="#b9faff" filter="url(#humanGlow)" />

            <path
              d="M130 48 V36 M118 58 H105 M142 58 H155"
              stroke="#39d9e9"
              strokeWidth="1.5"
              opacity="0.8"
            />

            <path
              d="M113 205 H147"
              stroke="#39d9e9"
              strokeWidth="2"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        <div className="digital-human-floating-tag tag-left">
          <Activity size={13} />
          <span>NEURAL LINK</span>
        </div>

        <div className="digital-human-floating-tag tag-right">
          <ShieldCheck size={13} />
          <span>SECURE AI</span>
        </div>

        <div className="digital-human-scanline" />
      </div>
    </motion.section>
  );
}

// ==========================================
// CUSTOMER DEFAULT VALUES
// ==========================================

const initialCustomer = {
  gender: "Male",
  SeniorCitizen: "No",
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "Yes",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 85.5,
  TotalCharges: 1026
};

// ==========================================
// CUSTOMER INPUT FIELDS
// ==========================================

const fields = [
  {
    title: "Personal Information",
    items: [
      { key: "gender", label: "Gender", options: ["Male", "Female"] },
      { key: "SeniorCitizen", label: "Senior Citizen", options: ["No", "Yes"] },
      { key: "Partner", label: "Partner", options: ["Yes", "No"] },
      { key: "Dependents", label: "Dependents", options: ["Yes", "No"] }
    ]
  },
  {
    title: "Service Information",
    items: [
      { key: "PhoneService", label: "Phone Service", options: ["Yes", "No"] },
      { key: "MultipleLines", label: "Multiple Lines", options: ["No", "Yes", "No phone service"] },
      { key: "InternetService", label: "Internet Service", options: ["DSL", "Fiber optic", "No"] },
      { key: "OnlineSecurity", label: "Online Security", options: ["Yes", "No", "No internet service"] },
      { key: "OnlineBackup", label: "Online Backup", options: ["Yes", "No", "No internet service"] },
      { key: "DeviceProtection", label: "Device Protection", options: ["Yes", "No", "No internet service"] },
      { key: "TechSupport", label: "Tech Support", options: ["Yes", "No", "No internet service"] },
      { key: "StreamingTV", label: "Streaming TV", options: ["Yes", "No", "No internet service"] },
      { key: "StreamingMovies", label: "Streaming Movies", options: ["Yes", "No", "No internet service"] }
    ]
  },
  {
    title: "Account Information",
    items: [
      { key: "Contract", label: "Contract", options: ["Month-to-month", "One year", "Two year"] },
      { key: "PaperlessBilling", label: "Paperless Billing", options: ["Yes", "No"] },
      {
        key: "PaymentMethod",
        label: "Payment Method",
        options: [
          "Electronic check",
          "Mailed check",
          "Bank transfer (automatic)",
          "Credit card (automatic)"
        ]
      }
    ]
  }
];

const chartTooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(139,124,255,0.3)",
  borderRadius: "10px",
  color: "#ffffff"
};

// ==========================================
// SHARED COMPONENTS
// ==========================================

function MetricCard({ label, value, description, icon: Icon }) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={19} />
      </div>
      <h3>{value}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

function AnalyticsPanel({ title, subtitle, children, className = "" }) {
  return (
    <motion.div
      className={`analytics-panel ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="analytics-panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <Activity size={19} />
      </div>
      {children}
    </motion.div>
  );
}

// ==========================================
// LIVE CUSTOMER INTELLIGENCE
// ==========================================

function LiveCustomerAnalytics({ customer, result, probability }) {
  const services = [
    ["Multiple Lines", customer.MultipleLines],
    ["Online Security", customer.OnlineSecurity],
    ["Online Backup", customer.OnlineBackup],
    ["Device Protection", customer.DeviceProtection],
    ["Tech Support", customer.TechSupport],
    ["Streaming TV", customer.StreamingTV],
    ["Streaming Movies", customer.StreamingMovies]
  ];

  const activeServices = services.filter(([, value]) => value === "Yes").length;
  const adoption = (activeServices / services.length) * 100;
  const monthly = Number(customer.MonthlyCharges) || 0;
  const tenure = Number(customer.tenure) || 0;
  const threshold = Number(result.threshold || 0) * 100;
  const churn = result.prediction === "Churn";

  const risk =
    probability >= 75
      ? "CRITICAL"
      : probability >= threshold
      ? "HIGH"
      : probability >= 35
      ? "MODERATE"
      : "LOW";

  const riskColor =
    risk === "CRITICAL" || risk === "HIGH"
      ? "#ff557e"
      : risk === "MODERATE"
      ? "#ffbd69"
      : "#37e5b0";

  const lifecycle =
    tenure <= 12
      ? "Early Lifecycle"
      : tenure <= 36
      ? "Growth Lifecycle"
      : "Established Customer";

  const signals = [
    ["Month-to-month contract", customer.Contract === "Month-to-month"],
    ["Early lifecycle", tenure <= 12],
    ["Technical support unavailable", customer.TechSupport === "No" && customer.InternetService !== "No"],
    ["Online security unavailable", customer.OnlineSecurity === "No" && customer.InternetService !== "No"],
    ["Electronic check payment", customer.PaymentMethod === "Electronic check"]
  ];

  const recommendations = [];

  if (customer.Contract === "Month-to-month") {
    recommendations.push({
      title: "Contract Retention Strategy",
      description: "Review annual contract options and communicate their benefits.",
      priority: "HIGH"
    });
  }

  if (tenure <= 12) {
    recommendations.push({
      title: "Early Lifecycle Intervention",
      description: "Consider onboarding support and proactive satisfaction check-ins.",
      priority: "HIGH"
    });
  }

  if (customer.TechSupport === "No" && customer.InternetService !== "No") {
    recommendations.push({
      title: "Technical Support Opportunity",
      description: "Review whether a technical support plan could improve the experience.",
      priority: "MEDIUM"
    });
  }

  if (customer.OnlineSecurity === "No" && customer.InternetService !== "No") {
    recommendations.push({
      title: "Security Service Engagement",
      description: "Explain available security features and assess customer interest.",
      priority: "MEDIUM"
    });
  }

  if (customer.PaymentMethod === "Electronic check") {
    recommendations.push({
      title: "Payment Experience Review",
      description: "Explain available automatic payment options.",
      priority: "MEDIUM"
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Relationship Maintenance",
      description: "Maintain regular engagement and monitor customer satisfaction.",
      priority: "LOW"
    });
  }

  return (
    <motion.div
      className="live-customer-analytics"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="ci-header">
        <div>
          <span className="ci-eyebrow">✦ CHURNSHIELD / INTELLIGENCE ENGINE</span>
          <h2>Customer Intelligence</h2>
          <p>Advanced predictive insights and retention decision support</p>
        </div>
        <div className="ci-live"><span /> ANALYSIS COMPLETE</div>
      </div>

      <div className="ci-hero">
        <div className="ci-hero-copy">
          <span className="ci-label">PREDICTIVE RISK ASSESSMENT</span>
          <h3>Customer Churn Risk</h3>
          <p>Machine learning probability estimate based on the submitted customer profile.</p>
          <div className="ci-risk-pill" style={{ color: riskColor, borderColor: riskColor }}>
            <span style={{ background: riskColor }} />
            {risk} RISK
          </div>
          <div className="ci-prediction">
            <span>MODEL DECISION</span>
            <strong style={{ color: riskColor }}>{result.prediction}</strong>
          </div>
        </div>

        <div className="ci-gauge">
          <svg viewBox="0 0 220 220">
            <defs>
              <linearGradient id="ciRiskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b7cff" />
                <stop offset="100%" stopColor={riskColor} />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r="87" fill="none" stroke="#28344a" strokeWidth="13" />
            <circle
              cx="110"
              cy="110"
              r="87"
              fill="none"
              stroke="url(#ciRiskGradient)"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 87}`}
              strokeDashoffset={`${2 * Math.PI * 87 * (1 - probability / 100)}`}
              transform="rotate(-90 110 110)"
              style={{ transition: "stroke-dashoffset 1.5s ease" }}
            />
            <circle cx="110" cy="110" r="69" fill="#111b2c" />
            <text x="110" y="102" textAnchor="middle" fill="#ffffff" fontSize="34" fontWeight="800">
              {probability.toFixed(1)}%
            </text>
            <text x="110" y="126" textAnchor="middle" fill="#94a3b8" fontSize="10" letterSpacing="2">
              CHURN RISK
            </text>
          </svg>
          <span className="ci-gauge-caption">AI PREDICTION SCORE</span>
        </div>
      </div>

      <div className="ci-kpis">
        <div className="ci-kpi">
          <span>MONTHLY CHARGES</span>
          <strong>${monthly.toFixed(2)}</strong>
          <small>Recurring customer charge</small>
        </div>
        <div className="ci-kpi">
          <span>CUSTOMER TENURE</span>
          <strong>{tenure} <small>Months</small></strong>
          <small>{lifecycle}</small>
        </div>
        <div className="ci-kpi">
          <span>SERVICE ADOPTION</span>
          <strong>{adoption.toFixed(0)}%</strong>
          <small>{activeServices} of {services.length} active services</small>
        </div>
        <div className="ci-kpi">
          <span>DECISION THRESHOLD</span>
          <strong>{threshold.toFixed(1)}%</strong>
          <small>Model classification threshold</small>
        </div>
      </div>

      <div className="ci-grid">
        <div className="ci-panel">
          <div className="ci-panel-heading">
            <div>
              <span className="ci-eyebrow">01 / CUSTOMER PROFILE</span>
              <h3>Lifecycle Intelligence</h3>
            </div>
            <Activity size={20} />
          </div>

          <div className="ci-profile-row"><span>Lifecycle Stage</span><strong>{lifecycle}</strong></div>
          <div className="ci-profile-row"><span>Contract</span><strong>{customer.Contract}</strong></div>
          <div className="ci-profile-row"><span>Internet Service</span><strong>{customer.InternetService}</strong></div>
          <div className="ci-profile-row"><span>Payment Method</span><strong>{customer.PaymentMethod}</strong></div>

          <div className="ci-adoption">
            <div className="ci-adoption-heading">
              <span>Service adoption</span>
              <strong>{activeServices}/{services.length}</strong>
            </div>
            <div className="ci-adoption-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${adoption}%` }}
                transition={{ duration: 1.2 }}
              />
            </div>
            <div className="ci-adoption-caption">
              <span>{adoption.toFixed(0)}% utilized</span>
              <span>{services.length - activeServices} inactive</span>
            </div>
          </div>
        </div>

        <div className="ci-panel">
          <div className="ci-panel-heading">
            <div>
              <span className="ci-eyebrow">02 / RISK MONITOR</span>
              <h3>Risk Signal Detection</h3>
            </div>
            <ShieldCheck size={20} />
          </div>

          {signals.map(([label, active]) => (
            <div className="ci-signal" key={label}>
              <span className={active ? "ci-signal-dot active" : "ci-signal-dot"} />
              <span>{label}</span>
              <strong className={active ? "ci-flagged" : "ci-clear"}>
                {active ? "REVIEW" : "CLEAR"}
              </strong>
            </div>
          ))}
          <p className="ci-note">
            Profile-based indicators. These are rule-based checks, not SHAP explanations.
          </p>
        </div>
      </div>

      <div className="ci-panel ci-retention">
        <div className="ci-panel-heading">
          <div>
            <span className="ci-eyebrow">03 / ACTION INTELLIGENCE</span>
            <h3>Retention Decision Engine</h3>
            <p>Suggested actions based on customer profile indicators</p>
          </div>
          <Sparkles size={22} />
        </div>

        <div className="ci-recommendations">
          {recommendations.map((item, index) => (
            <div className="ci-recommendation" key={item.title}>
              <div className="ci-rec-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="ci-rec-content">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span className={`ci-priority ${item.priority.toLowerCase()}`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="ci-business">
        <div>
          <span className="ci-eyebrow">04 / BUSINESS IMPACT INDICATOR</span>
          <h3>Recurring Charge Exposure</h3>
          <p>Illustrative charge indicator for the current prediction.</p>
        </div>
        <div className="ci-business-values">
          <div>
            <span>Monthly charge</span>
            <strong>${(churn ? monthly : 0).toFixed(2)}</strong>
          </div>
          <div>
            <span>Annualized charge</span>
            <strong>${(churn ? monthly * 12 : 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div className="ci-footer-note">
        <LockKeyhole size={15} />
        Predictions are estimates, not guarantees. Risk bands and retention suggestions are display rules.
        Annualized charges are illustrative indicators, not confirmed revenue loss or saved revenue.
      </div>
    </motion.div>
  );
}

// ==========================================
// CUSTOMER FORM
// ==========================================

function CustomerForm({ customer, updateField, handlePrediction, resetForm, loading }) {
  return (
    <div className="form-panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">PREDICTION WORKSPACE</span>
          <h2>Customer Details</h2>
          <p>Enter customer details to evaluate individual churn risk.</p>
        </div>
        <div className="panel-icon">
          <Users size={22} />
        </div>
      </div>

      <form onSubmit={handlePrediction}>
        {fields.map((group) => (
          <div className="field-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="form-grid">
              {group.items.map((field) => (
                <label className="input-field" key={field.key}>
                  <span>{field.label}</span>
                  <select
                    value={customer[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="field-group">
          <h3>Financial & Tenure Details</h3>
          <div className="form-grid three-columns">
            <label className="input-field">
              <span>Tenure (Months)</span>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={customer.tenure}
                onChange={(event) => updateField("tenure", event.target.value)}
              />
            </label>

            <label className="input-field">
              <span>Monthly Charges ($)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={customer.MonthlyCharges}
                onChange={(event) => updateField("MonthlyCharges", event.target.value)}
              />
            </label>

            <label className="input-field">
              <span>Total Charges ($)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={customer.TotalCharges}
                onChange={(event) => updateField("TotalCharges", event.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="reset-button"
            onClick={resetForm}
            disabled={loading}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button type="submit" className="predict-button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                Analyzing Customer...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Analyze Churn Risk
                <ArrowUpRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// PREDICTION RESULT
// ==========================================

function PredictionResult({ result, loading, error, isChurn, probability }) {
  return (
    <div className="result-panel">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">AI ANALYTICS ENGINE</span>
          <h2>Prediction Result</h2>
          <p>Individual customer churn risk assessment.</p>
        </div>
        <div className="panel-icon">
          <Activity size={22} />
        </div>
      </div>

      {!result && !loading && !error && (
        <motion.div className="empty-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="empty-orbit">
            <div className="empty-orbit-inner">
              <BrainCircuit size={43} />
            </div>
          </div>
          <span className="insight-tag">XGBOOST ENGINE READY</span>
          <h3>Awaiting Analysis</h3>
          <p>
            Customer intelligence is ready. Submit customer details
            to calculate churn probability.
          </p>
          <div className="insight-status">
            <span className="status-dot" />
            SYSTEM OPERATIONAL
          </div>
        </motion.div>
      )}

      {loading && (
        <motion.div className="empty-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 size={48} className="spin loading-icon" />
          <h3>Analyzing Customer</h3>
          <p>XGBoost engine is evaluating customer information.</p>
          <span className="insight-tag">PROCESSING PREDICTION</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="error-result"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={42} />
          <h3>Prediction Failed</h3>
          <p>{error}</p>
          <small>Check whether the FastAPI backend is running.</small>
        </motion.div>
      )}

      {result && (
        <motion.div
          className="prediction-result"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`result-status ${isChurn ? "risk" : "safe"}`}>
            {isChurn ? <AlertTriangle size={21} /> : <CheckCircle2 size={21} />}
            <span>{isChurn ? "HIGH CHURN RISK" : "LOWER CHURN RISK"}</span>
          </div>

          <div className="risk-gauge-section">
            <motion.div
              className={`risk-gauge ${isChurn ? "risk" : "safe"}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{
                background: `conic-gradient(
                  ${isChurn ? "#f05b82" : "#35d6a0"} ${probability}%,
                  rgba(255,255,255,0.07) 0
                )`
              }}
            >
              <div className="risk-gauge-inner">
                <span>CHURN PROBABILITY</span>
                <strong>{probability.toFixed(2)}%</strong>
                <small>MODEL ESTIMATE</small>
              </div>
            </motion.div>
          </div>

          <div className="probability-display">
            <div className="probability-heading">
              <span>Probability Analysis</span>
              <strong>{probability.toFixed(2)}%</strong>
            </div>
            <div className="probability-track">
              <motion.div
                className={`probability-fill ${isChurn ? "risk" : "safe"}`}
                initial={{ width: 0 }}
                animate={{ width: `${probability}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="result-details">
            <div><span>Prediction</span><strong>{result.prediction}</strong></div>
            <div>
              <span>Decision Threshold</span>
              <strong>{(Number(result.threshold) * 100).toFixed(0)}%</strong>
            </div>
            <div><span>Model Engine</span><strong>XGBoost</strong></div>
          </div>

          <div className="result-note">
            <ShieldCheck size={19} />
            <p>
              {isChurn
                ? "Estimated risk is above the optimized threshold. Review customer retention opportunities."
                : "Estimated risk is below the optimized threshold. Continue monitoring customer engagement."}
            </p>
          </div>

          <p className="disclaimer">
            AI prediction is an estimate, not a guarantee of future customer behavior.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// COMPANY ANALYTICS PAGE
// ==========================================

function CompanyAnalytics({
  analytics,
  analyticsLoading,
  analyticsError,
  loadAnalytics,
  dataset,
  performance,
  matrix,
  churnDistribution,
  rocData,
  featureData,
  formatPercent,
  formatImportance
}) {
  return (
    <section className="analytics-section">
      <div className="analytics-section-title">
        <div>
          <span className="section-kicker">MODEL INTELLIGENCE</span>
          <h2>Company Analytics</h2>
          <p>Model evaluation and dataset-level insights from the saved test dataset.</p>
        </div>

        <button
          className="analytics-refresh"
          onClick={loadAnalytics}
          disabled={analyticsLoading}
        >
          <RefreshCw size={15} className={analyticsLoading ? "spin" : ""} />
          Refresh analytics
        </button>
      </div>

      {analyticsLoading && (
        <div className="analytics-message">
          <Loader2 size={22} className="spin" />
          Loading model analytics...
        </div>
      )}

      {analyticsError && (
        <div className="analytics-error">
          <AlertTriangle size={20} />
          <div>
            <strong>Analytics unavailable</strong>
            <p>{analyticsError}</p>
            <small>Check that the FastAPI backend is running.</small>
          </div>
        </div>
      )}

      {analytics && dataset && performance && matrix && (
        <>
          <div className="analytics-summary">
            <div>
              <Database size={19} />
              <span>TEST DATASET</span>
              <strong>{dataset.test_samples.toLocaleString()}</strong>
              <small>Evaluation samples</small>
            </div>

            <div>
              <Users size={19} />
              <span>NON-CHURN CUSTOMERS</span>
              <strong>{dataset.non_churn_customers.toLocaleString()}</strong>
              <small>
                {((dataset.non_churn_customers / dataset.test_samples) * 100).toFixed(1)}% of test data
              </small>
            </div>

            <div>
              <AlertTriangle size={19} />
              <span>CHURN CUSTOMERS</span>
              <strong>{dataset.churn_customers.toLocaleString()}</strong>
              <small>
                {((dataset.churn_customers / dataset.test_samples) * 100).toFixed(1)}% of test data
              </small>
            </div>

            <div>
              <Target size={19} />
              <span>F1 SCORE</span>
              <strong>{formatPercent(performance.f1_score)}</strong>
              <small>Precision and recall balance</small>
            </div>
          </div>

          <div className="analytics-grid">
            <AnalyticsPanel
              title="Customer Churn Distribution"
              subtitle="Actual class distribution in the test dataset"
            >
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={churnDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      animationBegin={100}
                      animationDuration={1300}
                    >
                      <Cell fill="#38d6a3" />
                      <Cell fill="#f05b82" />
                    </Pie>
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value, name) => [Number(value).toLocaleString(), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="chart-legend">
                  <span><i className="legend-green" /> Non-Churn</span>
                  <span><i className="legend-pink" /> Churn</span>
                </div>
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel
              title="Model Performance"
              subtitle="Evaluation metrics at the selected threshold"
            >
              <div className="performance-list">
                {[
                  ["Accuracy", performance.accuracy],
                  ["Precision", performance.precision],
                  ["Recall", performance.recall],
                  ["F1 Score", performance.f1_score],
                  ["ROC-AUC", performance.roc_auc]
                ].map(([label, value], index) => (
                  <div className="performance-item" key={label}>
                    <div className="performance-label">
                      <span>{label}</span>
                      <strong>{formatPercent(value)}</strong>
                    </div>
                    <div className="performance-track">
                      <motion.div
                        className="performance-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${value * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.12 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsPanel>
          </div>

          <div className="analytics-grid">
            <AnalyticsPanel
              title="ROC Curve"
              subtitle="True positive rate against false positive rate"
            >
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={rocData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="fpr"
                      type="number"
                      domain={[0, 1]}
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <YAxis
                      type="number"
                      domain={[0, 1]}
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => Number(value).toFixed(3)}
                    />
                    <ReferenceLine
                      segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                      stroke="#8992a6"
                      strokeDasharray="5 5"
                    />
                    <ChartLine
                      type="monotone"
                      dataKey="tpr"
                      stroke="#8b7cff"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive
                      animationDuration={1600}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="chart-footnote">
                  ROC-AUC: <strong>{Number(performance.roc_auc).toFixed(3)}</strong>
                </div>
              </div>
            </AnalyticsPanel>

            <AnalyticsPanel
              title="Confusion Matrix"
              subtitle="Actual versus predicted customer classes"
            >
              <div className="confusion-matrix">
                <div className="matrix-axis-label">PREDICTED</div>
                <div className="matrix-content">
                  <div className="matrix-side-label">ACTUAL</div>
                  <div className="matrix-grid">
                    <div className="matrix-cell true-negative">
                      <span>TRUE NEGATIVE</span>
                      <strong>{matrix.true_negative}</strong>
                    </div>
                    <div className="matrix-cell false-positive">
                      <span>FALSE POSITIVE</span>
                      <strong>{matrix.false_positive}</strong>
                    </div>
                    <div className="matrix-cell false-negative">
                      <span>FALSE NEGATIVE</span>
                      <strong>{matrix.false_negative}</strong>
                    </div>
                    <div className="matrix-cell true-positive">
                      <span>TRUE POSITIVE</span>
                      <strong>{matrix.true_positive}</strong>
                    </div>
                  </div>
                </div>
                <div className="matrix-legend">
                  <span>TN / TP = Correct predictions</span>
                  <span>FP / FN = Incorrect predictions</span>
                </div>
              </div>
            </AnalyticsPanel>
          </div>

          <AnalyticsPanel
            title="Feature Importance Intelligence"
            subtitle="Top features ranked by their contribution to the XGBoost model"
            className="feature-panel"
          >
            <div className="feature-chart">
              <ResponsiveContainer width="100%" height={440}>
                <BarChart
                  data={featureData}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(255,255,255,0.07)"
                  />
                  <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={190}
                    tick={{ fill: "#c4c8d5", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => formatImportance(value)}
                  />
                  <Bar
                    dataKey="importance"
                    fill="#8b7cff"
                    radius={[0, 6, 6, 0]}
                    animationDuration={1400}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsPanel>

          <div className="analytics-disclaimer">
            <LockKeyhole size={15} />
            Analytics are calculated from the saved test dataset and model artifacts.
            Feature importance indicates model contribution, not causation.
          </div>
        </>
      )}
    </section>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================

function App() {
  const [activePage, setActivePage] = useState("overview");

  const [customer, setCustomer] = useState(initialCustomer);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");

    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setAnalyticsError(err.message || "Unable to load model analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const updateField = (key, value) => {
    setCustomer((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const handlePrediction = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await predictChurn({
        ...customer,
        tenure: Number(customer.tenure),
        MonthlyCharges: Number(customer.MonthlyCharges),
        TotalCharges: Number(customer.TotalCharges)
      });

      setResult(response);
    } catch (err) {
      setError(err.message || "Unable to connect to prediction server.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomer({ ...initialCustomer });
    setResult(null);
    setError("");
  };

  const isChurn = result?.prediction === "Churn";

  const probability = result
    ? Math.min(100, Math.max(0, Number(result.churn_probability_percent) || 0))
    : 0;

  const performance = analytics?.performance;
  const dataset = analytics?.dataset;
  const matrix = analytics?.confusion_matrix;

  const churnDistribution = dataset
    ? [
        { name: "Non-Churn", value: dataset.non_churn_customers },
        { name: "Churn", value: dataset.churn_customers }
      ]
    : [];

  const rocData =
    analytics?.roc_curve?.fpr?.map((value, index) => ({
      fpr: value,
      tpr: analytics.roc_curve.tpr[index]
    })) || [];

  const featureData =
    analytics?.feature_importance?.map((item) => ({
      name: item.feature,
      importance: Number(item.importance)
    })) || [];

  const formatPercent = (value) =>
    `${(Number(value) * 100).toFixed(2)}%`;

  const formatImportance = (value) =>
    Number(value).toFixed(3);

  const pageTitles = {
    overview: "Customer Intelligence Dashboard",
    customer: "Individual Customer Analysis",
    analytics: "Company Analytics"
  };

  const pageBreadcrumbs = {
    overview: "WORKSPACE / OVERVIEW",
    customer: "WORKSPACE / CUSTOMER ANALYSIS",
    analytics: "WORKSPACE / COMPANY ANALYTICS"
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={25} />
          </div>
          <div>
            <h2>ChurnShield AI</h2>
            <span>RETENTION INTELLIGENCE</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <button
          type="button"
          className={`nav-item ${activePage === "overview" ? "active" : ""}`}
          onClick={() => setActivePage("overview")}
        >
          <Activity size={18} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activePage === "customer" ? "active" : ""}`}
          onClick={() => setActivePage("customer")}
        >
          <Users size={18} />
          <span>Customer Analysis</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activePage === "analytics" ? "active" : ""}`}
          onClick={() => setActivePage("analytics")}
        >
          <BrainCircuit size={18} />
          <span>Company Analytics</span>
        </button>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            <div>
              <strong>AI Engine Online</strong>
              <small>Prediction service ready</small>
            </div>
          </div>
          <div className="sidebar-footer">
            POWERED BY MACHINE LEARNING
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">{pageBreadcrumbs[activePage]}</span>
            <h1>{pageTitles[activePage]}</h1>
          </div>

          <div className="topbar-right">
            <span className="live-indicator">
              <span className="status-dot" />
              LIVE SYSTEM
            </span>
            <div className="profile-avatar">CS</div>
          </div>
        </header>

        {/* OVERVIEW PAGE */}
        {activePage === "overview" && (
          <>
            <section className="welcome-section">
              <div className="welcome-copy">
                <div className="eyebrow">
                  <Sparkles size={14} />
                  AI-POWERED CUSTOMER INTELLIGENCE
                </div>

                <h2>
                  ChurnShield AI
                  <br />
                  <span>Predict. Explain. Retain.</span>
                </h2>

                <p>
                  <strong>
                    Explainable Customer Retention & Revenue Intelligence Platform
                  </strong>
                  <br />
                  Transform customer data into predictive insights,
                  understand churn drivers, and identify intelligent
                  retention opportunities.
                </p>

                <div className="welcome-tags">
                  <span><ShieldCheck size={14} /> Explainable AI</span>
                  <span><Zap size={14} /> Real-time Prediction</span>
                </div>
              </div>

              <div className="visual-container">
                <div className="visual-caption">
                  <span className="visual-dot" />
                  NEURAL CORE / ACTIVE
                </div>
                <div className="three-scene">
                  <AIVisualization />
                </div>
                <div className="visual-bottom-label">
                  CHURNSHIELD AI / INTELLIGENCE ENGINE
                </div>
              </div>
            </section>

            <section className="metrics-grid">
              <MetricCard
                label="MODEL TYPE"
                value={analytics?.model || "XGBoost"}
                description="Selected final model"
                icon={BrainCircuit}
              />
              <MetricCard
                label="ROC-AUC SCORE"
                value={performance ? Number(performance.roc_auc).toFixed(3) : "—"}
                description="Area under ROC curve"
                icon={TrendingUp}
              />
              <MetricCard
                label="RECALL SCORE"
                value={performance ? formatPercent(performance.recall) : "—"}
                description="Churn detection recall"
                icon={Gauge}
              />
              <MetricCard
                label="DECISION THRESHOLD"
                value={analytics ? `${(analytics.threshold * 100).toFixed(0)}%` : "—"}
                description="Optimized classification threshold"
                icon={ShieldCheck}
              />
            </section>

            <div className="overview-action-panel">
              <div>
                <span className="section-kicker">GET STARTED</span>
                <h2>Analyze an individual customer</h2>
                <p>
                  Enter a customer profile to generate a churn prediction,
                  risk indicators and retention suggestions.
                </p>
              </div>
              <button
                className="predict-button"
                type="button"
                onClick={() => setActivePage("customer")}
              >
                <Users size={17} />
                Open Customer Analysis
                <ArrowUpRight size={17} />
              </button>
            </div>
          </>
        )}

        {/* CUSTOMER ANALYSIS PAGE */}
        {activePage === "customer" && (
          <>
            <section className="page-intro">
              <span className="section-kicker">INDIVIDUAL CUSTOMER WORKSPACE</span>
              <h2>Customer Risk Assessment</h2>
              <p>
                Submit one customer profile to view its prediction and
                customer-specific intelligence. Company-level analytics are
                available separately.
              </p>
            </section>

            {/* DIGITAL HUMAN AI ASSISTANT */}
            <DigitalHumanAssistant />

            <section className="workspace-grid">
              <CustomerForm
                customer={customer}
                updateField={updateField}
                handlePrediction={handlePrediction}
                resetForm={resetForm}
                loading={loading}
              />

              <PredictionResult
                result={result}
                loading={loading}
                error={error}
                isChurn={isChurn}
                probability={probability}
              />
            </section>

            {result && (
              <section className="customer-intelligence-section">
                <LiveCustomerAnalytics
                  customer={customer}
                  result={result}
                  probability={probability}
                />
              </section>
            )}
          </>
        )}

        {/* COMPANY ANALYTICS PAGE */}
        {activePage === "analytics" && (
          <CompanyAnalytics
            analytics={analytics}
            analyticsLoading={analyticsLoading}
            analyticsError={analyticsError}
            loadAnalytics={loadAnalytics}
            dataset={dataset}
            performance={performance}
            matrix={matrix}
            churnDistribution={churnDistribution}
            rocData={rocData}
            featureData={featureData}
            formatPercent={formatPercent}
            formatImportance={formatImportance}
          />
        )}

        <footer className="app-footer">
          <span>CHURNSHIELD AI © 2026</span>
          <span>INTELLIGENCE • PRECISION • RETENTION</span>
          <span>ML ENGINE v1.0</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

