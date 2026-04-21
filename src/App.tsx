import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Vault, 
  ShoppingBag, 
  LogOut, 
  Fingerprint, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Database as DbIcon,
  ChevronRight,
  X
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis
} from "recharts";
import { cn } from "./lib/utils";

// --- Types ---
interface Sneaker {
  id: number;
  name: string;
  price: number;
  category: string;
  img_url: string;
  stock: number;
  description: string;
}

interface Stat {
  name: string;
  value: number;
}

interface StashedSneaker extends Sneaker {
  stash_id: number;
}

// --- Components ---

const Navbar = ({ stashCount, onLogout, vaultValue }: { stashCount: number; onLogout: () => void; vaultValue: number }) => {
  return (
    <nav className="h-16 border-b border-[#212a3d] bg-[#0a0d14]/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          HYPE<span className="text-[#f3cf65] ml-1 text-glow">VAULT</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"></span>
            SQL_NODE: ACTIVE
          </div>
          <div className="hidden md:block">SECURED_LINK: GCM-772</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-[10px] text-[#64748b] font-mono leading-tight uppercase">Buffer_Assets</div>
          <div className="text-lg font-mono text-[#f3cf65] leading-tight font-bold drop-shadow-[0_0_8px_rgba(243,207,101,0.3)]">{stashCount}</div>
        </div>
        <div className="h-10 w-[1px] bg-[#212a3d]"></div>
        <div className="text-right">
          <div className="text-[10px] text-[#64748b] font-mono leading-tight uppercase">Ledger_Value</div>
          <div className="text-lg font-mono text-white leading-tight font-bold">₹{vaultValue.toLocaleString("en-IN")}</div>
        </div>
        <div className="h-10 w-[1px] bg-[#212a3d]"></div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 border border-[#212a3d] text-[11px] font-mono hover:bg-[#f3cf65] hover:text-black hover:border-transparent transition-all shadow-inner"
        >
          DISCONNECT
        </button>
      </div>
    </nav>
  );
};

const SneakerCard = ({ sneaker, onStash }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group bg-[#131924]/40 backdrop-blur-sm border border-[#212a3d] rounded-xl overflow-hidden hover:border-[#f3cf65]/50 transition-all duration-300 flex flex-col relative shadow-lg hover:shadow-[0_0_30px_rgba(243,207,101,0.1)]"
    >
      <div className="aspect-square relative grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] to-transparent opacity-60 z-10" />
        <img 
          src={sneaker.img_url} 
          alt={sneaker.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-[#f3cf65] text-black text-[9px] font-bold px-2 py-0.5 tracking-tighter z-20 shadow-[0_0_10px_rgba(243,207,101,0.5)] rounded-sm">
          ASSET_{String(sneaker.id).padStart(3, '0')}
        </div>
        {sneaker.stock <= 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] flex flex-col items-center justify-center z-30">
            <X className="w-8 h-8 text-red-500 mb-2 opacity-50" />
            <span className="text-[11px] font-mono text-white border-y border-white/20 py-1 uppercase tracking-[0.3em] font-bold">DEPLETED</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col gap-3 relative z-20">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-mono text-white/90 group-hover:text-[#f3cf65] transition-colors leading-tight line-clamp-2">{sneaker.name}</h3>
        </div>
        
        <div className="flex justify-between items-end mt-auto pt-3 border-t border-[#212a3d]">
          <div>
            <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest">Market_Value</div>
            <div className="font-mono text-[#f3cf65] text-base font-bold text-glow">₹{sneaker.price.toLocaleString("en-IN")}</div>
          </div>
          <div className="text-right">
             <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest">Available</div>
             <div className="text-[11px] font-mono text-white font-bold">{sneaker.stock} Units</div>
          </div>
        </div>

        <button 
          disabled={sneaker.stock <= 0}
          onClick={() => onStash(sneaker.id)}
          className="mt-2 w-full py-2.5 bg-[#131924] border border-[#212a3d] text-[10px] font-mono text-[#94a3b8] hover:border-[#f3cf65] hover:text-[#f3cf65] hover:bg-[#1e293b] disabled:opacity-30 disabled:cursor-not-allowed uppercase transition-all tracking-[0.2em] font-bold rounded-lg shadow-inner"
        >
          Secure_Item
        </button>
      </div>
    </motion.div>
  );
};

const CheckoutModal = ({ 
  items, 
  onClose, 
  onComplete 
}: { 
  items: StashedSneaker[]; 
  onClose: () => void; 
  onComplete: () => Promise<void>;
}) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txId, setTxId] = useState("");

  const total = items.reduce((acc, s) => acc + s.price, 0);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: "dummy", holder: "agent", cvv: "000", expiry: "00/00" })
      });
      const data = await res.json();
      if (data.success) {
        setTxId(data.transactionId);
        setSuccess(true);
        setTimeout(() => onComplete(), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!success) setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)]"
      >
        <div className="flex h-[500px]">
          {/* Summary */}
          <div className="w-1/2 p-8 border-r border-[#222] bg-[#050505] overflow-y-auto">
            <h3 className="font-tech text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">Acquisition_Summary</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.stash_id} className="flex gap-4">
                  <img src={item.img_url} className="w-12 h-12 object-cover border border-[#222]" />
                  <div>
                    <p className="text-[11px] text-white font-mono uppercase">{item.name}</p>
                    <p className="text-[10px] text-[#d4af37] font-mono">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-[#222]">
              <div className="flex justify-between items-end">
                <span className="text-[9px] text-[#666] font-mono uppercase">Total_Valuation</span>
                <span className="text-xl text-[#d4af37] font-mono font-bold">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-serif italic text-white">Payment Gateway</h3>
                <p className="text-[9px] text-[#666] font-mono uppercase">Encrypted SQL Transaction // AES-256</p>
              </div>
              <button onClick={onClose} className="text-[#666] hover:text-white"><X className="w-5 h-5"/></button>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-mono uppercase text-xs">Authentication_Success</h4>
                    <p className="text-[10px] text-[#666] font-mono mt-1">Transaction ID: {txId}</p>
                  </div>
                  <div className="text-[9px] text-emerald-500 font-mono animate-pulse uppercase">Assets Transferring to your Vault...</div>
                </motion.div>
              ) : (
                <form onSubmit={handlePay} className="space-y-4 h-full">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#444] font-mono uppercase tracking-widest pl-1">Cardholder_Name</label>
                    <input required disabled={processing} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-[#d4af37]" placeholder="AGENT NAME" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#444] font-mono uppercase tracking-widest pl-1">Card_Number</label>
                    <input required disabled={processing} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-[#d4af37]" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#444] font-mono uppercase tracking-widest pl-1">Exp_Date</label>
                      <input required disabled={processing} className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-[#d4af37]" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#444] font-mono uppercase tracking-widest pl-1">CVV</label>
                      <input required disabled={processing} type="password" className="w-full bg-[#111] border border-[#222] px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-[#d4af37]" placeholder="***" />
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <button 
                      type="submit"
                      disabled={processing}
                      className="w-full py-4 bg-[#d4af37] text-black font-tech font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      {processing ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> AUTHORIZE_PAYMENT</>}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [inventory, setInventory] = useState({ totalItems: 0, stashedItems: 0 });
  const [stashItems, setStashItems] = useState<StashedSneaker[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "Query initialized in 0.0024ms...",
    "SQLite connection established via vault.db"
  ]);

  useEffect(() => {
    const session = localStorage.getItem("hv_session");
    if (session === "active") setIsLoggedIn(true);
    fetchData();

    // LIVE SQL POLLING: Fetch inventory and sneakers every 3 seconds
    const interval = setInterval(() => {
      fetchData(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [filter]);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [shoesRes, statsRes, invRes, stItemsRes] = await Promise.all([
        fetch(`/api/sneakers?category=${filter}`),
        fetch("/api/stats"),
        fetch("/api/inventory"),
        fetch("/api/stash-items")
      ]);
      
      const shoes = await shoesRes.json();
      const st = await statsRes.json();
      const inv = await invRes.json();
      const items = await stItemsRes.json();

      setSneakers(shoes);
      setStats(st);
      setInventory(inv);
      setStashItems(items);
      
      if (showLoading) {
        setLogs(prev => [
          ...prev.slice(-3),
          `> SELECT * FROM sneakers WHERE category = '${filter}'`,
          `> Received ${shoes.length} assets from SQL ledger.`
        ]);
        setLoading(false);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentId && passcode) {
      localStorage.setItem("hv_session", "active");
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hv_session");
    setIsLoggedIn(false);
  };

  const handleStash = async (id: number) => {
    try {
      const res = await fetch("/api/stash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sneakerId: id })
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(prev => [...prev.slice(-4), `> ${data.message}`]);
        fetchData(false);
      }
    } catch (err) {
      console.error("Stash failed", err);
    }
  };

  const removeFromStash = async (stashId: number) => {
    try {
      const res = await fetch(`/api/stash/${stashId}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(prev => [...prev.slice(-4), `> DELETE FROM stash WHERE id = ${stashId} --STOCK_RESTORED`]);
        fetchData(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completeCheckout = async () => {
    setShowCheckout(false);
    setLogs(prev => [...prev.slice(-4), `> BATCH_TRANSFER_COMPLETE: All assets secured.`]);
    fetchData(true);
  };

  const totalVaultValue = sneakers.reduce((acc, s) => acc + (s.price * s.stock), 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-[#222] p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tighter text-white">HYPE<span className="text-[#d4af37] ml-1">VAULT</span></h2>
            <p className="text-[#666] text-[10px] mt-2 tracking-widest uppercase italic">Authentication Required</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-[#666] uppercase tracking-widest block mb-1">Agent_ID</label>
              <input 
                type="text" 
                required
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-white font-mono"
                placeholder="HV-AGENT-X"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#666] uppercase tracking-widest block mb-1">Access_Code</label>
              <input 
                type="password" 
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm focus:border-[#d4af37] outline-none text-white font-mono"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full py-4 bg-[#111] border border-[#333] hover:border-[#d4af37] hover:text-[#d4af37] text-white font-bold uppercase tracking-widest transition-all">
              EXECUTE_UNLOCK
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#05070a] text-[#e0e0e0] flex flex-col overflow-hidden font-sans selection:bg-[#f3cf65] selection:text-black">
      <Navbar 
        stashCount={inventory.stashedItems} 
        onLogout={handleLogout} 
        vaultValue={totalVaultValue}
      />
      
      {showCheckout && (
        <CheckoutModal 
          items={stashItems} 
          onClose={() => setShowCheckout(false)} 
          onComplete={completeCheckout} 
        />
      )}

      <main className="flex-1 flex overflow-hidden p-6 gap-6 pt-22 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#f3cf65]/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10b981]/5 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Left Sidebar: Stats & Queries */}
        <aside className="w-64 shrink-0 flex flex-col gap-6 z-10">
          <section className="p-5 bg-[#0a0d14]/80 backdrop-blur-md border border-[#212a3d] rounded-lg flex flex-col gap-4 shadow-2xl">
            <h2 className="text-[11px] font-mono text-[#64748b] uppercase tracking-widest">Collection Dist</h2>
            <div className="space-y-4">
              {stats.map((entry) => {
                const total = stats.reduce((a, b) => a + b.value, 0);
                const perc = Math.round((entry.value / total) * 100);
                return (
                  <div key={entry.name} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono uppercase tracking-tighter">
                      <span className="text-white/80">{entry.name}</span>
                      <span className="text-[#f3cf65]">{perc}%</span>
                    </div>
                    <div className="h-1 bg-[#131924] rounded-full overflow-hidden border border-[#212a3d]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#f3cf65] transition-all duration-1000 shadow-[0_0_8px_rgba(243,207,101,0.5)]" 
                        style={{ width: `${perc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex-1 p-5 bg-[#0a0d14]/80 backdrop-blur-md border border-[#212a3d] rounded-lg overflow-hidden flex flex-col shadow-2xl">
            <h2 className="text-[11px] font-mono text-[#64748b] uppercase tracking-widest mb-4">QUICK ACCESS</h2>
            <ul className="space-y-2 text-[11px] font-mono">
              {["all", "nike", "adidas", "converse", "luxury"].map((c) => (
                <li
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "p-2 border cursor-pointer transition-all uppercase tracking-tight",
                    filter === c 
                      ? "border-[#f3cf65] bg-[#131924] text-[#f3cf65] text-glow" 
                      : "border-transparent text-[#64748b] hover:border-[#212a3d] hover:text-white"
                  )}
                >
                  SELECT * FROM {c}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* Main Content: Sneaker Grid */}
        <section className="flex-1 flex flex-col bg-[#0a0d14]/40 backdrop-blur-md border border-[#212a3d] rounded-lg overflow-hidden z-10 shadow-2xl">
          <div className="p-4 border-b border-[#212a3d] bg-[#0c121e]/90 flex items-center justify-between">
            <div className="font-mono text-xs text-[#f3cf65] text-glow">
              Executing: <span className="text-white uppercase tracking-[0.2em] font-bold">FETCH_VAULT_INVENTORY --{filter}</span>
            </div>
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-[#131924] text-[9px] font-mono text-[#64748b] border border-[#212a3d]">ROWS: {sneakers.length}</div>
              <div className="px-2 py-1 bg-[#131924] text-[9px] font-mono uppercase text-emerald-400 animate-pulse border border-emerald-500/30">Live_Sync</div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {loading ? (
              <div className="h-full flex items-center justify-center font-mono text-[11px] text-[#666] animate-pulse">
                INITIALIZING_SYNC_LOADER...
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence>
                  {sneakers.map((s) => (
                    <SneakerCard key={s.id} sneaker={s} onStash={handleStash} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="h-32 shrink-0 p-4 bg-[#05070a]/95 border-t border-[#212a3d] font-mono text-[10px] text-[#475569] overflow-hidden">
            <div className="text-[#f3cf65] mb-1 font-bold text-glow">[SYSTEM_LOG]</div>
            <div className="space-y-0.5">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#334155] shrink-0">{i.toString().padStart(2, '0')}:</span>
                  <span className="truncate">{log.startsWith(">") ? log.substring(2) : log}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Stash View */}
        <aside className="w-72 shrink-0 flex flex-col gap-6 z-10">
          <div className="flex-1 p-5 bg-[#0a0d14]/80 backdrop-blur-md border border-[#212a3d] rounded-lg overflow-hidden flex flex-col shadow-2xl">
            <h2 className="text-[11px] font-mono text-[#64748b] uppercase tracking-widest mb-6">Stash View</h2>
            <div className="flex-1 relative border border-[#212a3d] bg-[#05070a]/60 mb-4 overflow-y-auto group scrollbar-hide rounded-md overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#f3cf65]/5 to-transparent pointer-events-none" />
               <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#f3cf65] text-black text-[9px] font-bold tracking-tighter z-10 shadow-[0_0_10px_rgba(243,207,101,0.5)]">
                 VAULT_BUFFER
               </div>
               
               <div className="p-4 space-y-4">
                 {stashItems.length > 0 ? (
                   stashItems.map(item => (
                     <div key={item.stash_id} className="group/item flex gap-3 p-2 bg-[#131924]/60 border border-[#212a3d] hover:border-[#f3cf65]/40 transition-all rounded-lg">
                       <img src={item.img_url} className="w-10 h-10 object-cover grayscale brightness-75 group-hover/item:grayscale-0 group-hover/item:brightness-100 transition-all duration-500 rounded" />
                       <div className="flex-1 min-w-0">
                         <p className="text-[10px] text-white/90 font-mono truncate uppercase tracking-tight">{item.name}</p>
                         <div className="flex justify-between items-center mt-1">
                           <span className="text-[9px] text-[#f3cf65] font-mono font-bold">₹{item.price.toLocaleString()}</span>
                           <button 
                             onClick={() => removeFromStash(item.stash_id)}
                             className="text-[8px] text-[#475569] hover:text-red-400 hover:border-red-400 font-mono transition-all border border-[#212a3d] px-1.5 py-0.5 rounded uppercase"
                           >
                             Eject
                           </button>
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-32 flex flex-col items-center justify-center text-[10px] text-[#475569] font-mono text-center px-4 italic space-y-2">
                     <ShoppingBag className="w-5 h-5 opacity-20" />
                     <span>BUFFER_EMPTY: SELECT ASSETS TO ACQUIRE</span>
                   </div>
                 )}
               </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowCheckout(true)}
                disabled={stashItems.length === 0}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#f3cf65] text-black text-xs font-mono font-bold tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all uppercase disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(243,207,101,0.2)] rounded-lg"
              >
                Execute_Acquisition
              </button>
              <button 
                onClick={() => {
                  setLogs(prev => [...prev.slice(-3), "> INITIATING_CRYPTOGRAPHIC_FREEZE...", "> CALIBRATING_LEDGER_HASH: 0x8F2...A41", "> DATA_SNAPSHOT_SAVED: HypeVault_Inventory_Sync.sql"]);
                }}
                className="w-full py-3 border border-[#212a3d] text-[#64748b] text-[10px] font-mono tracking-widest hover:border-white/20 hover:text-white transition-all uppercase rounded-lg"
              >
                Generate_Snapshot
              </button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="h-8 bg-gradient-to-r from-[#d4af37] to-[#f3cf65] text-black flex items-center justify-between px-6 text-[9px] font-bold tracking-[0.3em] shrink-0 uppercase shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex gap-6">
          <div className="flex items-center gap-1.5"><DbIcon className="w-3 h-3"/> SQL_LEDGER: SYNCED</div>
          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3"/> AUTH: VERIFIED</div>
        </div>
        <div>© 2026 HYPE VAULT PRV_NET // ACCESS GRANTED</div>
      </footer>
    </div>
  );
}
