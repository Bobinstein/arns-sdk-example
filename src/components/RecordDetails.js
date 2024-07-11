import React from "react";

/**
 * RecordDetails component for displaying detailed record information.
 * @param {Object} props - Component props.
 * @param {Object} props.selectedRecord - The selected record details.
 * @param {string} props.owner - The owner of the record.
 * @param {Array<string>} props.controllers - The controllers of the record.
 * @param {boolean} props.isAuthorized - Whether the user is authorized to update the record.
 * @param {function} props.handleUpdateRecord - Function to handle updating the record.
 * @param {string} props.newSubdomain - The new subdomain value.
 * @param {string} props.newTxId - The new transaction ID value.
 * @param {function} props.setNewSubdomain - Function to set the new subdomain value.
 * @param {function} props.setNewTxId - Function to set the new transaction ID value.
 * @param {string} props.resultMessage - Message displaying the result of the record update.
 * @param {function} props.setSelectedRecord - Function to set the selected record.
 */
const RecordDetails = ({
  selectedRecord,
  owner,
  controllers,
  isAuthorized,
  handleUpdateRecord,
  newSubdomain,
  newTxId,
  setNewSubdomain,
  setNewTxId,
  resultMessage,
  setSelectedRecord,
}) => {
  return (
    <div className="record-details">
      <h3>Record Details</h3>
      <div>
        {Object.keys(selectedRecord.records).map((recordKey, index) => (
          <div key={index} className="record-txid">
            <strong>{recordKey}:</strong>{" "}
            <a
              href={`https://arweave.net/${selectedRecord.records[recordKey].transactionId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedRecord.records[recordKey].transactionId}
            </a>
          </div>
        ))}
      </div>
      <p>Owner: {owner || "N/A"}</p>
      <p>
        Controllers: {controllers.length > 0 ? controllers.join(", ") : "N/A"}
      </p>
      {isAuthorized && (
        <>
          {Object.keys(selectedRecord.records).map((recordKey, index) => (
            <div key={index} className="record-update">
              <label>
                {recordKey}:
                <input
                  type="text"
                  placeholder="Enter new TxID"
                  onBlur={(e) =>
                    handleUpdateRecord(
                      recordKey === "@" ? selectedRecord.key : `${recordKey}`,
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleUpdateRecord(
                      recordKey === "@" ? "@" : `${recordKey}`,
                      newTxId
                    )
                  }
                >
                  Update
                </button>
              </label>
            </div>
          ))}
          <div className="new-record">
            <input
              type="text"
              placeholder="New Subdomain"
              value={newSubdomain}
              onChange={(e) => setNewSubdomain(e.target.value)}
            />
            <input
              type="text"
              placeholder="New TxID"
              value={newTxId}
              onChange={(e) => setNewTxId(e.target.value)}
            />
            <button
              onClick={() => handleUpdateRecord(`${newSubdomain}`, newTxId)}
            >
              Set New Record
            </button>
          </div>
        </>
      )}
      <button onClick={() => setSelectedRecord(null)}>Back to list</button>
      {resultMessage && <p>{resultMessage}</p>}
    </div>
  );
};

export default RecordDetails;
