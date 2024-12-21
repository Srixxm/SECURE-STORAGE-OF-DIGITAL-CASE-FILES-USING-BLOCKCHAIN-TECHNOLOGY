import React, { useState } from "react";
import './Home.css';

function Home() {
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install it to use this DApp.");
        }
    };

    return (
        <div className="container">
            <div className="text-content">
                <h1>Welcome to the Future of Digital Case File Storage</h1>
                <p>Applications in Legal & Case Management:
Our solution is designed to transform how law firms, courts, and businesses manage case files, offering an unmatched level of security, transparency, and operational efficiency. Whether you're handling confidential legal documents, contracts, or sensitive client information, our platform ensures that every file is protected by the power of blockchain.</p>
                <h3>Why Blockchain for Case Files??</h3>
                <p>Blockchain technology offers a decentralized and tamper-proof ledger that ensures every piece of data is secure and cannot be altered or manipulated. With our system, every document you upload is encrypted, timestamped, and securely stored on the blockchain, offering you complete peace of mind.</p>
            </div>
            <div className="card">
                <button onClick={connectWallet}>Connect Wallet</button>
                {account && <p className="connected-address">Connected as: {account}</p>}
            </div>
        </div>
    );
}

export default Home;