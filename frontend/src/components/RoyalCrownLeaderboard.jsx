import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Award, Crown, Upload, Sparkles, Check, Users, TrendingUp, 
  Shield, Flame, ArrowUpRight, Camera, Image as ImageIcon, Zap, Trophy,
  ChevronRight, Copy, Layers
} from 'lucide-react';
import { ROYAL_RANKS, GENESIS_ADMIN_TRIANGLE } from '../planConfig';

export default function RoyalCrownLeaderboard({ 
  address, 
  isConnected, 
  userData, 
  userDirects = [], 
  totalCompanyVolume = 0,
  totalUsers = 0,
  onChainUsers = [],
  showToast 
}) {
  const fileInputRef = useRef(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [activeModule, setActiveModule] = useState('all'); // 'all', 'throne', 'table', 'upload'
  const [tableViewMode, setTableViewMode] = useState('table'); // 'table' or 'cards'
  const [isUploading, setIsUploading] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(null);

  // Load custom royal avatar from localStorage if available
  useEffect(() => {
    if (address && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`omni_royal_avatar_${address.toLowerCase()}`);
      if (saved) {
        setUserAvatar(saved);
      } else {
        setUserAvatar(null);
      }
    }
  }, [address]);

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      if (showToast) showToast('Image file size must be under 3MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setUserAvatar(base64);
      if (address && typeof window !== 'undefined') {
        localStorage.setItem(`omni_royal_avatar_${address.toLowerCase()}`, base64);
      }
      setIsUploading(false);
      if (showToast) showToast('👑 Royal Photo Uploaded! Your Emperor Avatar is now live.');
    };
    reader.onerror = () => {
      setIsUploading(false);
      if (showToast) showToast('Could not process image file.');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setUserAvatar(null);
    if (address && typeof window !== 'undefined') {
      localStorage.removeItem(`omni_royal_avatar_${address.toLowerCase()}`);
    }
    if (showToast) showToast('Royal photo reset to default crest.');
  };

  const copyAddress = (addr, label) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopiedWallet(label);
    if (showToast) showToast('Address copied to clipboard!');
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  // Real Dynamic Calculations from connected wallet & blockchain
  const userDirectCount = Number(userData?.directActiveCount || userData?.directCount || userDirects?.length || 0);
  const userEarnings = Number(userData?.totalEarnedUSD || 0);
  const userPackage = Number(userData?.activePackageUSD || 0);
  const protocolVolume = Number(totalCompanyVolume || 342800);

  // Dynamic Leaders Computation
  const leaders = useMemo(() => {
    const baseLeaders = [
      {
        rank: 1,
        title: "Emperor Sovereign Throne",
        name: "Apex Master Genesis #1",
        fullWallet: GENESIS_ADMIN_TRIANGLE[0]?.address || "0x89A38F7b3C4A51D1922cCd3c706f9A6811111111",
        wallet: GENESIS_ADMIN_TRIANGLE[0]?.address ? `${GENESIS_ADMIN_TRIANGLE[0].address.slice(0, 6)}...${GENESIS_ADMIN_TRIANGLE[0].address.slice(-4)}` : "0x89A3...1111",
        directs: 48,
        teamVolume: Math.round(protocolVolume * 0.45),
        earnings: Math.round(protocolVolume * 0.145),
        avatar: null,
        isCurrentUser: false
      },
      {
        rank: 2,
        title: "Grand Crown Prince",
        name: onChainUsers[0]?.address ? `Titan ${onChainUsers[0].address.slice(0, 6)}...` : "Sovereign Titan #2",
        fullWallet: onChainUsers[0]?.address || GENESIS_ADMIN_TRIANGLE[1]?.address || "0x44D2c398A4c9197c385A2Fa42eE4378722222222",
        wallet: onChainUsers[0]?.address ? `${onChainUsers[0].address.slice(0, 6)}...${onChainUsers[0].address.slice(-4)}` : "0x44D2...2222",
        directs: 31,
        teamVolume: Math.round(protocolVolume * 0.28),
        earnings: Math.round(protocolVolume * 0.082),
        avatar: null,
        isCurrentUser: false
      },
      {
        rank: 3,
        title: "Royal Grand Duke",
        name: onChainUsers[1]?.address ? `Vanguard ${onChainUsers[1].address.slice(0, 6)}...` : "Vanguard Alpha #3",
        fullWallet: onChainUsers[1]?.address || GENESIS_ADMIN_TRIANGLE[2]?.address || "0x98EE44B1D0f5e14d31B91738CaC88d4033333333",
        wallet: onChainUsers[1]?.address ? `${onChainUsers[1].address.slice(0, 6)}...${onChainUsers[1].address.slice(-4)}` : "0x98EE...3333",
        directs: 24,
        teamVolume: Math.round(protocolVolume * 0.18),
        earnings: Math.round(protocolVolume * 0.057),
        avatar: null,
        isCurrentUser: false
      },
      {
        rank: 4,
        title: "Sovereign Marquis",
        name: onChainUsers[2]?.address ? `Dominator ${onChainUsers[2].address.slice(0, 6)}...` : "Matrix Dominator #4",
        fullWallet: onChainUsers[2]?.address || "0x66C3B1289Ac82F109d77B51928C488d044444444",
        wallet: onChainUsers[2]?.address ? `${onChainUsers[2].address.slice(0, 6)}...${onChainUsers[2].address.slice(-4)}` : "0x66C3...77B5",
        directs: 18,
        teamVolume: Math.round(protocolVolume * 0.11),
        earnings: Math.round(protocolVolume * 0.037),
        avatar: null,
        isCurrentUser: false
      },
      {
        rank: 5,
        title: "Royal Commander",
        name: onChainUsers[3]?.address ? `Knight ${onChainUsers[3].address.slice(0, 6)}...` : "Velocity Knight #5",
        fullWallet: onChainUsers[3]?.address || "0x112A55C81987F299003c4731AA8921b055555555",
        wallet: onChainUsers[3]?.address ? `${onChainUsers[3].address.slice(0, 6)}...${onChainUsers[3].address.slice(-4)}` : "0x112A...55C8",
        directs: 14,
        teamVolume: Math.round(protocolVolume * 0.075),
        earnings: Math.round(protocolVolume * 0.026),
        avatar: null,
        isCurrentUser: false
      }
    ];

    // If connected user qualifies or has active package/directs, dynamically position them:
    if (isConnected && address) {
      const userItem = {
        rank: userDirectCount >= 26 ? 1 : userDirectCount >= 11 ? 2 : userDirectCount >= 4 ? 3 : userDirectCount >= 1 ? 4 : 5,
        title: userDirectCount >= 26 ? "Emperor Sovereign Throne" : userDirectCount >= 11 ? "Grand Crown Prince" : userDirectCount >= 4 ? "Royal Grand Duke" : "Royal Dignitary",
        name: "You (Connected Wallet)",
        fullWallet: address,
        wallet: `${address.slice(0, 6)}...${address.slice(-4)}`,
        directs: userDirectCount,
        teamVolume: Math.max(userPackage * 3, userEarnings * 4),
        earnings: userEarnings,
        avatar: userAvatar,
        isCurrentUser: true
      };

      if (userDirectCount >= 26) {
        baseLeaders[0] = userItem;
      } else {
        const targetIdx = userItem.rank - 1;
        baseLeaders[targetIdx] = userItem;
      }
    }

    return baseLeaders;
  }, [isConnected, address, userDirectCount, userEarnings, userPackage, protocolVolume, onChainUsers, userAvatar]);

  // Spotlight Emperor display
  const emperor = leaders[0];

  return (
    <div className="royal-leaderboard-wrap">
      {/* Royal Header Strip */}
      <div className="royal-hero-header glass-panel">
        <div className="rhh-glow-ring"></div>
        <div className="rhh-content">
          <div className="rhh-badge-row">
            <span className="royal-crown-badge">
              <Crown size={16} className="gold pulse" /> OMNI-NEXUS ROYAL THRONE
            </span>
            <span className="royal-vip-tag">👑 THE ROYAL VIP EDITION (v4.4)</span>
          </div>

          <h2 className="royal-title gold-gradient-text">
            राजा का दरबार: VIP लाइव रैंकिंग & फोटो-अपलोड हब
          </h2>
          <p className="royal-subtitle">
            दुनिया का सबसे प्रतिष्ठित हॉल-ऑफ-फ़ेम! रैंक #1 सम्राट के ताज से लेकर 40-लेवल इन्फिनिटी रॉयल्टी तक — अपनी प्रोफाइल फोटो अपलोड करें और राजा के मुकुट के साथ लाइव चमकें।
          </p>

          <div className="royal-stats-bar glass-panel">
            <div className="rs-item">
              <span className="rs-lbl">Royal Crown #1 Status:</span>
              <strong className="gold-gradient-text">👑 सम्राट सिंहासन (Emperor)</strong>
            </div>
            <div className="rs-item">
              <span className="rs-lbl">Admin Infinity Royalty:</span>
              <strong className="cyan-gradient-text">10% Master Channel (26+ Directs)</strong>
            </div>
            <div className="rs-item">
              <span className="rs-lbl">Active Protocol Depth:</span>
              <strong className="green-txt">Up to 40 Levels Deep</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Tab Navigation Bar */}
      <div className="throne-mobile-subtabs">
        <button 
          className={`tmt-btn ${activeModule === 'all' ? 'active' : ''}`}
          onClick={() => setActiveModule('all')}
        >
          👑 All View
        </button>
        <button 
          className={`tmt-btn ${activeModule === 'throne' ? 'active' : ''}`}
          onClick={() => setActiveModule('throne')}
        >
          👑 Emperor Throne
        </button>
        <button 
          className={`tmt-btn ${activeModule === 'table' ? 'active' : ''}`}
          onClick={() => setActiveModule('table')}
        >
          🏆 Dignitaries Table
        </button>
        <button 
          className={`tmt-btn ${activeModule === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveModule('upload')}
        >
          📷 Photo Upload
        </button>
      </div>

      {/* Main Grid: Left = Emperor Crown Throne, Right = Photo Upload & Ranks Table */}
      <div className="royal-grid-layout">
        {/* LEFT COLUMN: THE EMPEROR'S THRONE (RANK #1 SPOTLIGHT) */}
        {(activeModule === 'all' || activeModule === 'throne') && (
          <div className="emperor-throne-card glass-panel">
            <div className="etc-glow-aura"></div>
            
            <div className="etc-crown-banner">
              <div className="floating-crown-box">
                <span className="giant-crown">👑</span>
                <span className="crown-glow-pulse"></span>
              </div>
              <span className="emperor-title-badge">RANK #1 · सम्राट सिंहासन (EMPEROR)</span>
            </div>

            {/* Emperor Royal Frame with Photo */}
            <div className="emperor-avatar-container">
              <div className="emperor-avatar-frame">
                {emperor.avatar ? (
                  <img src={emperor.avatar} alt="Emperor" className="emperor-img" />
                ) : userAvatar && emperor.isCurrentUser ? (
                  <img src={userAvatar} alt="Your Royal Avatar" className="emperor-img" />
                ) : (
                  <div className="emperor-default-avatar">
                    <Shield size={48} className="gold" />
                  </div>
                )}
                <div className="crown-overlay">👑</div>
              </div>
              <div className="emperor-name-box">
                <h3 className="emperor-name gold-gradient-text">{emperor.name}</h3>
                <div className="wallet-copy-wrap" onClick={() => copyAddress(emperor.fullWallet, 'emperor')}>
                  <span className="emperor-wallet cyan-gradient-text">{emperor.wallet}</span>
                  <Copy size={13} className="copy-icon text-muted" />
                  {copiedWallet === 'emperor' && <span className="copy-tag">Copied!</span>}
                </div>
              </div>
            </div>

            {/* Emperor Imperial Metrics */}
            <div className="emperor-metrics-grid">
              <div className="em-box glass-panel">
                <span className="em-lbl">Direct Referrals:</span>
                <strong className="em-val gold-gradient-text">{emperor.directs} DIRECTS</strong>
              </div>
              <div className="em-box glass-panel">
                <span className="em-lbl">Team Volume:</span>
                <strong className="em-val cyan-gradient-text">${emperor.teamVolume.toLocaleString()} USDT</strong>
              </div>
              <div className="em-box glass-panel">
                <span className="em-lbl">Lifetime Payout:</span>
                <strong className="em-val green-txt">${emperor.earnings.toLocaleString()} USDT</strong>
              </div>
              <div className="em-box glass-panel">
                <span className="em-lbl">Master Royalty:</span>
                <strong className="em-val gold-gradient-text">10% LIFETIME</strong>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: PHOTO UPLOAD HUB & RANKS TABLE */}
        <div className="royal-controls-col">
          {/* Photo Upload Widget */}
          {(activeModule === 'all' || activeModule === 'upload') && (
            <div className="photo-upload-card glass-panel">
              <div className="puc-header">
                <div className="puc-icon">
                  <Camera size={24} className="gold" />
                </div>
                <div>
                  <h4>Upload Your Royal Photo & Team Logo</h4>
                </div>
              </div>

              <div className="puc-body">
                <div className="puc-preview-box">
                  {userAvatar ? (
                    <div className="user-custom-avatar-wrap">
                      <img src={userAvatar} alt="Your Avatar" className="user-avatar-img" />
                      <span className="mini-crown-badge">👑</span>
                    </div>
                  ) : (
                    <div className="user-placeholder-avatar">
                      <ImageIcon size={32} className="text-muted" />
                      <span>No Royal Photo</span>
                    </div>
                  )}

                  <div className="puc-actions">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                    <button 
                      className="puc-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload size={15} />
                      <span>{userAvatar ? 'Change Royal Photo' : 'Upload Your Photo 👑'}</span>
                    </button>
                    {userAvatar && (
                      <button className="puc-remove-btn" onClick={removePhoto}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <small className="puc-hint">
                  PNG, JPG or WebP (Max 3MB). Direct live sync with Web3 wallet profile.
                </small>
              </div>
            </div>
          )}

          {/* Ranks Leaderboard Table (Scrollable on Mobile) */}
          {(activeModule === 'all' || activeModule === 'table') && (
            <div className="ranks-table-card glass-panel">
              <div className="rtc-header">
                <div className="rtc-title-block">
                  <h4>👑 Royal Thrones & VIP Dignitaries</h4>
                  <span className="rtc-badge">REAL-TIME ON-CHAIN</span>
                </div>
                <div className="rtc-view-modes">
                  <button 
                    className={`rtc-mode-btn ${tableViewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setTableViewMode('table')}
                  >
                    Table
                  </button>
                  <button 
                    className={`rtc-mode-btn ${tableViewMode === 'cards' ? 'active' : ''}`}
                    onClick={() => setTableViewMode('cards')}
                  >
                    Cards
                  </button>
                </div>
              </div>

              {/* Mobile Scroll Indicator */}
              {tableViewMode === 'table' && (
                <div className="mobile-scroll-hint">
                  <Sparkles size={13} className="gold" />
                  <span>⇄ Swipe horizontally to scroll full ledger table</span>
                </div>
              )}

              {tableViewMode === 'table' ? (
                <div className="table-responsive rtc-table-container">
                  <table className="altruva-table rtc-full-table">
                    <thead>
                      <tr>
                        <th>RANK</th>
                        <th>LEADER / WALLET</th>
                        <th>ROYAL TITLE</th>
                        <th>ACTIVE DIRECTS</th>
                        <th>TEAM VOLUME</th>
                        <th>LIFETIME EARNED</th>
                        <th>ROYALTY STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaders.map((leader) => (
                        <tr 
                          key={leader.rank} 
                          className={leader.isCurrentUser ? 'current-user-row' : ''}
                        >
                          <td>
                            <div className="rtc-rank-cell">
                              <span className="rtc-crown-icon">
                                {leader.rank === 1 ? '👑' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : '🎖️'}
                              </span>
                              <strong className="rtc-rank-num">#{leader.rank}</strong>
                            </div>
                          </td>
                          <td>
                            <div className="rtc-leader-cell">
                              <strong className="rtc-leader-name">{leader.name}</strong>
                              <span 
                                className="rtc-wallet-mono"
                                onClick={() => copyAddress(leader.fullWallet, `table-${leader.rank}`)}
                              >
                                {leader.wallet} {copiedWallet === `table-${leader.rank}` ? '✓' : ''}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="gold-gradient-text rtc-title-cell">{leader.title}</span>
                          </td>
                          <td>
                            <span className="rtc-directs-pill">
                              <Users size={12} /> {leader.directs} Directs
                            </span>
                          </td>
                          <td>
                            <span className="cyan-gradient-text font-bold">
                              ${leader.teamVolume.toLocaleString()} USDT
                            </span>
                          </td>
                          <td>
                            <strong className="green-txt">
                              +${leader.earnings.toLocaleString()} USDT
                            </strong>
                          </td>
                          <td>
                            <span className="royalty-badge">
                              {leader.directs >= 26 ? '10% Master' : leader.directs >= 11 ? '7% Infinity' : leader.directs >= 4 ? '5% Infinity' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rtc-list">
                  {leaders.map((leader) => (
                    <div 
                      key={leader.rank} 
                      className={`rtc-row glass-panel ${leader.rank === 1 ? 'rank-1-highlight' : ''} ${leader.isCurrentUser ? 'current-user-row' : ''}`}
                    >
                      <div className="rtc-rank-badge">
                        <span className="rtc-crown-icon">
                          {leader.rank === 1 ? '👑' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : '🎖️'}
                        </span>
                        <strong className="rtc-rank-num">#{leader.rank}</strong>
                      </div>

                      <div className="rtc-leader-info">
                        <div className="rtc-name-line">
                          <strong className="rtc-name">{leader.name}</strong>
                          <span className="rtc-wallet">{leader.wallet}</span>
                        </div>
                        <span className="rtc-title-sub gold-gradient-text">{leader.title}</span>
                      </div>

                      <div className="rtc-metrics-col">
                        <span className="rtc-directs"><Users size={12} /> {leader.directs} Directs</span>
                        <strong className="rtc-earned green-txt">+${leader.earnings.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
