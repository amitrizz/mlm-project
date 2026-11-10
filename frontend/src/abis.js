export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)"
];

// Unified Altruva / Sovereign Protocol ABI supporting both on-chain deployed versions
export const ALTRUVA_CORE_ABI = [
  // Events
  "event Registered(address indexed user, address indexed referrer, uint256 globalIndex)",
  "event PackagePurchased(address indexed user, uint256 amountUSD, bool isReinvestment)",
  "event SingleLegDistributed(address indexed source, address indexed recipient, uint256 amountUSD, uint256 level, bool isUpline)",
  "event LevelCommissionDistributed(address indexed source, address indexed recipient, uint256 amountUSD, uint256 level)",
  "event Withdrawn(address indexed user, uint256 grossAmountUSD, uint256 sentToWalletUSD, uint256 reinvestedUSD, bool isRoiWithdrawal)",

  // Write functions
  "function registerAndActivate(address _referrer, uint256 _amountUSD, uint8 _preferredLeg) external",
  "function registerAndActivate(address _referrer, uint256 _packageUSD) external",
  "function upgradePackage(uint256 _amountUSD) external",
  "function withdraw(uint256 _amountUSD) external",
  "function withdrawRoi(uint256 _amountUSD) external",
  "function withdrawWorking(uint256 _amountUSD) external",
  "function claimQuantumRoi() external",
  "function claim72HCashback() external",
  "function settleDailyLeadership() external",
  "function settleFomoJackpot() external",

  // View / Read functions (Live Deployed AltruvaCore)
  "function users(address) view returns (bool registered, uint256 globalIndex, address referrer, uint256 totalPackageUSD, uint256 selfDepositUSD, uint256 selfReinvestUSD, uint256 registrationTime, uint256 directCount, uint256 directActiveCount, uint256 leftVolume, uint256 rightVolume, uint256 matchedVolume, uint8 preferredLeg, uint256 claimableEarnings, uint256 totalWithdrawnUSD, uint256 totalEarnedUSD, bool nexusQualified, bool legacyCrownQualified, bool exitedLeadership, uint256 scratchCoupons)",
  "function getGlobalUsersCount() view returns (uint256)",
  "function totalCompanyVolumeUSD() view returns (uint256)",
  "function totalWithdrawnSystemUSD() view returns (uint256)",
  "function jackpotPool() view returns (uint256)",
  "function nexusPool() view returns (uint256)",
  "function legacyCrownPool() view returns (uint256)",
  "function globalUsers(uint256) view returns (address)",
  "function getDirects(address _user) view returns (address[])",
  "function getSingleLegOpenLevels(address _user) view returns (uint256 halfLevels, uint256 totalLevels)",

  // Additional getters from v3.3 architecture
  "function getMonolineCount() view returns (uint256)",
  "function fomoJackpotPool() view returns (uint256)",
  "function cashbackPool() view returns (uint256)",
  "function stabilityPool() view returns (uint256)",
  "function fomoRoundEndTime() view returns (uint256)",
  "function adminApex1() view returns (address)",
  "function usdtToken() view returns (address)"
];

export const SOVEREIGN_CORE_ABI = ALTRUVA_CORE_ABI;
