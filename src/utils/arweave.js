import { ArIO, ANT, ArconnectSigner } from "@ar.io/sdk/web";

/**
 * Initialize ArIO and fetch all ArNS records.
 * @returns {Promise<Object>} All ArNS records.
 */
export const fetchArNSRecords = async () => {
  const arIO = ArIO.init();
  const allRecords = await arIO.getArNSRecords();
  return allRecords;
};

/**
 * Initialize ANT with the given contractTxId.
 * @param {string} contractTxId - The contract transaction ID.
 * @returns {Object} ANT instance.
 */
export const initANT = (contractTxId) => {
  return ANT.init({ contractTxId });
};

/**
 * Fetch detailed records, owner, and controllers for a given contractTxId.
 * @param {string} contractTxId - The contract transaction ID.
 * @returns {Promise<Object>} Detailed records, owner, and controllers.
 */
export const fetchRecordDetails = async (contractTxId) => {
  const ant = initANT(contractTxId);
  const detailedRecords = await ant.getRecords();
  const owner = await ant.getOwner();
  const controllers = await ant.getControllers();
  return { detailedRecords, owner, controllers };
};

/**
 * Set a new record in the ANT contract.
 * @param {string} contractTxId - The contract transaction ID.
 * @param {string} subDomain - The subdomain for the record.
 * @param {string} transactionId - The transaction ID the record should resolve to.
 * @param {number} ttlSeconds - The Time To Live (TTL) in seconds.
 * @returns {Promise<Object>} Result of the record update.
 */
export const setANTRecord = async (contractTxId, subDomain, transactionId, ttlSeconds) => {
  const browserSigner = new ArconnectSigner(window.arweaveWallet);
  const ant = ANT.init({ contractTxId, signer: browserSigner });
  const result = await ant.setRecord({ subDomain, transactionId, ttlSeconds });
  return result;
};
