/**
 * Connect to the Arweave wallet using ArConnect and request permissions.
 * @returns {Promise<string>} The active wallet address.
 */
export const connectWallet = async () => {
    await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_PUBLIC_KEY', 'SIGNATURE']);
    const address = await window.arweaveWallet.getActiveAddress();
    return address;
  };
  
  /**
   * Truncate a wallet address for display purposes.
   * @param {string} address - The wallet address to truncate.
   * @returns {string} The truncated address.
   */
  export const truncateAddress = (address) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };
  