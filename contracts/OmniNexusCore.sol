// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OMNI-NEXUS GLOBAL PROTOCOL (v4.4 — The Royal VIP Edition)
 * @notice The Ultimate Compounding Matrix & Royal VIP Live Ranking Protocol
 * @dev 100% P2P Instant Split on BNB Smart Chain (BSC) in USDT (BEP-20)
 * 
 * 1. 15% Silent Admin Reserve Extraction (Direct to Master Wallet before community split)
 * 2. 5 Elite Community Pools (100% split of remaining 85% base):
 *    - Pool 1: Quantum Genesis ROI: 30% (2X Cap, 3% first 10 days, 1% after, direct resets 3% for 10 days)
 *    - Pool 2: Globaline Nexus Grid: 30% (10 Active Uplines + 5 Active Downlines @ 2% each = 15 wallets)
 *    - Pool 3: Velocity Matrix Bonus: 25% (Package-wise Depth: 10 to 40 Levels Deep, L1 13% fixed)
 *    - Pool 4: 72H Alpha Cashback Surge: 10% (3 directs in 72h = 100% refund, or Airdrop Pool)
 *    - Pool 5: Apocalypse Jackpot Vault: 5% (24H countdown: 70% last 50 users, 30% top 3 sponsors)
 * 
 * 3. Smart Compounding Engine: Auto-reinvested funds directly add to activePackageUSD,
 *    naturally compounding tier and unlocking deeper matrix levels up to 40 levels.
 * 4. Zero-Leak 300% (3X) Hard-Cap & Re-Birth Loop.
 * 5. 30-Day Speed-Decay & Maintenance Engine.
 * 6. Genesis Admin Triangle (3 Fixed Apex IDs) + Secret Admin Master Wallet.
 */
contract OmniNexusCore is Ownable, ReentrancyGuard {
    IERC20 public immutable usdtToken;

    // Minimum withdrawal in USDT (18 decimals)
    uint256 public constant MIN_WITHDRAWAL_USD = 5 * 10**18;
    uint256 public constant HARD_CAP_MULTIPLIER = 3; // 300%
    uint256 public constant ROI_CAP_MULTIPLIER = 2;  // 200%

    // 15% Silent Admin Reserve (1500 basis points / 10000)
    uint256 public constant ADMIN_RESERVE_BPS = 1500;
    address public adminMasterWallet;

    // Standard Packages ($25 to $6,400)
    uint256 public constant PKG_25   = 25 * 10**18;
    uint256 public constant PKG_50   = 50 * 10**18;
    uint256 public constant PKG_100  = 100 * 10**18;
    uint256 public constant PKG_200  = 200 * 10**18;
    uint256 public constant PKG_500  = 500 * 10**18;
    uint256 public constant PKG_1000 = 1000 * 10**18;
    uint256 public constant PKG_2000 = 2000 * 10**18;
    uint256 public constant PKG_3200 = 3200 * 10**18;
    uint256 public constant PKG_6400 = 6400 * 10**18;

    // Velocity Matrix Percents (Basis Points / 10000)
    // L1: 13%, L2: 3%, L3: 2%, L4-L10: 1% each (Total = 2500 = 25%)
    // Levels 11 to 40 eligible uplines participate in unilevel depth based on package
    uint256[10] public velocityPercents = [
        1300, 300, 200, 100, 100, 100, 100, 100, 100, 100
    ];

    // Admin Genesis Triangle (3 Fixed Apex IDs)
    address public adminApex1;
    address public adminLeft2;
    address public adminRight3;

    struct User {
        bool registered;
        uint256 globalIndex;           // Chronological monoline placement (1-based)
        address referrer;              // Direct sponsor
        uint256 activePackageUSD;      // Current active tier amount (auto-compounds)
        uint256 totalPackageUSD;       // Total package amount
        uint256 cumulativeDepositUSD;  // Fresh deposits
        uint256 cumulativeReinvestUSD; // Auto-reinvested funds
        uint256 registrationTime;      // Initial join timestamp
        uint256 packageActivationTime; // Last package or re-birth time
        
        // Direct referral metrics
        uint256 directCount;
        uint256 directActiveCount;
        uint256 lastDirectTimestamp;   // For 30-Day Speed-Decay
        uint256 directsIn30Days;       // Rolling count
        
        // 72H Cashback Surge Mission
        bool cashbackClaimed;
        bool cashbackEligible;
        uint256 cashbackDirectsCount;

        // Time-Bomb Quantum Genesis ROI
        uint256 roiAccruedUSD;
        uint256 lastRoiClaimTimestamp;
        uint256 boostEndTimestamp;     // Active 3% daily boost window (10 days)

        // Financial balances
        uint256 claimableRoiUSD;       // ROI available to withdraw (40/60)
        uint256 claimableWorkingUSD;   // Working balance (locked until 3 directs, 70/30)
        uint256 totalWithdrawnUSD;     // Sent to user wallet
        uint256 totalEarnedUSD;        // Cumulative gross earnings against 300% Hard-Cap
        
        // Hard-Cap & Rebirth state
        bool isHardCapped;             // Reached 300%
        uint256 rebirthCount;          // Total rebirth cycles
        bool isVipFastTrack;           // Qualified for priority queue jump
    }

    // Monoline storage
    address[] public monolineUsers;
    mapping(address => User) public users;
    mapping(address => address[]) public directs;

    // Pools
    uint256 public cashbackPool;        // 10% 72H Alpha Cashback Surge pool
    uint256 public fomoJackpotPool;      // 5% Apocalypse Jackpot Vault pool
    uint256 public stabilityPool;        // Spillovers, breakage & hard-cap overflows
    uint256 public totalSystemVolumeUSD;
    uint256 public totalSystemWithdrawnUSD;

    // Apocalypse Jackpot state (24-hour countdown)
    uint256 public fomoRound;
    uint256 public fomoRoundEndTime;
    address[] public fomoRecentBuyers;   // Last 50 paid users
    address[3] public topSponsors;       // Top 3 direct sponsors of current 24H round
    uint256[3] public topSponsorDirects;

    // Events
    event Registered(address indexed user, address indexed referrer, uint256 globalIndex, uint256 packageUSD);
    event PackageActivated(address indexed user, uint256 packageUSD, bool isRebirth);
    event QuantumRoiBoosted(address indexed user, uint256 newBoostEnd);
    event GlobalineYieldPaid(address indexed source, address indexed recipient, uint256 amountUSD, uint256 slot, bool isUpline);
    event VelocityCommissionPaid(address indexed source, address indexed recipient, uint256 amountUSD, uint256 level);
    event DynamicOverridePaid(address indexed sponsor, address indexed admin, uint256 overrideUSD, uint256 directCount);
    event CashbackClaimed(address indexed user, uint256 refundUSD);
    event ApocalypseRoundSettled(uint256 roundId, uint256 totalDistributed, uint256 buyersShare, uint256 sponsorsShare);
    event HardCapReached(address indexed user, uint256 packageUSD, uint256 totalEarnedUSD);
    event RebirthTriggered(address indexed user, uint256 newIndex, bool isVipFastTrack);
    event Withdrawn(address indexed user, uint256 grossAmountUSD, uint256 sentToWalletUSD, uint256 reinvestedUSD, bool isRoiWithdrawal);

    constructor(
        address _usdtAddress,
        address _adminApex1,
        address _adminLeft2,
        address _adminRight3,
        address _adminMasterWallet
    ) Ownable(msg.sender) {
        require(_usdtAddress != address(0), "Invalid USDT");
        require(_adminApex1 != address(0) && _adminLeft2 != address(0) && _adminRight3 != address(0), "Invalid Admin Triangle");
        
        usdtToken = IERC20(_usdtAddress);
        adminApex1 = _adminApex1;
        adminLeft2 = _adminLeft2;
        adminRight3 = _adminRight3;
        adminMasterWallet = _adminMasterWallet != address(0) ? _adminMasterWallet : _adminApex1;

        fomoRoundEndTime = block.timestamp + 24 hours;

        // Hardcode Genesis Admin Triangle Chain (Top 3 IDs)
        _initGenesisAdmin(adminApex1, address(0));
        _initGenesisAdmin(adminLeft2, adminApex1);
        _initGenesisAdmin(adminRight3, adminApex1);
    }

    function _initGenesisAdmin(address _admin, address _sponsor) internal {
        monolineUsers.push(_admin);
        uint256 idx = monolineUsers.length;
        
        User storage u = users[_admin];
        u.registered = true;
        u.globalIndex = idx;
        u.referrer = _sponsor;
        u.activePackageUSD = PKG_6400;
        u.totalPackageUSD = PKG_6400;
        u.cumulativeDepositUSD = PKG_6400;
        u.registrationTime = block.timestamp;
        u.packageActivationTime = block.timestamp;
        u.lastDirectTimestamp = block.timestamp;
        u.boostEndTimestamp = block.timestamp + 365 days;
        u.directCount = 100;
        u.directActiveCount = 100;
    }

    /**
     * @notice Register and activate package in OMNI-NEXUS Global Protocol
     */
    function registerAndActivate(address _referrer, uint256 _packageUSD) external nonReentrant {
        require(!users[msg.sender].registered, "Already registered");
        _validatePackage(_packageUSD);

        require(usdtToken.transferFrom(msg.sender, address(this), _packageUSD), "USDT transfer failed");

        address sponsor = _referrer;
        if (sponsor == address(0) || sponsor == msg.sender || !users[sponsor].registered) {
            sponsor = adminApex1;
        }

        monolineUsers.push(msg.sender);
        uint256 gIdx = monolineUsers.length;

        User storage u = users[msg.sender];
        u.registered = true;
        u.globalIndex = gIdx;
        u.referrer = sponsor;
        u.activePackageUSD = _packageUSD;
        u.totalPackageUSD = _packageUSD;
        u.cumulativeDepositUSD = _packageUSD;
        u.registrationTime = block.timestamp;
        u.packageActivationTime = block.timestamp;
        u.lastDirectTimestamp = block.timestamp;
        u.lastRoiClaimTimestamp = block.timestamp;
        u.boostEndTimestamp = block.timestamp + 10 days;

        directs[sponsor].push(msg.sender);
        users[sponsor].directCount++;
        users[sponsor].directActiveCount++;
        users[sponsor].lastDirectTimestamp = block.timestamp;
        users[sponsor].boostEndTimestamp = block.timestamp + 10 days;

        totalSystemVolumeUSD += _packageUSD;

        emit Registered(msg.sender, sponsor, gIdx, _packageUSD);
        emit PackageActivated(msg.sender, _packageUSD, false);

        // Record for 72H Cashback surge mission
        if (block.timestamp <= users[sponsor].registrationTime + 72 hours) {
            users[sponsor].cashbackDirectsCount++;
            if (users[sponsor].cashbackDirectsCount >= 3) {
                users[sponsor].cashbackEligible = true;
            }
        }

        // Record for FOMO Apocalypse Vault & Top Sponsors
        _recordFomoEntry(msg.sender, sponsor);

        // Execute 15% Silent Admin Cut and 5 Community Pools Distribution
        _executeFivePoolSplit(msg.sender, _packageUSD);
    }

    /**
     * @notice Upgrade active package
     */
    function upgradePackage(uint256 _packageUSD) external nonReentrant {
        User storage u = users[msg.sender];
        require(u.registered, "Not registered");
        require(!u.isHardCapped, "Hardcap reached: must rebirth");
        _validatePackage(_packageUSD);
        require(_packageUSD > u.activePackageUSD, "Must be higher tier");

        require(usdtToken.transferFrom(msg.sender, address(this), _packageUSD), "USDT transfer failed");

        u.activePackageUSD = _packageUSD;
        u.totalPackageUSD = _packageUSD;
        u.cumulativeDepositUSD += _packageUSD;
        u.packageActivationTime = block.timestamp;
        u.boostEndTimestamp = block.timestamp + 10 days;

        totalSystemVolumeUSD += _packageUSD;

        emit PackageActivated(msg.sender, _packageUSD, false);

        _recordFomoEntry(msg.sender, u.referrer);
        _executeFivePoolSplit(msg.sender, _packageUSD);
    }

    function _validatePackage(uint256 _pkg) internal pure {
        require(
            _pkg == PKG_25   || _pkg == PKG_50   || _pkg == PKG_100  ||
            _pkg == PKG_200  || _pkg == PKG_500  || _pkg == PKG_1000 ||
            _pkg == PKG_2000 || _pkg == PKG_3200 || _pkg == PKG_6400,
            "Invalid package tier"
        );
    }

    /**
     * @dev Core 15% Silent Admin Cut + 5 Community Pools Split
     */
    function _executeFivePoolSplit(address _user, uint256 _amountUSD) internal {
        // 1. Silent 15% Admin Reserve Extraction
        uint256 adminReserve = (_amountUSD * ADMIN_RESERVE_BPS) / 10000;
        if (adminReserve > 0 && adminMasterWallet != address(0)) {
            usdtToken.transfer(adminMasterWallet, adminReserve);
        }

        // 85% remaining treated as 100% community distribution base
        uint256 distBase = _amountUSD - adminReserve;

        // Pool 1: 30% Quantum Genesis ROI
        // Reserve stays in contract for daily claim

        // Pool 2: 30% Globaline Nexus Grid (10 Up + 5 Down = 15 Wallets @ 2% each)
        _distributeGlobalineGrid(_user, distBase);

        // Pool 3: 25% Velocity Matrix Bonus (Up to 40 Levels Depth)
        _distributeVelocityBonus(_user, distBase);

        // Pool 4: 10% Alpha Cashback Surge Pool
        cashbackPool += (distBase * 10) / 100;

        // Pool 5: 5% Apocalypse Jackpot Vault Pool
        fomoJackpotPool += (distBase * 5) / 100;
    }

    /**
     * @dev Pool 2: Globaline Nexus Grid (30%)
     * 10 active wallets above and 5 active wallets below @ 2% each (Total = 15 wallets @ 2% = 30%)
     */
    /**
     * @dev Package-wise Globaline Reach Calculator (Package ke hisab se)
     */
    function getGlobalineReach(uint256 _pkgUSD) public pure returns (uint256 maxUp, uint256 maxDown) {
        if (_pkgUSD < PKG_50) {
            return (2, 1);  // $25 = 2 Up + 1 Down
        } else if (_pkgUSD < PKG_100) {
            return (4, 2);  // $50 = 4 Up + 2 Down
        } else if (_pkgUSD < PKG_200) {
            return (6, 3);  // $100 = 6 Up + 3 Down
        } else if (_pkgUSD < PKG_500) {
            return (8, 4);  // $200 = 8 Up + 4 Down
        } else {
            return (10, 5); // $500+ = 10 Up + 5 Down (Max)
        }
    }

    function _distributeGlobalineGrid(address _user, uint256 _distBase) internal {
        uint256 twoPercent = (_distBase * 2) / 100;
        uint256 userIdx = users[_user].globalIndex; // 1-based
        uint256 uplineCount = 0;
        uint256 downlineCount = 0;

        // 10 Active Uplines (2% each = 20%, qualified package ke hisab se)
        if (userIdx > 1) {
            for (uint256 i = userIdx - 1; i >= 1 && uplineCount < 10; i--) {
                address up = monolineUsers[i - 1];
                if (users[up].activePackageUSD > 0 && !users[up].isHardCapped) {
                    (uint256 maxUp, ) = getGlobalineReach(users[up].activePackageUSD);
                    uint256 dist = userIdx - i;
                    if (dist <= maxUp) {
                        _creditEarnings(up, twoPercent, false);
                        emit GlobalineYieldPaid(_user, up, twoPercent, uplineCount + 1, true);
                    } else {
                        // Unearned due to lower package tier routes to Genesis Apex
                        _creditEarnings(adminApex1, twoPercent, false);
                    }
                    uplineCount++;
                }
            }
        }
        // Breakage for unfilled uplines routes to Genesis Apex
        if (uplineCount < 10) {
            uint256 breakage = (10 - uplineCount) * twoPercent;
            _creditEarnings(adminApex1, breakage, false);
        }

        // 5 Active Downlines (2% each = 10%, qualified package ke hisab se)
        for (uint256 i = userIdx + 1; i <= monolineUsers.length && downlineCount < 5; i++) {
            address down = monolineUsers[i - 1];
            if (users[down].activePackageUSD > 0 && !users[down].isHardCapped) {
                (, uint256 maxDown) = getGlobalineReach(users[down].activePackageUSD);
                uint256 dist = i - userIdx;
                if (dist <= maxDown) {
                    _creditEarnings(down, twoPercent, false);
                    emit GlobalineYieldPaid(_user, down, twoPercent, downlineCount + 1, false);
                } else {
                    // Unearned due to lower package tier routes to Genesis Left/Right
                    _creditEarnings(adminLeft2, twoPercent, false);
                }
                downlineCount++;
            }
        }
        // Breakage for unfilled downlines routes to Genesis Left/Right
        if (downlineCount < 5) {
            uint256 breakage = (5 - downlineCount) * twoPercent;
            _creditEarnings(adminLeft2, breakage, false);
        }
    }

    /**
     * @dev Package-wise Depth Matrix Calculator (Up to 40 Levels)
     */
    function getMaxLevelDepth(uint256 _pkgUSD) public pure returns (uint256) {
        if (_pkgUSD < PKG_50)   return 10; // $25 = 10 levels
        if (_pkgUSD < PKG_100)  return 15; // $50 = 15 levels
        if (_pkgUSD < PKG_200)  return 20; // $100 = 20 levels
        if (_pkgUSD < PKG_500)  return 25; // $200 = 25 levels
        if (_pkgUSD < PKG_1000) return 30; // $500 = 30 levels
        return 40;                         // $1000 to $6400 = 40 levels
    }

    /**
     * @dev Pool 3: Velocity Matrix Bonus (25%)
     * Level 1: 13%, Level 2: 3%, Level 3: 2%, Levels 4-10: 1% each
     * Package depth controls how deep generations are credited (10 to 40 levels)
     */
    function _distributeVelocityBonus(address _user, uint256 _distBase) internal {
        address current = users[_user].referrer;
        
        for (uint256 level = 0; level < 40; level++) {
            if (current == address(0)) {
                break;
            }

            uint256 directsCount = users[current].directActiveCount;
            uint256 userMaxDepth = getMaxLevelDepth(users[current].activePackageUSD);

            // Directs unlock conditions:
            // L1: 0 directs, L2-L3: 1 direct, L4-L6: 2 directs, L7+: 3 directs
            bool eligibleDirects = false;
            if (level == 0) eligibleDirects = true;
            else if (level <= 2) eligibleDirects = (directsCount >= 1);
            else if (level <= 5) eligibleDirects = (directsCount >= 2);
            else eligibleDirects = (directsCount >= 3);

            if (eligibleDirects && level < userMaxDepth && !users[current].isHardCapped) {
                uint256 percent = 0;
                if (level < 10) {
                    percent = velocityPercents[level];
                } else {
                    percent = 100; // 1% for levels 11-40
                }

                uint256 comm = (_distBase * percent) / 10000;
                if (comm > 0) {
                    _creditEarnings(current, comm, false);
                    emit VelocityCommissionPaid(_user, current, comm, level + 1);
                }
            }

            // Dynamic Infinity Override (4-10: 5%, 11-25: 7%, 26+: 10%)
            if (level == 0 && directsCount >= 4) {
                _processDynamicOverride(current, _distBase, directsCount);
            }

            current = users[current].referrer;
        }
    }

    function _processDynamicOverride(address _sponsor, uint256 _distBase, uint256 _directs) internal {
        uint256 overrideBps = 0;
        if (_directs >= 26) {
            overrideBps = 1000; // 10%
        } else if (_directs >= 11) {
            overrideBps = 700;  // 7%
        } else if (_directs >= 4) {
            overrideBps = 500;  // 5%
        }

        if (overrideBps > 0) {
            uint256 overrideUSD = (_distBase * overrideBps) / 10000;
            // Channeled to Master Admin Wallet as per protocol architecture
            _creditEarnings(adminMasterWallet, overrideUSD, false);
            emit DynamicOverridePaid(_sponsor, adminMasterWallet, overrideUSD, _directs);
        }
    }

    /**
     * @notice Quantum Genesis ROI pending view (2X passive cap)
     */
    function getPendingQuantumRoi(address _user) public view returns (uint256) {
        User storage u = users[_user];
        if (u.activePackageUSD == 0 || u.isHardCapped) return 0;

        uint256 maxRoiUSD = u.activePackageUSD * ROI_CAP_MULTIPLIER;
        if (u.roiAccruedUSD >= maxRoiUSD) return 0;

        uint256 timeElapsed = block.timestamp - u.lastRoiClaimTimestamp;
        if (timeElapsed == 0) return 0;

        uint256 dailyYield = 0;
        if (block.timestamp < u.boostEndTimestamp) {
            // 3% daily rate (300 bps / 10000)
            dailyYield = (u.activePackageUSD * 300) / 10000;
        } else {
            // 1% daily rate (100 bps / 10000)
            dailyYield = (u.activePackageUSD * 100) / 10000;
        }

        uint256 accrued = (dailyYield * timeElapsed) / 1 days;
        if (u.roiAccruedUSD + accrued > maxRoiUSD) {
            accrued = maxRoiUSD - u.roiAccruedUSD;
        }
        return accrued;
    }

    function claimQuantumRoi() external nonReentrant {
        uint256 pending = getPendingQuantumRoi(msg.sender);
        require(pending > 0, "No pending ROI");

        User storage u = users[msg.sender];
        u.roiAccruedUSD += pending;
        u.lastRoiClaimTimestamp = block.timestamp;

        _creditEarnings(msg.sender, pending, true);
    }

    function claim72HCashback() external nonReentrant {
        User storage u = users[msg.sender];
        require(u.registered, "Not registered");
        require(!u.cashbackClaimed, "Already claimed");
        require(u.cashbackEligible, "Not eligible");
        require(block.timestamp <= u.registrationTime + 72 hours, "Window expired");

        u.cashbackClaimed = true;
        uint256 refund = u.activePackageUSD; // 100% refund

        if (refund > cashbackPool) {
            refund = cashbackPool;
        }
        require(refund > 0, "Empty cashback pool");
        cashbackPool -= refund;

        _creditEarnings(msg.sender, refund, false);
        emit CashbackClaimed(msg.sender, refund);
    }

    function _creditEarnings(address _user, uint256 _amount, bool _isRoi) internal {
        if (_amount == 0 || _user == address(0)) return;

        User storage u = users[_user];
        uint256 hardCap = u.activePackageUSD * HARD_CAP_MULTIPLIER;

        if (u.totalEarnedUSD + _amount >= hardCap && hardCap > 0) {
            uint256 eligible = hardCap > u.totalEarnedUSD ? hardCap - u.totalEarnedUSD : 0;
            uint256 overflow = _amount - eligible;

            if (eligible > 0) {
                if (_isRoi) u.claimableRoiUSD += eligible;
                else u.claimableWorkingUSD += eligible;
                u.totalEarnedUSD = hardCap;
            }

            if (overflow > 0) {
                stabilityPool += overflow;
            }

            u.isHardCapped = true;
            emit HardCapReached(_user, u.activePackageUSD, u.totalEarnedUSD);
        } else {
            u.totalEarnedUSD += _amount;
            if (_isRoi) {
                u.claimableRoiUSD += _amount;
            } else {
                u.claimableWorkingUSD += _amount;
            }
        }
    }

    /**
     * @notice Withdraw Quantum Genesis ROI (Always unlocked, 40% Cash / 60% Auto-reinvest)
     */
    function withdrawRoi(uint256 _amountUSD) external nonReentrant {
        User storage u = users[msg.sender];
        require(u.claimableRoiUSD >= _amountUSD, "Insufficient ROI");
        require(_amountUSD >= MIN_WITHDRAWAL_USD, "Min withdrawal $5 USDT");

        u.claimableRoiUSD -= _amountUSD;

        // 40% Cash / 60% Auto-reinvest
        uint256 cashUSD = (_amountUSD * 40) / 100;
        uint256 reinvestUSD = _amountUSD - cashUSD;

        _processWithdrawalTransfers(msg.sender, cashUSD, reinvestUSD, true);
    }

    /**
     * @notice Withdraw Working balance (Locked until 3 directs, 70% Cash / 30% Auto-reinvest)
     * Speed-Decay: 30-Day inactivity changes split to 50/50
     */
    function withdrawWorking(uint256 _amountUSD) external nonReentrant {
        User storage u = users[msg.sender];
        require(u.directActiveCount >= 3, "Requires 3 active directs");
        require(u.claimableWorkingUSD >= _amountUSD, "Insufficient balance");
        require(_amountUSD >= MIN_WITHDRAWAL_USD, "Min withdrawal $5 USDT");

        u.claimableWorkingUSD -= _amountUSD;

        uint256 cashRatio = 70;
        uint256 reinvestRatio = 30;

        // 30-Day Speed Decay Inactivity check
        if (block.timestamp - u.lastDirectTimestamp > 30 days) {
            cashRatio = 50;
            reinvestRatio = 50;
        }

        uint256 cashUSD = (_amountUSD * cashRatio) / 100;
        uint256 reinvestUSD = _amountUSD - cashUSD;

        _processWithdrawalTransfers(msg.sender, cashUSD, reinvestUSD, false);
    }

    function _processWithdrawalTransfers(
        address _user,
        uint256 _cashUSD,
        uint256 _reinvestUSD,
        bool _isRoi
    ) internal {
        User storage u = users[_user];
        u.totalWithdrawnUSD += _cashUSD;

        // Smart Compounding: Reinvestment expands activePackageUSD
        u.cumulativeReinvestUSD += _reinvestUSD;
        u.activePackageUSD += _reinvestUSD;
        u.totalPackageUSD = u.activePackageUSD;

        totalSystemWithdrawnUSD += _cashUSD;

        require(usdtToken.transfer(_user, _cashUSD), "Cash transfer failed");

        emit Withdrawn(_user, _cashUSD + _reinvestUSD, _cashUSD, _reinvestUSD, _isRoi);

        // Check if hardcapped for automatic rebirth
        if (u.isHardCapped) {
            _executeRebirth(_user);
        }
    }

    function _executeRebirth(address _user) internal {
        User storage u = users[_user];
        u.rebirthCount++;
        u.isHardCapped = false;
        u.roiAccruedUSD = 0;
        u.totalEarnedUSD = 0;

        bool isVip = (u.directsIn30Days >= 3);
        u.isVipFastTrack = isVip;

        monolineUsers.push(_user);
        uint256 newIdx = monolineUsers.length;
        u.globalIndex = newIdx;
        u.packageActivationTime = block.timestamp;
        u.lastRoiClaimTimestamp = block.timestamp;
        u.boostEndTimestamp = block.timestamp + 10 days;

        emit RebirthTriggered(_user, newIdx, isVip);
    }

    function _recordFomoEntry(address _buyer, address _sponsor) internal {
        fomoRecentBuyers.push(_buyer);
        if (fomoRecentBuyers.length > 50) {
            // Keep last 50
            for (uint256 i = 0; i < 49; i++) {
                fomoRecentBuyers[i] = fomoRecentBuyers[i + 1];
            }
            fomoRecentBuyers.pop();
        }

        _updateTopSponsors(_sponsor);
    }

    function _updateTopSponsors(address _sponsor) internal {
        if (_sponsor == address(0)) return;

        for (uint256 i = 0; i < 3; i++) {
            if (topSponsors[i] == _sponsor) {
                topSponsorDirects[i]++;
                return;
            }
        }
        for (uint256 i = 0; i < 3; i++) {
            if (topSponsors[i] == address(0)) {
                topSponsors[i] = _sponsor;
                topSponsorDirects[i] = 1;
                return;
            }
        }
    }

    function settleFomoJackpot() external nonReentrant {
        require(block.timestamp >= fomoRoundEndTime, "Round active");
        require(fomoJackpotPool > 0, "Empty pool");

        uint256 totalPot = fomoJackpotPool;
        fomoJackpotPool = 0;
        fomoRound++;
        fomoRoundEndTime = block.timestamp + 24 hours;

        uint256 buyersShare = (totalPot * 70) / 100;
        uint256 sponsorsShare = totalPot - buyersShare;

        // 70% to last 50 paid buyers
        uint256 buyerCount = fomoRecentBuyers.length;
        if (buyerCount > 0) {
            uint256 perBuyer = buyersShare / buyerCount;
            for (uint256 i = 0; i < buyerCount; i++) {
                _creditEarnings(fomoRecentBuyers[i], perBuyer, false);
            }
        }

        // 30% to top 3 sponsors
        uint256 sponsorSlots = 0;
        for (uint256 i = 0; i < 3; i++) {
            if (topSponsors[i] != address(0)) sponsorSlots++;
        }
        if (sponsorSlots > 0) {
            uint256 perSponsor = sponsorsShare / sponsorSlots;
            for (uint256 i = 0; i < 3; i++) {
                if (topSponsors[i] != address(0)) {
                    _creditEarnings(topSponsors[i], perSponsor, false);
                }
            }
        }

        // Reset
        delete fomoRecentBuyers;
        delete topSponsors;
        delete topSponsorDirects;

        emit ApocalypseRoundSettled(fomoRound - 1, totalPot, buyersShare, sponsorsShare);
    }

    function getMonolineCount() external view returns (uint256) {
        return monolineUsers.length;
    }

    function getDirects(address _user) external view returns (address[] memory) {
        return directs[_user];
    }
}

