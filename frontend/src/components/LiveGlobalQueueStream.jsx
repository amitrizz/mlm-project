import React, { useState, useEffect } from 'react';
import { Activity, Radio, Zap, Shield, ArrowUpRight, Flame, RefreshCw } from 'lucide-react';
import { ethers } from 'ethers';
import { LIVE_STREAM_BLOCK } from '../planConfig';

export default function LiveGlobalQueueStream({ 
  totalUsers = 0, 
  totalCompanyVolume = 0, 
  onChainUsers = [] 
}) {
  const [tickerItems, setTickerItems] = useState(LIVE_STREAM_BLOCK.initialTicker);
  const [blockHeight, setBlockHeight] = useState(4892011);

  // Fetch real-time live BSC Testnet block height
  useEffect(() => {
    let isMounted = true;
    const fetchRealBlock = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com");
        const block = await provider.getBlockNumber();
        if (isMounted && block) setBlockHeight(block);
      } catch (e) {
        console.warn('Block query error:', e);
      }
    };
    fetchRealBlock();

    const interval = setInterval(() => {
      setBlockHeight(b => b + 1);
    }, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Inject real on-chain users into ticker if available
  useEffect(() => {
    if (onChainUsers && onChainUsers.length > 0) {
      const realItems = onChainUsers.map((u, i) => ({
        id: `real-${u.index}`,
        wallet: `${u.address.slice(0, 6)}...${u.address.slice(-4)}`,
        action: `Monoline Position #${u.index}`,
        detail: `Verified On-Chain Node on BSC Testnet`
      }));
      setTickerItems([...realItems, ...LIVE_STREAM_BLOCK.initialTicker]);
    }
  }, [onChainUsers]);

  const displayWallets = totalUsers > 0 ? totalUsers : LIVE_STREAM_BLOCK.totalActiveWallets;
  const displayTurnover = totalCompanyVolume > 0 ? totalCompanyVolume : LIVE_STREAM_BLOCK.dailyTurnoverUSD;

  return (
    <div className="live-stream-container glass-panel">
      {/* Stream Header */}
      <div className="stream-header-strip">
        <div className="live-status-pill">
          <span className="live-dot pulse"></span>
          <span className="live-text">SYSTEM LIVE STREAM FEED</span>
          <span className="block-pill">BLOCKCHAIN LEDGER BLOCK #{blockHeight}</span>
        </div>

        <div className="stream-stats-row">
          <div className="s-stat">
            <span className="s-lbl">Total Active Global Wallets:</span>
            <strong className="cyan-gradient-text">{displayWallets.toLocaleString()}</strong>
          </div>
          <div className="s-stat">
            <span className="s-lbl">Global Monoline Depth:</span>
            <strong className="gold-gradient-text">Level #{displayWallets > 0 ? displayWallets : LIVE_STREAM_BLOCK.monolineDepth}</strong>
          </div>
          <div className="s-stat">
            <span className="s-lbl">24H Turnover Volume:</span>
            <strong className="green-txt">+${displayTurnover.toLocaleString()} USDT</strong>
          </div>
        </div>
      </div>

      {/* Real-Time P2P & Re-Birth Ticker */}
      <div className="ticker-wrapper">
        <div className="ticker-badge">
          <Zap size={14} className="gold" /> ⚡ REAL-TIME P2P & RE-BIRTH TICKER
        </div>
        <div className="ticker-scroller">
          {tickerItems.map(item => (
            <div key={item.id} className="ticker-chip glass-panel">
              <span className="t-wallet cyan-gradient-text">{item.wallet}</span>
              <span className="t-arrow">👉</span>
              <strong className="t-action">{item.action}</strong>
              <span className="t-detail">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

