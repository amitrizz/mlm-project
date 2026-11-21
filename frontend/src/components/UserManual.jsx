import React, { useState } from 'react';
import { 
  BookOpen, Shield, Users, TrendingUp, Award, Gift, ArrowRight, 
  CheckCircle2, RefreshCw, AlertCircle, HelpCircle, ChevronDown, 
  ChevronUp, ExternalLink, Sparkles, Wallet, Flame, Zap, Clock, Lock
} from 'lucide-react';
import AltruvaLogo from './AltruvaLogo';
import { 
  PROTOCOL_NAME, PROTOCOL_EDITION, BLOCKCHAIN_NETWORK, TOKEN_STANDARD, 
  PROTOCOL_PACKAGES, COMMUNITY_POOLS, LEADER_MECHANISMS, HARD_CAP_RULES, WITHDRAWAL_RULES 
} from '../planConfig';

export default function UserManual({ onConnectWallet, onOpenPresentation }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is TurboVault Global Protocol v4.4?",
      a: "TurboVault Global Protocol (v4.4 — The Royal VIP Edition) is a peer-to-peer (P2P) decentralized mathematical protocol deployed on BNB Chain (BSC). All transactions run purely in USDT (BEP-20) with gas paid in BNB. It features the Royal Crown Throne, Photo-Upload Hub, Smart Compounding loops, and up to 40 levels of matrix generation depth."
    },
    {
      q: "How does the Live Split work across the 5 Elite Pools?",
      a: "Every package activation ($25 to $1,000) splits instantly on-chain: 30% to Quantum Genesis ROI, 30% to Globaline Nexus Grid (10 Up + 5 Down active wallets), 25% to Velocity Matrix Bonus (up to 40 generation levels), 10% to 72H Alpha Cashback Surge, and 5% to the 24H Jackpot Reward Pool."
    },
    {
      q: "How does the Quantum Genesis ROI operate?",
      a: "It is a global passive pool. You earn 3% daily for the first 10 days, followed by 1% daily. Sponsoring 1 new direct referral immediately resets the 3% daily rate for another 10 days! ROI withdrawals are always unlocked with a 40% cash / 60% auto-reinvestment compounding ratio."
    },
    {
      q: "What is the Globaline Nexus Grid (30% Pool) with Dynamic Compression?",
      a: "Every user enters a global single leg. You earn 2% commission each from the 10 active wallets above you and 5 active wallets below you (Total 15 wallets @ 2% = 30%). Non-active or retired IDs are automatically skipped through Dynamic Compression so you only earn from active participants."
    },
    {
      q: "How does the Package-Wise Depth Matrix work in Velocity Matrix (Up to 40 Levels)?",
      a: "Your active package tier unlocks generation depth: $25 = 10 Levels, $50 = 15 Levels, $100 = 20 Levels, $200 = 25 Levels, $500 = 30 Levels, and $1,000 = 40 Levels Deep! Level 1 pays 13% fixed (0 directs), L2-L3 pay 3% & 2% (1 direct), L4-L6 pay 1% each (2 directs), and L7-L40 pay 1% each (3 directs)."
    },
    {
      q: "What is the Royal Throne Leaderboard and Photo-Upload Hub?",
      a: "A unique VIP Hall of Fame where the Rank #1 leader is crowned Emperor with a glowing Golden Royal Crown and VIP frame. Every leader can upload their profile photo or team logo to shine live on the global leaderboard alongside their rank."
    },
    {
      q: "What are the 300% Hard-Cap and Smart Compounding Loop rules?",
      a: "Total cumulative income from all streams is capped at 300% (3X) of your active package tier. The auto-reinvested portion adds directly into your active package, automatically upgrading you to higher tiers (unlocking deeper matrix levels up to 40 levels) without spending fresh money."
    },
    {
      q: "What are the Withdrawal Rules and 30-Day Speed-Decay Engine?",
      a: "Global minimum withdrawal is $5 USDT. ROI is unlocked without team conditions (40% Cash / 60% Reinvest). Working network income is locked until you achieve 3 active direct referrals, unlocking at 70% Cash / 30% Reinvest. If you have no direct in 30 days, payout speed temporarily drops from 50% to 10% until 1 direct is made."
    }
  ];

  return (
    <div className="usermanual-wrap">
      {/* Manual Hero Banner */}
      <section className="manual-hero glass-panel">
        <div className="manual-hero-logo">
          <AltruvaLogo size={80} />
        </div>
        <div className="manual-badge">
          <Sparkles size={14} className="gold" /> {PROTOCOL_EDITION.toUpperCase()}
        </div>
        <h1 className="manual-title">
          WELCOME TO <span className="gold-gradient-text">TURBOVAULT GLOBAL v4.4</span>
        </h1>
        <p className="manual-subtitle cyan-gradient-text">
          The Royal VIP Edition · BNB Chain (BSC) · Pure USDT (BEP-20) · 40-Level Compounding Matrix
        </p>
        <p className="manual-intro">
          Official Master VIP Blueprint: Complete breakdown of the 6 Packages ($25 to $1,000), 5 Elite Pools, 
          10-Minute Ghost Position, 72H Alpha Cashback Surge, Royal Throne Leaderboard, Photo-Upload Hub, and the 40-Level Matrix.
        </p>

        {/* Action Buttons */}
        <div className="manual-actions-row">
          <button className="manual-connect-btn" onClick={onConnectWallet}>
            <Wallet size={18} /> Connect Wallet to Enter Protocol
          </button>
          <button className="manual-deck-btn" onClick={onOpenPresentation}>
            <BookOpen size={18} /> View Master Presentation Deck
          </button>
        </div>
      </section>

      {/* Core Network Architecture Specs */}
      <section className="onboarding-guide-section">
        <div className="manual-sec-header">
          <span className="sec-pill">Core Setup</span>
          <h2>Network & Infrastructure Specifications</h2>
          <p>Industrial grade on-chain ledger architecture built for maximum viral throughput:</p>
        </div>

        <div className="steps-container-grid">
          <div className="onboard-step-card glass-panel">
            <span className="step-number cyan-gradient-text">01</span>
            <h3>BNB Smart Chain (BSC)</h3>
            <p>Operates on BSC for sub-second block confirmation times and micro gas fees paid natively in BNB.</p>
          </div>

          <div className="onboard-step-card glass-panel">
            <span className="step-number gold-gradient-text">02</span>
            <h3>Pure USDT (BEP-20)</h3>
            <p>100% of deposits, upgrades, and payouts occur directly in stable USDT. No speculative proprietary token dumps.</p>
          </div>

          <div className="onboard-step-card glass-panel">
            <span className="step-number cyan-gradient-text">03</span>
            <h3>100% P2P Instant Split</h3>
            <p>Zero funds retained in the contract core ledger. All incoming package capital splits live into 5 automated pools.</p>
          </div>
        </div>
      </section>

      {/* The 6 Standard Packages */}
      <section className="activation-section glass-panel">
        <div className="manual-sec-header">
          <span className="sec-pill gold">Package Matrix</span>
          <h2>The 6 Standard Community Packages</h2>
          <p>Choose your entry tier to activate instant global monoline reach and earning caps:</p>
        </div>

        <div className="preset-pkgs-grid">
          {PROTOCOL_PACKAGES.map((pkg) => (
            <div key={pkg.val} className="preset-pkg-card glass-panel selected">
              <div className="pkg-card-top">
                <span className="p-tag">{pkg.tier}</span>
                <span className="p-price gold-gradient-text">${pkg.val} USDT</span>
              </div>
              <strong className="p-levels">{pkg.monolineReach} Active Wallets · {pkg.maxDepth} Levels Deep</strong>
            </div>
          ))}
        </div>
      </section>

      {/* The 5 Community Pools (100% Live Split) */}
      <section className="five-streams-detail-section">
        <div className="manual-sec-header">
          <span className="sec-pill">100% Live Split</span>
          <h2>The 5 Community Pools Breakdown</h2>
          <p>Every dollar entering the protocol splits instantly across 5 specialized mathematical pools:</p>
        </div>

        <div className="streams-cards-list">
          {/* Pool 1 */}
          <div className="stream-detail-box glass-panel">
            <div className="sdb-top">
              <div className="sdb-badge">POOL 01</div>
              <span className="sdb-share cyan-gradient-text">30% POOL</span>
            </div>
            <h3>Quantum Genesis ROI (Global Passive)</h3>
            <p>
              Global passive yield pool. Earn <strong>3% daily for the first 10 days</strong>, 
              then <strong>1% daily</strong> thereafter. Sponsoring 1 new direct referral resets your yield back to 3% for another 10 days!
            </p>
            <div className="sdb-highlight glass-panel">
              <strong>Withdrawal Terms:</strong> Always unlocked with ZERO direct sponsor requirement. 40% Cash sent to wallet / 60% Auto Re-invested.
            </div>
          </div>

          {/* Pool 2 */}
          <div className="stream-detail-box glass-panel">
            <div className="sdb-top">
              <div className="sdb-badge gold">POOL 02</div>
              <span className="sdb-share gold-gradient-text">30% POOL</span>
            </div>
            <h3>Globaline Nexus Grid (Advanced Global Queue)</h3>
            <p>
              Advanced global queue. Earn combined 30% yield from your <strong>10 Active Uplines and 5 Active Downlines</strong> (unlocked according to package with Dynamic Compression).
            </p>
            <div className="sdb-formula">
              Dynamic Compression: Non-active or retired IDs are bypassed in real time so you only receive yields from active wallets!
            </div>
          </div>

          {/* Pool 3 */}
          <div className="stream-detail-box glass-panel">
            <div className="sdb-top">
              <div className="sdb-badge">POOL 03</div>
              <span className="sdb-share cyan-gradient-text">25% POOL</span>
            </div>
            <h3>Velocity Matrix Bonus (Up to 40 Levels Deep)</h3>
            <p>
              Package-wise deep generation unilevel rewards with fixed <strong>13% direct bonus on Level 1</strong>, unlocking up to 40 levels based on your active package tier:
            </p>
            <div className="unilevel-tiers-strip">
              <span className="ut-pill gold">L1: 13%</span>
              <span className="ut-pill">L2: 3%</span>
              <span className="ut-pill">L3: 2%</span>
              <span className="ut-pill">L4–L6: 1% each</span>
              <span className="ut-pill">L7–L40: 1% each</span>
            </div>
            <div className="sdb-unlock-info">
              <span><strong>0 Directs:</strong> Unlocks Level 1 (13%)</span> · 
              <span><strong>1 Direct:</strong> Unlocks Levels 2–3 (18% Total)</span> · 
              <span><strong>2 Directs:</strong> Unlocks Levels 4–6 (21% Total)</span> · 
              <span><strong>3 Directs:</strong> Unlocks Levels 7–40 (25% Total)</span>
            </div>
          </div>

          {/* Pool 4 */}
          <div className="stream-detail-box glass-panel">
            <div className="sdb-top">
              <div className="sdb-badge gold">POOL 04</div>
              <span className="sdb-share gold-gradient-text">10% POOL</span>
            </div>
            <h3>72H Alpha Cashback Surge (Mission Refund)</h3>
            <p>
              Sponsor <strong>3 active direct referrals within 72 hours</strong> of your activation to receive an instant 
              <strong>100% refund of your joining package amount</strong>! Unclaimed funds automatically transfer to the Community Airdrop Pool.
            </p>
          </div>

          {/* Pool 5 */}
          <div className="stream-detail-box glass-panel">
            <div className="sdb-top">
              <div className="sdb-badge">POOL 05</div>
              <span className="sdb-share cyan-gradient-text">5% POOL</span>
            </div>
            <h3>Jackpot Reward (24H Countdown)</h3>
            <p>
              Automated 24-hour countdown pool. <strong>70% is shared equally among the last 50 paid users</strong>, and 
              <strong>30% is split among the top 3 direct sponsors</strong> of that round!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section glass-panel">
        <div className="manual-sec-header">
          <span className="sec-pill">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about TurboVault Global Protocol v4.4:</p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((f, idx) => (
            <div 
              key={idx} 
              className={`faq-item glass-panel ${openFaq === idx ? 'expanded' : ''}`}
              onClick={() => toggleFaq(idx)}
            >
              <div className="faq-question-row">
                <span className="faq-q-text">{f.q}</span>
                <span className="faq-arrow">{openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
              </div>
              {openFaq === idx && (
                <div className="faq-answer-row">
                  <p>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
