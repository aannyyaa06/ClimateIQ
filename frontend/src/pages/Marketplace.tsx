import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { ShoppingBag, TrendingUp, CheckCircle, Clock } from "lucide-react";

/*
  IMPORTANT:
  - Replace CONTRACT_ADDRESS with your deployed contract address.
  - Replace CONTRACT_ABI with the actual ABI (or keep minimal ABI with buyCredit if OK).
  - Make sure ethers v6 is installed: npm install ethers@^6
*/

const CONTRACT_ADDRESS = "0x3B3f8Fabb1139dC233A49750BA5064A6e01bd538"; // <-- replace
const CONTRACT_ABI = [
  // minimal ABI — replace with full ABI if available
  "function buyCredit(uint256 _id) public payable",
  "function getCredit(uint256 _id) public view returns (tuple(uint256 id,string name,uint256 price,address owner,bool sold))",
  "function creditCount() view returns (uint256)"
];

// sample data (the UI will show these if contract read not wired)
// If you want to read live listings from contract, we can add that later.
const sampleCredits = [
  { id: 1, name: "Mangrove Blue Carbon Credits", location: "Southeast Asia", priceUSD: "$25/ton", ethPrice: "0.01", available: "500 tons", verified: true, rating: 4.8 },
  { id: 2, name: "Rainforest Conservation Credits", location: "Amazon Basin", priceUSD: "$32/ton", ethPrice: "0.02", available: "1,200 tons", verified: true, rating: 4.9 },
  { id: 3, name: "Seagrass Restoration Credits", location: "Pacific Coast", priceUSD: "$28/ton", ethPrice: "0.015", available: "350 tons", verified: true, rating: 4.7 },
  { id: 4, name: "Coastal Wetland Credits", location: "Gulf of Mexico", priceUSD: "$0/ton", ethPrice: "0.0", available: "800 tons", verified: false, rating: 4.5 },
];

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl p-6 shadow-sm bg-white/90 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, disabled = false, className = "" }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition ${disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"} ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default function Marketplace() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null); // ethers BrowserProvider
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // track per-item loading states: Set of ids
  const [loadingIds, setLoadingIds] = useState(() => new Set());
  // track purchased / sold ids so button disables after buy
  const [soldIds, setSoldIds] = useState(() => new Set());

  // local UI listing data (use sample until contract read implemented)
  const [credits, setCredits] = useState(sampleCredits);

  // connect wallet logic
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        alert("Please install a web3 wallet (Rabby / MetaMask) and refresh the page.");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const acc = accounts[0];
      setAccount(acc);

      // v6 BrowserProvider
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);

      // Get signer
      const s = await p.getSigner();
      setSigner(s);

      // contract instance
      const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s);
      setContract(c);

      // Listen for account changes
      window.ethereum.on && window.ethereum.on("accountsChanged", (arr) => {
        if (arr.length === 0) {
          setAccount(null);
          setSigner(null);
          setContract(null);
        } else {
          setAccount(arr[0]);
        }
      });

      // Listen for network changes (optional)
      window.ethereum.on && window.ethereum.on("chainChanged", () => {
        // full reload ensures provider matches chain
        window.location.reload();
      });
    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Failed to connect wallet. See console for details.");
    }
  }, []);

  // Helper to set loading for one id
  const setLoadingForId = (id, isLoading) => {
    setLoadingIds((prev) => {
      const copy = new Set(prev);
      if (isLoading) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  };

  // Helper to mark sold
  const markSold = (id) => {
    setSoldIds((prev) => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });
  };

  // Purchase handler: only affects the one clicked
  const handlePurchase = async (id, ethPrice) => {
    if (!window.ethereum) {
      alert("No wallet detected. Install Rabby or MetaMask.");
      return;
    }
    if (!contract || !signer) {
      alert("Please connect your wallet first.");
      return;
    }

    // guard: don't allow double clicks
    if (loadingIds.has(id)) return;

    try {
      setLoadingForId(id, true);

      // parse price (ethPrice should be a string like "0.01")
      const value = ethers.parseEther(String(ethPrice)); // v6

      // send transaction
      const tx = await contract.buyCredit(id, { value });
      // give user feedback in console
      console.info("tx sent:", tx.hash ?? tx);
      // wait for 1 confirmation
      await tx.wait();
      // success
      markSold(id);
      alert(`Purchase successful — tx confirmed: ${tx.hash ?? "unknown-hash"}`);
    } catch (err) {
      console.error("Purchase failed:", err);
      // show friendly message
      const msg = err?.data?.message || err?.error?.message || err?.message || "Transaction failed or was rejected.";
      alert(`Transaction failed: ${msg}`);
    } finally {
      setLoadingForId(id, false);
    }
  };

  // If you want to fetch live listings from contract (optional)
  // Example: reading creditCount & credits — uncomment & adapt if your contract exposes creditCount/credits
  useEffect(() => {
    const loadFromContract = async () => {
      if (!contract) return;
      try {
        // If your contract has creditCount and credits mapping, you can fetch them:
        // const countBN = await contract.creditCount();
        // const count = Number(countBN.toString());
        // const list = [];
        // for (let i = 1; i <= count; i++) {
        //   const c = await contract.getCredit(i);
        //   // map contract return to UI format if needed
        // }
        // setCredits(list);
      } catch (err) {
        console.error("Failed to fetch contract listings:", err);
      }
    };
    loadFromContract();
  }, [contract]);

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "linear-gradient(180deg,#e6fffa,#f0fff4)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, marginBottom: 6, color: "#064e3b" }}>Carbon Credits Marketplace</h1>
          <p style={{ marginBottom: 12, color: "#065f46" }}>
            Trade verified carbon credits from community-led restoration projects
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Button onClick={connectWallet}>
              {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </Button>
            <div style={{ alignSelf: "center", color: "#065f46", fontSize: 14 }}>
              {contract ? "Contract ready" : "Contract not connected"}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
          <Card><div><ShoppingBag /><p style={{margin:6}}>Total Volume</p><div style={{fontWeight:700}}>45,890 tons</div></div></Card>
          <Card><div><TrendingUp /><p style={{margin:6}}>Avg. Price</p><div style={{fontWeight:700}}>$28.50/ton</div></div></Card>
          <Card><div><CheckCircle /><p style={{margin:6}}>Verified</p><div style={{fontWeight:700}}>89%</div></div></Card>
          <Card><div><Clock /><p style={{margin:6}}>Active</p><div style={{fontWeight:700}}>247</div></div></Card>
        </div>

        {/* Listings */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
          {credits.map((credit) => {
            const idNum = Number(credit.id);
            const isLoading = loadingIds.has(idNum);
            const isSold = soldIds.has(idNum);
            return (
              <Card key={credit.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#064e3b" }}>{credit.name}</div>
                    <div style={{ color: "#065f46" }}>{credit.location}</div>
                  </div>
                  <div style={{ alignSelf: "center" }}>{credit.verified ? <span style={{background:"#059669", color:"#fff", padding:"4px 8px", borderRadius:8}}>Verified</span> : <span style={{border:"1px solid #94a3b8", padding:"4px 8px", borderRadius:8}}>Pending</span>}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#475569" }}>Price per ton</div>
                    <div style={{ fontWeight: 700, color: "#065f46" }}>{credit.priceUSD ?? credit.priceUSD} ({credit.ethPrice} ETH)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#475569" }}>Available</div>
                    <div style={{ fontWeight: 700, color: "#065f46" }}>{credit.available}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e6e6e6", paddingTop: 12 }}>
                  <div style={{ color: "#475569" }}>Rating: <strong style={{color:"#065f46"}}>{credit.rating}/5.0</strong></div>
                  <Button
                    onClick={() => handlePurchase(idNum, credit.ethPrice)}
                    disabled={isLoading || isSold}
                    className={isLoading ? "opacity-80" : ""}
                  >
                    {isSold ? "Sold" : isLoading ? "Processing..." : "Purchase Credits"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

