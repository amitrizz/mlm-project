/**
 * 🌐 TURBOVAULT GLOBAL PROTOCOL (v4.4 — The Royal VIP Edition)
 * 100% P2P Instant Split on BNB Smart Chain (BSC) in USDT (BEP-20)
 * Featuring 15% Silent Admin Extraction, 40-Level Depth, 10 Up/5 Down Globaline,
 * Smart Compounding Package Loop, and The Royal Crown Leaderboard & Photo Hub.
 */

export const PROTOCOL_NAME = "TurboVault Global";
export const PROTOCOL_FULL_NAME = "TurboVault Global Protocol (v4.4 — The Royal VIP Edition)";
export const PROTOCOL_DOMAIN = "turbovaultglobal.live";
export const PROTOCOL_EDITION = "The Royal VIP Edition";
export const BLOCKCHAIN_NETWORK = "BNB Smart Chain (BSC)";
export const TOKEN_STANDARD = "USDT (BEP-20)";
export const GAS_FEE_ASSET = "BNB";

// Genesis Setup: Admin Triangle Chain (Top 3 Hardcoded IDs)
export const GENESIS_ADMIN_TRIANGLE = [
  { id: 1, label: "Admin Apex Master #1", address: "0x89A3B56f2B11c6d328F50EcB75FaCeB0F9C11111" },
  { id: 2, label: "Admin Left Core #2", address: "0x44D211F9C01b7a54B4B929a0F1C5F07122222222" },
  { id: 3, label: "Admin Right Core #3", address: "0x98EE44B1D0f5e14d31B91738CaC88d4033333333" }
];

// Sequential Packages ($25 to $1,000)
export const PROTOCOL_PACKAGES = [
  { val: 25, label: "$25 STARTER", tier: "Tier 1", roiCap: 50, hardCap3X: 75, monolineReach: "2 Up + 1 Down", maxDepth: 10 },
  { val: 50, label: "$50 RUNNER", tier: "Tier 2", roiCap: 100, hardCap3X: 150, monolineReach: "4 Up + 2 Down", maxDepth: 15 },
  { val: 100, label: "$100 PRO", tier: "Tier 3", roiCap: 200, hardCap3X: 300, monolineReach: "6 Up + 3 Down", maxDepth: 20 },
  { val: 200, label: "$200 ELITE", tier: "Tier 4", roiCap: 400, hardCap3X: 600, monolineReach: "8 Up + 4 Down", maxDepth: 25 },
  { val: 500, label: "$500 MASTER", tier: "Tier 5", roiCap: 1000, hardCap3X: 1500, monolineReach: "10 Up + 5 Down", maxDepth: 30 },
  { val: 1000, label: "$1,000 TITAN VIP", tier: "Tier 6", roiCap: 2000, hardCap3X: 3000, monolineReach: "10 Up + 5 Down", maxDepth: 40 }
];

// Package-Wise Globaline Reach Tiers (According to Package)
export const GLOBALINE_PACKAGE_TIERS = [
  { pkg: 25, label: "$25 Package", up: 2, down: 1, total: 3, reach: "2 Up + 1 Down" },
  { pkg: 50, label: "$50 Package", up: 4, down: 2, total: 6, reach: "4 Up + 2 Down" },
  { pkg: 100, label: "$100 Package", up: 6, down: 3, total: 9, reach: "6 Up + 3 Down" },
  { pkg: 200, label: "$200 Package", up: 8, down: 4, total: 12, reach: "8 Up + 4 Down" },
  { pkg: 500, label: "$500 Package", up: 10, down: 5, total: 15, reach: "10 Up + 5 Down" },
  { pkg: 1000, label: "$1,000 Package", up: 10, down: 5, total: 15, reach: "10 Up + 5 Down (Max)" }
];

export const getGlobalineReach = (pkgUSD) => {
  const pkg = Number(pkgUSD || 0);
  if (pkg < 25) return { up: 0, down: 0, total: 0, reach: "0 Up + 0 Down (Inactive)" };
  if (pkg < 50) return { up: 2, down: 1, total: 3, reach: "2 Up + 1 Down" };
  if (pkg < 100) return { up: 4, down: 2, total: 6, reach: "4 Up + 2 Down" };
  if (pkg < 200) return { up: 6, down: 3, total: 9, reach: "6 Up + 3 Down" };
  if (pkg < 500) return { up: 8, down: 4, total: 12, reach: "8 Up + 4 Down" };
  return { up: 10, down: 5, total: 15, reach: "10 Up + 5 Down" };
};

// Package Depth Matrix Table
export const PACKAGE_DEPTH_MATRIX = [
  { pkg: 25, depth: 10, label: "$25 Package", unlocked: "10 Levels Deep" },
  { pkg: 50, depth: 15, label: "$50 Package", unlocked: "15 Levels Deep" },
  { pkg: 100, depth: 20, label: "$100 Package", unlocked: "20 Levels Deep" },
  { pkg: 200, depth: 25, label: "$200 Package", unlocked: "25 Levels Deep" },
  { pkg: 500, depth: 30, label: "$500 Package", unlocked: "30 Levels Deep" },
  { pkg: 1000, depth: 40, label: "$1,000 Package", unlocked: "40 Levels Deep" }
];

// 5 Elite Community Pools (100% split of 85% base)
export const COMMUNITY_POOLS = [
  {
    id: "roi",
    name: "Quantum Genesis ROI",
    splitPct: 30,
    capMultiplier: 2.0, // 200% (2X)
    description: "Global passive pool. First 10 days 3% daily, then 1% daily. 1 new direct referral resets 3% rate for another 10 days.",
    rules: {
      initialDailyRate: 3.0,
      initialDays: 10,
      postDaysDailyRate: 1.0,
      directResetDays: 10,
      withdrawalSplit: { cash: 40, reinvest: 60 },
      directsRequiredForWithdrawal: 0
    }
  },
  {
    id: "monoline",
    name: "Globaline Nexus Grid",
    splitPct: 30,
    description: "Global queue (Globaline). 10 active wallets above and 5 active wallets below (Total 15 wallets @ 2% each = 30%) with dynamic compression.",
    reachUpline: 10,
    reachDownline: 5,
    ratePerWalletPct: 2.0
  },
  {
    id: "velocity",
    name: "Velocity Matrix Bonus",
    splitPct: 25,
    description: "Package-wise deep generation income up to 40 levels. Level 1 fixed 13%, L2 3%, L3 2%, L4-L40 1% based on active package tier.",
    levels: [
      { level: 1, pct: 13, reqDirects: 0, note: "0 Directs (Always open for ROI withdrawal, working locked until 3)" },
      { level: 2, pct: 3, reqDirects: 1, note: "Requires 1 active direct" },
      { level: 3, pct: 2, reqDirects: 1, note: "Requires 1 active direct" },
      { level: 4, pct: 1, reqDirects: 2, note: "Requires 2 active directs" },
      { level: 5, pct: 1, reqDirects: 2, note: "Requires 2 active directs" },
      { level: 6, pct: 1, reqDirects: 2, note: "Requires 2 active directs" },
      { level: 7, pct: 1, reqDirects: 3, note: "Requires 3 active directs" },
      { level: "8 to 40", pct: 1, reqDirects: 3, note: "Requires 3 active directs + Tier qualification" }
    ]
  },
  {
    id: "cashback",
    name: "Alpha Cashback Surge",
    splitPct: 10,
    description: "Sponsor 3 active directs within 72 hours of activation to get 100% of your joining fee refunded. Unclaimed funds roll into Community Airdrop Pool.",
    windowHours: 72,
    directsRequired: 3,
    refundPct: 100
  },
  {
    id: "fomo",
    name: "Jackpot Reward",
    splitPct: 5,
    description: "24-hour countdown pool. 70% shared among the last 50 paid users and 30% split among top 3 direct sponsors.",
    countdownHours: 24,
    lastPaidSharePct: 70,
    lastPaidSpots: 50,
    topSponsorsSharePct: 30,
    topSponsorsSpots: 3
  }
];

// Leader Retention & Growth Hooks (30-Day Window)
export const LEADER_MECHANISMS = {
  speedDecay: {
    inactivityDays: 30, // 30-day window
    normalSpeedPct: 100,
    decayedSpeedPct: 10,
    description: "If 0 directs in 30 days, withdrawal speed drops from 50% to 10%. 1 new direct resets to 100%."
  },
  activeDirectMaintenance: {
    periodDays: 30,
    standardRatio: "70% Cash / 30% Reinvest",
    inactivityRatio: "50% Cash / 50% Reinvest",
    requirement: "1 active direct or team volume maintenance every 30 days"
  },
  dynamicOverride: {
    tier1: { directs: "4 – 10 Directs", overridePct: 5, label: "5% Infinity Override" },
    tier2: { directs: "11 – 25 Directs", overridePct: 7, label: "7% Infinity Override" },
    tier3: { directs: "26+ Directs", overridePct: 10, label: "10% Master Leader Royalty" }
  },
  smartCompounding: {
    enabled: true,
    description: "Auto-reinvested portion directly expands activePackageUSD, auto-upgrading package tier and unlocking deeper matrix levels up to 40 levels."
  },
  vipQueueJump: {
    reqDirectsIn30Days: 3,
    rebirthSlot: "VIP Fast-Track Slot at top of global processing"
  }
};

// Royal Throne Leaderboard Ranks
export const ROYAL_RANKS = [
  {
    rank: 1,
    title: "Emperor Sovereign Throne",
    tag: "SAMRAT · CROWN #1",
    crown: "👑",
    crownColor: "#ffd700",
    glowClass: "emperor-glow",
    perk: "Royal Crown Honors + Permanent Royal Hall of Fame"
  },
  {
    rank: 2,
    title: "Grand Crown Prince",
    tag: "ROYAL PRINCE · #2",
    crown: "🥈",
    crownColor: "#e0e7ff",
    glowClass: "prince-glow",
    perk: "VIP Fast-Track Priority + Sovereign Badge"
  },
  {
    rank: 3,
    title: "Royal Grand Duke",
    tag: "GRAND DUKE · #3",
    crown: "🥉",
    crownColor: "#f59e0b",
    glowClass: "duke-glow",
    perk: "Daily Jackpot Share + Grand Duke Crest"
  },
  {
    rank: 4,
    title: "Sovereign Marquis",
    tag: "MARQUIS · #4",
    crown: "🎖️",
    crownColor: "#00e5ff",
    glowClass: "marquis-glow",
    perk: "VIP Fast-Track Rebirth Slot"
  },
  {
    rank: 5,
    title: "Royal Commander",
    tag: "COMMANDER · #5",
    crown: "⚔️",
    crownColor: "#10b981",
    glowClass: "commander-glow",
    perk: "Priority Queue Dividend"
  }
];

// 300% (3X) Hard-Cap & Zero-Leak Rules
export const HARD_CAP_RULES = {
  multiplier: 3, // 300%
  overflowAction: "Directs to System Stability Pool",
  rebirthAction: "Old ID retires; new Re-Birth ID spawned at bottom of Globaline (VIP Fast-Track for active leaders)"
};

// Withdrawal & Reinvestment Rules
export const WITHDRAWAL_RULES = {
  minWithdrawalUSD: 5,
  quantumRoi: {
    teamRequirement: 0,
    cashPct: 40,
    reinvestPct: 60
  },
  workingNetwork: {
    requiredDirectsToUnlock: 3,
    standardSplit: { cash: 70, reinvest: 30 },
    decayedSplit: { cash: 50, reinvest: 50 }
  }
};

// Simulated Real-Time Global Queue Stream Feed
export const LIVE_STREAM_BLOCK = {
  blockNumber: 4892011,
  totalActiveWallets: 14892,
  monolineDepth: 84210,
  dailyTurnoverUSD: 342800,
  initialTicker: [
    { id: 1, wallet: "0x7F8C...31A2", action: "Joined Package: $1,000", detail: "Triggered 5-Pool Split (15% Hidden Admin Reserve Cut + 85% P2P Split)" },
    { id: 2, wallet: "0x3B91...99E4", action: "Re-Birth Loop Triggered", detail: "3X Limit Reached ($3,000) ➔ Spawned New ID at Globaline Bottom Index (VIP Fast-Track)" },
    { id: 3, wallet: "0x112A...55C8", action: "Globaline Nexus Yield Claimed", detail: "Claimed 2% each from Upper 10 / Lower 5 Active Wallets" },
    { id: 4, wallet: "0x98EE...44B1", action: "VIP Ghost Slot Expired", detail: "Unpaid VIP Position deleted after 10-minute timer" },
    { id: 5, wallet: "0x44D2...11F9", action: "Velocity Matrix Payout", detail: "Level 1 (13%) credited instantly to sponsor" },
    { id: 6, wallet: "0x66C3...77B5", action: "Alpha Cashback Achieved", detail: "3 Directs verified ➔ 100% Refund ($500) Issued" }
  ]
};
