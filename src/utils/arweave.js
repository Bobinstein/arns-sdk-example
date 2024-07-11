import { IO, ANT, ArconnectSigner } from "@ar.io/sdk/web";

/**
 * Initialize ArIO and fetch all ArNS records.
 * @returns {Promise<Object>} All ArNS records.
 */
export const fetchArNSRecords = async () => {
  const arIO = IO.init();
  let allRecords = [];
  let hasMore = true;
  let cursor;

  // Paginates through all records to get the full registry.
  while (hasMore) {
    const response = await arIO.getArNSRecords({
      limit: 100, // You can adjust the limit as needed
      sortBy: 'name',
      sortOrder: 'asc',
      cursor: cursor,
    });

    allRecords = [...allRecords, ...response.items];
    cursor = response.nextCursor;
    hasMore = response.hasMore;
  }

  // console.log(allRecords);
  return allRecords;
};


/**
 * Initialize ANT with the given processId.
 * @param {string} processId - The processId.
 * @returns {Object} ANT instance.
 */
export const initANT = (processId) => {
  return ANT.init({ processId });
};

/**
 * Fetch detailed records, owner, and controllers for a given processId.
 * @param {string} contractTxId - The processId.
 * @returns {Promise<Object>} Detailed records, owner, and controllers.
 */
export const fetchRecordDetails = async (processId) => {
  const ant = initANT(processId);
  const detailedRecords = await ant.getRecords();
  const owner = await ant.getOwner();
  const controllers = await ant.getControllers();
  return { detailedRecords, owner, controllers };
};

/**
 * Set a new record in the ANT process.
 * @param {string} processId - The processId.
 * @param {string} subDomain - The subdomain for the record.
 * @param {string} transactionId - The transaction ID the record should resolve to.
 * @param {number} ttlSeconds - The Time To Live (TTL) in seconds.
 * @returns {Promise<Object>} Result of the record update.
 */
export const setANTRecord = async (
  processId,
  name,
  transactionId,
  ttlSeconds
) => {
  const browserSigner = new ArconnectSigner(window.arweaveWallet);
  const ant = ANT.init({ processId, signer: browserSigner });
  const result = await ant.setRecord({
    undername: name,
    transactionId,
    ttlSeconds,
  });
  console.log(result);
  return result;
};
