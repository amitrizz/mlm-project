import React from 'react';
import { X, Gift, Sparkles, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import AltruvaLogo from './AltruvaLogo';

export default function FaucetModal({
  isOpen,
  onClose,
  onClaim,
  address,
  usdtBalance = '0.00',
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="withdraw-modal-overlay" onClick={onClose}>
      <div className="faucet-modal-card glass-panel" onClick={e => e.stopPropagation()}>
        <div className="wm-header">
          <div className="wm-title-box">
            <AltruvaLogo size={32} />
            <div>
              <h3>100 Free Testnet USDT</h3>
              <span className="gold-gradient-text">BNB SMART CHAIN TESTNET FAUCET</span>
            </div>
          </div>
          <button className="wm-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="faucet-body">
          <div className="faucet-badge-wrap">
            <div className="faucet-gift-icon-box">
              <Gift size={36} className="gold pulse" />
            </div>
            <div className="faucet-banner-text">
              <span className="faucet-welcome-pill">WALLET CONNECTED BONUS</span>
              <h4>Get 100 USDT (BEP-20) Free to Test!</h4>
            </div>
          </div>

          <p className="faucet-desc">
            Your wallet is connected to BNB Smart Chain Testnet. Claim <strong>100 Free USDT</strong> 
            to test package activations, 3% daily Quantum ROI, and 15 Up + 15 Down Monoline live distribution.
          </p>

          <div className="faucet-info-box glass-panel">
            <div className="faucet-info-row">
              <span className="info-label">Connected Wallet:</span>
              <span className="info-val cyan-gradient-text">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'Not Connected'}
              </span>
            </div>
            <div className="faucet-info-row">
              <span className="info-label">Current USDT Balance:</span>
              <span className="info-val">
                <strong>${Number(usdtBalance || 0).toFixed(2)} USDT</strong>
              </span>
            </div>
            <div className="faucet-info-row">
              <span className="info-label">Gift Amount:</span>
              <span className="info-val green-txt">
                <strong>+100.00 USDT (Free)</strong>
              </span>
            </div>
          </div>

          <div className="faucet-actions">
            <button 
              className="faucet-claim-btn"
              onClick={onClaim}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  <span>Minting 100 USDT on BNB Testnet...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Claim 100 Free USDT Now</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="faucet-gas-tip">
              <small>
                Need testnet gas? Grab free tBNB from the{' '}
                <a 
                  href="https://www.bnbchain.org/en/testnet-faucet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cyan-link"
                >
                  BNB Chain Testnet Faucet <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
