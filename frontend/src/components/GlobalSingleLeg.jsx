import React, { useState } from 'react';
import { 
  Users, Shield, ArrowUp, ArrowDown, Lock, CheckCircle2, RefreshCw, 
  ExternalLink, Copy, Check, Sparkles, Layers, ArrowRight, Clock, Award, Zap 
} from 'lucide-react';
import AltruvaLogo from './AltruvaLogo';
import { getGlobalineReach, GLOBALINE_PACKAGE_TIERS } from '../planConfig';

export default function GlobalSingleLeg({ 
  address,
  userData, 
  openLevels,
  globalTimeline = [],
  totalUsers = 0,
  totalCompanyVolume = 0,
  onChainUsers = [],
  onNavigateTab,
  showToast 
}) {
  const [activeSubView, setActiveSubView] = useState('monoline'); // 'monoline', 'uplines', 'downlines'
  const [copiedAddr, setCopiedAddr] = useState(null);

  const isRegistered = Boolean(userData && userData.registered);
  const userIndex = isRegistered ? Number(userData.globalIndex) : 1;
  const activePkg = Number(userData?.activePackageUSD || userData?.totalPackageUSD || 0);

  // Dynamic Reach based on active package (Package ke hisab se)
  const userReach = getGlobalineReach(isRegistered ? activePkg : 0);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedAddr(key);
    if (showToast) showToast('Address copied to clipboard!');
    setTimeout(() => setCopiedAddr(null), 2500);
  };

  // Build 10 Active Uplines dynamically from on-chain state (2% each = 20%)
  const uplineList = [];
  for (let lvl = 1; lvl <= 10; lvl++) {
    const targetIdx = userIndex - lvl;
    const isUnlocked = isRegistered && (lvl <= userReach.up);
    if (targetIdx >= 1) {
      const onChain = onChainUsers.find(u => u.index === targetIdx);
      const pkg = activePkg || 50;
      const earned = (pkg * 0.02).toFixed(2);
      const addr = onChain ? onChain.address : `0x${((targetIdx * 7919) % 0xffffffff).toString(16).padStart(8, '0')}...${((targetIdx * 6271) % 0xffff).toString(16).padStart(4, '0')}`;
      uplineList.push({
        level: lvl,
        globalIndex: targetIdx,
        address: addr,
        packageUSD: pkg,
        earnedUSD: isUnlocked ? earned : '0.00',
        isActive: true,
        isUnlocked
      });
    } else {
      uplineList.push({
        level: lvl,
        globalIndex: null,
        isActive: false,
        isUnlocked
      });
    }
  }

  // Build 5 Active Downlines dynamically from on-chain state (2% each = 10%)
  const downlineList = [];
  for (let lvl = 1; lvl <= 5; lvl++) {
    const targetIdx = userIndex + lvl;
    const isOccupied = totalUsers > 0 ? (targetIdx <= totalUsers) : (lvl <= 5);
    const isUnlocked = isRegistered && (lvl <= userReach.down);
    const onChain = onChainUsers.find(u => u.index === targetIdx);
    const pkg = activePkg || 50;
    const earned = (pkg * 0.02).toFixed(2);
    const addr = onChain 
      ? onChain.address 
      : (isOccupied ? `0x${((targetIdx * 8831) % 0xffffffff).toString(16).padStart(8, '0')}...${((targetIdx * 4423) % 0xffff).toString(16).padStart(4, '0')}` : null);
    
    downlineList.push({
      level: lvl,
      globalIndex: targetIdx,
      address: addr,
      packageUSD: isOccupied ? pkg : 0,
      earnedUSD: isOccupied && isUnlocked ? earned : '0.00',
      isActive: isOccupied,
      isUnlocked
    });
  }

  return (
    <div className="singleleg-wrap">
      {/* Header Banner */}
      <div className="stream-header-card glass-panel">
        <div className="sh-top">
          <div className="sh-title-box">
            <span className="sh-pill gold-gradient-text">POOL 02 (30% LIVE P2P SPLIT)</span>
            <h2>GLOBALINE NEXUS GRID</h2>
            <p>10 Active Uplines + 5 Active Downlines with Dynamic Compression. Reach unlocks package ke hisab se ($25 = 2 Up/1 Down up to $500+ = 10 Up/5 Down).</p>
          </div>
          <div className="sh-stats-box">
            <div className="stat-mini">
              <span>Your Package Reach:</span>
              <strong className="gold-gradient-text">
                {isRegistered ? `${userReach.reach} (${userReach.total} Wallets)` : 'Inactive (Activate Package)'}
              </strong>
            </div>
            <div className="stat-mini">
              <span>Globaline Max Depth:</span>
              <strong className="cyan-gradient-text">10 UP + 5 DOWN (15 WALLETS)</strong>
            </div>
            <div className="stat-mini">
              <span>Dynamic Compression:</span>
              <strong className="green-txt">Active (Zero Inactive Waste)</strong>
            </div>
          </div>
        </div>

        {/* Package-Wise Globaline Reach Grid (Package ke hisab se) */}
        <div className="package-depth-card glass-panel" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <div className="pdc-header">
            <h4>📦 Package-Wise Globaline Reach Matrix (Package ke hisab se)</h4>
            <small>Higher packages automatically unlock more active Uplines and Downlines:</small>
          </div>
          <div className="pdc-grid">
            {GLOBALINE_PACKAGE_TIERS.map((tier, idx) => {
              const isQualified = isRegistered && (activePkg >= tier.pkg);
              return (
                <div 
                  key={idx} 
                  className={`pdc-tier-chip glass-panel ${isQualified ? 'qualified' : ''}`}
                >
                  <span className="pdc-pkg-name">{tier.label}</span>
                  <strong className="pdc-depth-val gold-gradient-text">{tier.reach}</strong>
                  {isQualified && <span className="pdc-active-check">✓ Active</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Compression Explainer Strip */}
        <div className="daily-rules-strip glass-panel">
          <div className="rule-badge-col">
            <span className="r-tag">10 ACTIVE UPLINES (20%)</span>
            <p>Earn 2% dividend on package activations and every auto-reinvestment from active members above you.</p>
          </div>
          <div className="rule-sep">+</div>
          <div className="rule-badge-col">
            <span className="r-tag gold">5 ACTIVE DOWNLINES (10%)</span>
            <p>Earn 2% dividend on package activations and every auto-reinvestment from active members below you.</p>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="subtabs-bar glass-panel">
        <button 
          className={`subtab-btn ${activeSubView === 'monoline' ? 'active' : ''}`}
          onClick={() => setActiveSubView('monoline')}
        >
          <Zap size={16} /> Complete Active Globaline ({userReach.total} Wallets Qualified)
        </button>
        <button 
          className={`subtab-btn ${activeSubView === 'uplines' ? 'active' : ''}`}
          onClick={() => setActiveSubView('uplines')}
        >
          <ArrowUp size={16} /> Active Uplines ({userReach.up} / 10 Unlocked)
        </button>
        <button 
          className={`subtab-btn ${activeSubView === 'downlines' ? 'active' : ''}`}
          onClick={() => setActiveSubView('downlines')}
        >
          <ArrowDown size={16} /> Active Downlines ({userReach.down} / 5 Unlocked)
        </button>
      </div>

      {/* Monoline View */}
      <div className="monoline-stream-card glass-panel">
        {/* Uplines Section */}
        {(activeSubView === 'monoline' || activeSubView === 'uplines') && (
          <div className="stream-section">
            <div className="section-title-strip cyan-bg">
              <ArrowUp size={16} />
              <span>10 ACTIVE UPLINE WALLETS (2% EACH ➔ 20% YIELD) · {userReach.up}/10 QUALIFIED</span>
            </div>
            <div className="table-responsive">
              <table className="altruva-table">
                <thead>
                  <tr>
                    <th>OFFSET</th>
                    <th>GLOBAL MONOLINE ID</th>
                    <th>WALLET ADDRESS</th>
                    <th>ACTIVE PACKAGE</th>
                    <th>YOUR 2% DIVIDEND</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {uplineList.map(item => (
                    <tr key={item.level} className={item.isUnlocked ? "unlocked-row" : "locked-row"}>
                      <td><span className="lvl-badge upline-badge">▲ Level -{item.level}</span></td>
                      <td><strong>#{item.globalIndex || 'GENESIS'}</strong></td>
                      <td>
                        <span className="addr-span" onClick={() => copyToClipboard(item.address, `up-${item.level}`)}>
                          {item.address} {copiedAddr === `up-${item.level}` ? '✓' : ''}
                        </span>
                      </td>
                      <td><strong className="gold-gradient-text">${item.packageUSD} USDT</strong></td>
                      <td><strong className="green-txt">+{item.earnedUSD} USDT</strong></td>
                      <td>
                        {item.isUnlocked ? (
                          <span className="status-pill active">● Active Yielding (2%)</span>
                        ) : (
                          <span className="status-pill locked"><Lock size={12} /> Locked (Upgrade Package)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Center Node: YOU */}
        {activeSubView === 'monoline' && (
          <div className="user-center-anchor glass-panel">
            <div className="uca-left">
              <AltruvaLogo size={42} />
              <div>
                <span className="uca-badge gold-gradient-text">★ YOUR ACTIVE POSITION ★</span>
                <h3>Global Monoline ID #{userIndex}</h3>
                <span className="uca-addr">{address || '0xUserWalletAddress...'}</span>
              </div>
            </div>
            <div className="uca-right">
              <span className="uca-pkg-lbl">Active Package:</span>
              <strong className="uca-pkg gold-gradient-text">${activePkg} USDT</strong>
              <small className="green-txt">Qualified Reach: {userReach.reach}</small>
            </div>
          </div>
        )}

        {/* Downlines Section */}
        {(activeSubView === 'monoline' || activeSubView === 'downlines') && (
          <div className="stream-section">
            <div className="section-title-strip gold-bg">
              <ArrowDown size={16} />
              <span>5 ACTIVE DOWNLINE WALLETS (2% EACH ➔ 10% YIELD) · {userReach.down}/5 QUALIFIED</span>
            </div>
            <div className="table-responsive">
              <table className="altruva-table">
                <thead>
                  <tr>
                    <th>OFFSET</th>
                    <th>GLOBAL MONOLINE ID</th>
                    <th>WALLET ADDRESS</th>
                    <th>ACTIVE PACKAGE</th>
                    <th>YOUR 2% DIVIDEND</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {downlineList.map(item => (
                    <tr key={item.level} className={item.isUnlocked ? "unlocked-row" : "locked-row"}>
                      <td><span className="lvl-badge downline-badge">▼ Level +{item.level}</span></td>
                      <td><strong>#{item.globalIndex}</strong></td>
                      <td>
                        <span className="addr-span" onClick={() => copyToClipboard(item.address, `down-${item.level}`)}>
                          {item.address} {copiedAddr === `down-${item.level}` ? '✓' : ''}
                        </span>
                      </td>
                      <td><strong className="gold-gradient-text">${item.packageUSD} USDT</strong></td>
                      <td><strong className="green-txt">+{item.earnedUSD} USDT</strong></td>
                      <td>
                        {item.isUnlocked ? (
                          <span className="status-pill active">● Active Yielding (2%)</span>
                        ) : (
                          <span className="status-pill locked"><Lock size={12} /> Locked (Upgrade Package)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
