import React from "react";
import { connectWallet, truncateAddress } from "../utils/auth";
import Nav from "./Nav";

/**
 * Header component for displaying the connect wallet button and navigation.
 * @param {Object} props - Component props.
 * @param {string} props.address - The connected wallet address.
 * @param {function} props.setAddress - Function to set the connected wallet address.
 */
const Header = ({ address, setAddress }) => {
  const handleConnectWallet = async () => {
    try {
      const walletAddress = await connectWallet();
      setAddress(walletAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="header">
      <Nav />
      <button className="connect-wallet" onClick={handleConnectWallet}>
        {address ? `Connected: ${truncateAddress(address)}` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Header;
