import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import RecordsGrid from "./components/RecordsGrid";
import RecordDetails from "./components/RecordDetails";
import Spinner from "./components/Spinner";
import {
  fetchArNSRecords,
  fetchRecordDetails,
  setANTRecord,
} from "./utils/arweave";

/**
 * App component serving as the main component for the application.
 */
function App() {
  const [arnsRecords, setArnsRecords] = useState(null); // State for storing all ArNS records
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record
  const [address, setAddress] = useState(null); // State for wallet address
  const [owner, setOwner] = useState(null); // State for owner
  const [controllers, setControllers] = useState([]); // State for controllers
  const [newSubdomain, setNewSubdomain] = useState(""); // State for new subdomain
  const [newTxId, setNewTxId] = useState(""); // State for new transaction ID
  const [isProcessing, setIsProcessing] = useState(false); // State for processing indicator
  const [resultMessage, setResultMessage] = useState(""); // State for result message

  // Fetch ArNS records when the component mounts
  useEffect(() => {
    const fetchRecords = async () => {
      // Fetch all ArNS records using the ar.io SDK
      const allRecords = await fetchArNSRecords();
      // Example output: {
      //   "example": { contractTxId: "txId1",
      //     endTimestamp: 1741724018,
      //     purchasePrice: 7965293441,
      //     startTimestamp: 1710188018,
      //     type: "lease",
      //     undernames: 10
      //   },
      // "another": {
      //      contractTxId: "txId2",
      //      endTimestamp: 1715665687,
      //      purchasePrice: 124565540,
      //      startTimestamp: 1694101828,
      //      type: "lease", undernames: 100
      //     } }
      setArnsRecords(allRecords);
    };

    fetchRecords();
  }, []);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle key click to fetch detailed record information
  const handleKeyClick = async (key) => {
    const record = arnsRecords[key];
    if (record && record.processId) {
      // Fetch detailed records, owner, and controllers using the ar.io SDK
      const { detailedRecords, owner, controllers } = await fetchRecordDetails(
        record.processId
      );
      // Example detailedRecords output: { "@": { transactionId: "txId3", ttlSeconds: 3600 } }
      // Example owner output: "ownerAddress"
      // Example controllers output: ["controller1", "controller2"]
      setSelectedRecord({
        key,
        records: detailedRecords,
        processId: record.processId,
      });
      setOwner(owner);
      setControllers(Array.isArray(controllers) ? controllers : []);
    }
  };

  // Handle updating a record
  const handleUpdateRecord = async (subDomain, newTxId) => {
    if (!subDomain.trim()) {
      setResultMessage("Subdomain cannot be empty.");
      return;
    }
    setIsProcessing(true);
    try {
      // Set a new record in the ANT contract using the ar.io SDK
      const result = await setANTRecord(
        selectedRecord.processId,
        subDomain,
        newTxId || "UyC5P5qKPZaltMmmZAWdakhlDXsBF6qmyrbWYFchRTk",
        900
      );
      // Example output: {
      //   format: 2,
      //   id: "q_neciTNBsPMq7LQ-uF0p5FJJTtDUU0yLpOQ_Tz-yf4",
      //   last_tx:
      //     "RDDWJ58aG7jUPeXOSeCWklLuYGWxGP9TWxhT3kCscGcmdmQgGYAVmxr_BHgjOH8t",
      //   owner:
      //     "kl8stGDQ8qfZqkFJu7fBvCyKvII1Bd5hyczp0G-rZnDEZxsj-5esz6-mnu9E7p53nAdx-xF_FMhy6MIjPGsQYTuj_yVXOVlXe1gPqCfQwXsZaYx_fPDuXYTrYqWV3XA1cGTNdhnT-kXpoPiwudga3KCvlHgRFdSnu28r9H1JVn4EuNzC7CHAVsky3LhkR3e9I-fxaVjZNN-SImouEqN9-Txbrc2nnRGkPu36y1RMfoBAhucEkxj_jNTmDrBf0apYvAHWr_ljct26Ykzc0T-xItFTg8t3rBxd7Pj2MX6Nl7pvMJde8FbT2au2p-ElVdmA2WMdPZ3xML--5RuFtxznuMarMMfBKsUx50HOB4EtTNxMQTm1k6CYCJDUyr1R9Bb0_CytW1M3XIIw1LxwfuZlHg9ZwoAwyyrxLCFfudj5wvmiY4dqwRk4dAfCC4y1J4ryPwp43Xod1KVWWqLsKQK3XI2l5ye-P-TcyWgMM5xKebdqaouJ9tYeYiNl1aNRoRnHjgMD45uLmsZ-miUoaJvFQmTPofxRuuvlPDvaicyJrAvOjWcFK5LlNaQJWcPk0IUgIf1HvwU5jz1IT3K6f72eC2wZcmJ-22ePnX1Jv2a0gU2oumcgYKt8hWFjcoeo4aeir_3OeK7nf0fZmRj5AHafPxWVxwWSBK-3YGicaZM7EW0",
      //   data_root: "bHKlUYQ_UplJAkF_ttjbUyENUZUUNNGZUzl9jQpS7Yw",
      // };

      // Fetch updated record details
      const { detailedRecords, owner, controllers } = await fetchRecordDetails(
        selectedRecord.processId
      );
      setSelectedRecord({
        key: selectedRecord.key,
        records: detailedRecords,
        processId: selectedRecord.processId,
      });
      setOwner(owner);
      setControllers(Array.isArray(controllers) ? controllers : []);

      setResultMessage(`Record updated with TxId ${result.id}`);
    } catch (error) {
      setResultMessage("Failed to update record. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render component
  return (
    <div className="App">
      <Header address={address} setAddress={setAddress} />
      <div className="records-container">
        {!selectedRecord && (
          <>
            <h2>ARNS Records Keys:</h2>
            <input
              type="text"
              placeholder="Filter records"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </>
        )}
        {isProcessing ? (
          <Spinner />
        ) : selectedRecord ? (
          <RecordDetails
            selectedRecord={selectedRecord}
            owner={owner}
            controllers={controllers}
            isAuthorized={
              address && (address === owner || controllers.includes(address))
            }
            handleUpdateRecord={handleUpdateRecord}
            newSubdomain={newSubdomain}
            newTxId={newTxId}
            setNewSubdomain={setNewSubdomain}
            setNewTxId={setNewTxId}
            resultMessage={resultMessage}
            setSelectedRecord={setSelectedRecord}
          />
        ) : (
          <RecordsGrid
            keys={Object.keys(arnsRecords || {}).filter((key) =>
              key.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            handleKeyClick={handleKeyClick}
          />
        )}
      </div>
    </div>
  );
}

export default App;
