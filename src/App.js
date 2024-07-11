import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import RecordsGrid from "./components/RecordsGrid";
import RecordDetails from "./components/RecordDetails";
import Spinner from "./components/Spinner";
import About from "./About"; // Import the About component
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
      const allRecords = await fetchArNSRecords();
      setArnsRecords(allRecords);
    };

    fetchRecords();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyClick = async (key) => {
    const record = arnsRecords[key];
    if (record && record.processId) {
      const { detailedRecords, owner, controllers } = await fetchRecordDetails(
        record.processId
      );
      setSelectedRecord({
        key,
        records: detailedRecords,
        processId: record.processId,
      });
      setOwner(owner);
      setControllers(Array.isArray(controllers) ? controllers : []);
    }
  };

  const handleUpdateRecord = async (subDomain, newTxId) => {
    if (!subDomain.trim()) {
      setResultMessage("Subdomain cannot be empty.");
      return;
    }
    setIsProcessing(true);
    try {
      const result = await setANTRecord(
        selectedRecord.processId,
        subDomain,
        newTxId || "UyC5P5qKPZaltMmmZAWdakhlDXsBF6qmyrbWYFchRTk",
        900
      );

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

  return (
    <Router>
      <div className="App">
        <Header address={address} setAddress={setAddress} />
        <Routes>
          <Route
            path="/"
            element={
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
                      address &&
                      (address === owner || controllers.includes(address))
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
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
