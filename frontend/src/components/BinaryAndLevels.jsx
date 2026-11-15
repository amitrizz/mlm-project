import React, { useState } from 'react';
import { Layers, Users, TrendingUp, CheckCircle2, Lock, ArrowRight, Shield, Award, Zap } from 'lucide-react';
import AltruvaLogo from './AltruvaLogo';

export default function BinaryAndLevels({ userData, userDirects = [], txLoading }) {
  const [activeSubTab, setActiveSubTab] = useState('velocity'); // 'velocity' or 'override'
  const [showAll40Levels, setShowAll40Levels] = useState(false);

  const directCount = Number(userData?.directActiveCount || userData?.directCount || (userDirects?.length || 0));
  const activePkg = Number(userData?.activePackageUSD || userData?.totalPackageUSD || 0);

  // Package-wise maximum depth calculator (10 to 40 levels)
  const getMaxDepth = (pkg) => {
    if (pkg < 50) return 10;
    if (pkg < 100) return 15;
    if (pkg < 200) return 20;
    if (pkg < 500) return 25;
    if (pkg < 1000) return 30;
    return 40;
  };

  const userMaxDepth = getMaxDepth(activePkg);
  const baseMemberVol = activePkg > 0 ? activePkg : 50;

  // Generate 40 Levels Velocity Generation Matrix
  const allLevels = [];
  for (let lvl = 1; lvl <= 40; lvl++) {
    let pct = 1;
    let reqDirects = 3;

    if (lvl === 1) {
      pct = 13;
      reqDirects = 0;
    } else if (lvl === 2) {
      pct = 3;
      reqDirects = 1;
    } else if (lvl === 3) {
      pct = 2;
      reqDirects = 1;
    } else if (lvl <= 6) {
      pct = 1;
      reqDirects = 2;
    } else {
      pct = 1;
      reqDirects = 3;
    }

    const isDirectsQualified = lvl === 1 ? true : (directCount >= reqDirects);
    const isPackageQualified = lvl <= userMaxDepth;
    const isUnlocked = isDirectsQualified && isPackageQualified;

    const members = isUnlocked ? (lvl === 1 ? directCount : Math.max(0, directCount * lvl)) : 0;
    const vol = members * baseMemberVol;
    const earned = isUnlocked ? Number((vol * (pct / 100)).toFixed(2)) : 0;

    allLevels.push({
      level: lvl,
      pct,
      reqDirects,
      isUnlocked,
      isPackageQualified,
      members,
      vol,
      earned
    });
  }

  // Display top 15 by default with toggle to expand all 40 levels
  const displayedLevels = showAll40Levels ? allLevels : allLevels.slice(0, 15);

  return (
    <div className="binary-levels-wrap">
      {/* Sub Tabs Toggle */}
      <div className="subtabs-bar glass-panel">
        <button 
          className={`subtab-btn ${activeSubTab === 'velocity' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('velocity')}
        >
          <Layers size={16} /> Stream 3: Velocity Multi-Tier (25% Generation)
        </button>
        <button 
          className={`subtab-btn ${activeSubTab === 'override' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('override')}
        >
          <Award size={16} /> Dynamic Infinity Override (5% – 10% Royalties)
        </button>
      </div>

      {/* STREAM 3: VELOCITY MATRIX BONUS (40 LEVELS) */}
      {activeSubTab === 'velocity' && (
        <div className="binary-tab-content">
          <div className="stream-header-card glass-panel">
            <div className="sh-top">
              <div className="sh-title-box">
                <span className="sh-pill gold-gradient-text">POOL 03 (25% LIVE P2P SPLIT)</span>
                <h2>VELOCITY MATRIX BONUS (UP TO 40 LEVELS)</h2>
                <p>Package-wise deep generation unilevel commission with fixed 13% direct reward on Level 1.</p>
              </div>
              <div className="sh-stats-box">
                <div className="stat-mini">
                  <span>Your Qualified Depth:</span>
                  <strong className="gold-gradient-text">{userMaxDepth} Levels Deep</strong>
                </div>
                <div className="stat-mini">
                  <span>Your Active Directs:</span>
                  <strong className="cyan-gradient-text">{directCount} Directs Verified</strong>
                </div>
              </div>
            </div>

            {/* Direct Unlock Conditions Strip */}
            <div className="daily-rules-strip glass-panel">
              <div className="rule-badge-col">
                <span className="r-tag gold">0 DIRECTS</span>
                <p>Level 1 (13%) is unlocked immediately for ROI withdrawal.</p>
              </div>
              <div className="rule-sep">+</div>
              <div className="rule-badge-col">
                <span className="r-tag">1 DIRECT</span>
                <p>Unlocks Levels 2 & 3 (3% + 2% = 5% Additional).</p>
              </div>
              <div className="rule-sep">+</div>
              <div className="rule-badge-col">
                <span className="r-tag">2 DIRECTS</span>
                <p>Unlocks Levels 4, 5 & 6 (1% + 1% + 1% = 3% Additional).</p>
              </div>
              <div className="rule-sep">+</div>
              <div className="rule-badge-col">
                <span className="r-tag green">3 DIRECTS</span>
                <p>Unlocks Levels 7 to 40 (Full Unilevel + Working 70/30 Withdrawal!).</p>
              </div>
            </div>
          </div>

          {/* Package-Wise Level Depth Matrix Grid */}
          <div className="package-depth-card glass-panel">
            <div className="pdc-header">
              <h4>📦 Package-Wise Level Depth Matrix (Velocity Matrix Depth)</h4>
              <small>Higher packages automatically unlock deeper generation commissions:</small>
            </div>
            <div className="pdc-grid">
              {[
                { pkg: "$25 Package", depth: "10 Levels Deep", target: 25 },
                { pkg: "$50 Package", depth: "15 Levels Deep", target: 50 },
                { pkg: "$100 Package", depth: "20 Levels Deep", target: 100 },
                { pkg: "$200 Package", depth: "25 Levels Deep", target: 200 },
                { pkg: "$500 Package", depth: "30 Levels Deep", target: 500 },
                { pkg: "$1,000 to $6,400", depth: "40 Levels Deep", target: 1000 }
              ].map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`pdc-tier-chip glass-panel ${activePkg >= tier.target ? 'qualified' : ''}`}
                >
                  <span className="pdc-pkg-name">{tier.pkg}</span>
                  <strong className="pdc-depth-val gold-gradient-text">{tier.depth}</strong>
                  {activePkg >= tier.target && <span className="pdc-active-check">✓ Active</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 40-Level Generation Table */}
          <div className="unilevel-table-panel glass-panel">
            <div className="table-top-bar">
              <h4>Velocity Matrix Generations ({displayedLevels.length} of 40 Levels Displayed)</h4>
              <button 
                className="toggle-levels-btn"
                onClick={() => setShowAll40Levels(!showAll40Levels)}
              >
                {showAll40Levels ? 'Show First 15 Levels' : 'View All 40 Levels ➔'}
              </button>
            </div>

            <div className="table-responsive">
              <table className="altruva-table manual-tbl">
                <thead>
                  <tr>
                    <th>LEVEL</th>
                    <th>COMMISSION %</th>
                    <th>DIRECTS REQUIRED</th>
                    <th>PACKAGE DEPTH</th>
                    <th>STATUS</th>
                    <th>TEAM MEMBERS</th>
                    <th>VOLUME (USDT)</th>
                    <th>EARNED (USDT)</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLevels.map((lvl) => (
                    <tr key={lvl.level} className={lvl.isUnlocked ? 'unlocked-row' : 'locked-row'}>
                      <td>
                        <strong className={lvl.level === 1 ? 'gold-gradient-text' : 'cyan-gradient-text'}>
                          Level {lvl.level} {lvl.level === 1 ? '(Directs)' : ''}
                        </strong>
                      </td>
                      <td>
                        <span className={`pill-pct ${lvl.level === 1 ? 'gold' : ''}`}>
                          {lvl.pct}%
                        </span>
                      </td>
                      <td>
                        <small>
                          {lvl.reqDirects === 0 ? '0 Directs (Always Open)' : `${lvl.reqDirects} Directs Required`}
                        </small>
                      </td>
                      <td>
                        <small className={lvl.isPackageQualified ? 'green-txt' : 'yellow-txt'}>
                          {lvl.isPackageQualified ? '✓ Qualified' : 'Upgrade Needed'}
                        </small>
                      </td>
                      <td>
                        {lvl.isUnlocked ? (
                          <span className="status-pill active"><CheckCircle2 size={12} /> Active</span>
                        ) : (
                          <span className="status-pill locked"><Lock size={12} /> Locked</span>
                        )}
                      </td>
                      <td>{lvl.members} Wallets</td>
                      <td>${lvl.vol.toLocaleString()}</td>
                      <td><strong className="green-txt">+${lvl.earned.toLocaleString()} USDT</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC INFINITY OVERRIDE TAB */}
      {activeSubTab === 'override' && (
        <div className="override-tab-content">
          <div className="stream-header-card glass-panel">
            <div className="sh-top">
              <div className="sh-title-box">
                <span className="sh-pill gold-gradient-text">LEADER ENGINE</span>
                <h2>DYNAMIC OVERRIDE TIERING</h2>
                <p>Infinity overrides triggered on 4th and beyond direct referrals across lifetime team turnover.</p>
              </div>
              <div className="sh-stats-box">
                <div className="stat-mini">
                  <span>Current Directs:</span>
                  <strong className="cyan-gradient-text">{directCount} Directs</strong>
                </div>
                <div className="stat-mini">
                  <span>Admin Master Royalty:</span>
                  <strong className="gold-gradient-text">5% – 10% Channel</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="ranks-dual-grid">
            <div className={`rank-card-box glass-panel ${directCount >= 4 && directCount <= 10 ? 'qualified-glow' : ''}`}>
              <div className="rc-header">
                <div className="rc-badge-title">
                  <span className="rank-roman">TIER 1</span>
                  <h3>4 – 10 DIRECTS</h3>
                </div>
                <div className="pool-pct-pill gold-gradient-text">5% OVERRIDE</div>
              </div>
              <p>5% Infinity Override on entire lifetime turnover from 4th to 10th direct lines.</p>
            </div>

            <div className={`rank-card-box glass-panel ${directCount >= 11 && directCount <= 25 ? 'qualified-glow' : ''}`}>
              <div className="rc-header">
                <div className="rc-badge-title">
                  <span className="rank-roman">TIER 2</span>
                  <h3>11 – 25 DIRECTS</h3>
                </div>
                <div className="pool-pct-pill cyan-gradient-text">7% OVERRIDE</div>
              </div>
              <p>7% Dynamic Override across 11th to 25th direct organization volume.</p>
            </div>

            <div className={`rank-card-box glass-panel ${directCount >= 26 ? 'qualified-glow' : ''}`}>
              <div className="rc-header">
                <div className="rc-badge-title">
                  <span className="rank-roman">MASTER VIP</span>
                  <h3>26+ DIRECTS</h3>
                </div>
                <div className="pool-pct-pill gold-gradient-text">10% MASTER ROYALTY</div>
              </div>
              <p>10% Master Royalty channeled permanently to Master Wallet on all team production.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
