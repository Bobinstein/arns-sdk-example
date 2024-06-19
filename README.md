# Ar.io SDK Example Project

This project serves as a code example to showcase the usage of the Ar.io SDK for interacting with the Arweave ecosystem. It demonstrates how to fetch, display, and manage Arweave Name Tokens (ANTs) and related records.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [SDK Methods](#sdk-methods)
  - [fetchArNSRecords](#fetcharnsrecords)
  - [fetchRecordDetails](#fetchrecorddetails)
  - [setANTRecord](#setantrecord)
- [Components](#components)
- [Utils](#utils)

## Installation

### Prerequisites

- Node.js (>=v18.0.0)
- npm or yarn

### Installing the SDK

To install the Ar.io SDK, run the following command in your project directory:

```
npm install @ar.io/sdk
```

or

```
yarn add @ar.io/sdk
```

## Usage

### Quick Start in Web Environment

In a web environment, you can use the SDK as follows:

```
import { ArIO } from '@ar.io/sdk/web';

// Initialize the SDK
const arIO = ArIO.init();

// Fetch the list of gateways
const gateways = await arIO.getGateways();

console.log(gateways);
```

## Project Structure

The project is organized as follows:

- `src/`
  - `components/`
    - `Header.js`: Component for the header and wallet connection.
    - `RecordsGrid.js`: Component for displaying a grid of ArNS records.
    - `RecordDetails.js`: Component for displaying details of a selected record.
    - `Spinner.js`: Component for displaying a loading spinner.
  - `utils/`
    - `arweave.js`: Utility functions for interacting with the Arweave network using the Ar.io SDK.
    - `auth.js`: Utility functions for wallet connection and address handling.

## SDK Methods

### fetchArNSRecords

Fetch all ArNS records using the Ar.io SDK.

**Location in the project:** `src/utils/arweave.js`

```
import { ArIO } from "@ar.io/sdk/web";

/**
 * Initialize ArIO and fetch all ArNS records.
 * @returns {Promise<Object>} All ArNS records.
 */
export const fetchArNSRecords = async () => {
  const arIO = ArIO.init();
  const allRecords = await arIO.getArNSRecords();
  return allRecords;
};
```

**Example Usage:**

```
useEffect(() => {
  const fetchRecords = async () => {
    const allRecords = await fetchArNSRecords();
    setArnsRecords(allRecords);
  };

  fetchRecords();
}, []);
```

**Example Output:**

```
{
  "example": {
    "contractTxId": "txId1",
    "endTimestamp": 1741724018,
    "purchasePrice": 7965293441,
    "startTimestamp": 1710188018,
    "type": "lease",
    "undernames": 10
  },
  "another": {
    "contractTxId": "txId2",
    "endTimestamp": 1715665687,
    "purchasePrice": 124565540,
    "startTimestamp": 1694101828,
    "type": "lease",
    "undernames": 100
  }
}
```

### fetchRecordDetails

Fetch detailed records, owner, and controllers for a given contractTxId using the Ar.io SDK.

**Location in the project:** `src/utils/arweave.js`

```
import { ANT } from "@ar.io/sdk/web";

/**
 * Fetch detailed records, owner, and controllers for a given contractTxId.
 * @param {string} contractTxId - The contract transaction ID.
 * @returns {Promise<Object>} Detailed records, owner, and controllers.
 */
export const fetchRecordDetails = async (contractTxId) => {
  const ant = ANT.init({ contractTxId });
  const detailedRecords = await ant.getRecords();
  const owner = await ant.getOwner();
  const controllers = await ant.getControllers();
  return { detailedRecords, owner, controllers };
};
```

**Example Usage:**

```
const handleKeyClick = async (key) => {
  const record = arnsRecords[key];
  if (record && record.contractTxId) {
    const { detailedRecords, owner, controllers } = await fetchRecordDetails(
      record.contractTxId
    );
    setSelectedRecord({
      key,
      records: detailedRecords,
      contractTxId: record.contractTxId,
    });
    setOwner(owner);
    setControllers(Array.isArray(controllers) ? controllers : []);
  }
};
```

**Example Output:**

```
{
  "detailedRecords": {
    "@": { "transactionId": "txId3", "ttlSeconds": 3600 }
  },
  "owner": "ownerAddress",
  "controllers": ["controller1", "controller2"]
}
```

### setANTRecord

Set a new record in the ANT contract using the Ar.io SDK.

**Location in the project:** `src/utils/arweave.js`

```
import { ANT, ArconnectSigner } from "@ar.io/sdk/web";

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
```

**Example Usage:**

```
const handleUpdateRecord = async (subDomain, newTxId) => {
  if (!subDomain.trim()) {
    setResultMessage("Subdomain cannot be empty.");
    return;
  }
  setIsProcessing(true);
  try {
    const result = await setANTRecord(
      selectedRecord.contractTxId,
      subDomain,
      newTxId || "UyC5P5qKPZaltMmmZAWdakhlDXsBF6qmyrbWYFchRTk",
      900
    );
    setResultMessage(
      `Record updated with TxId ${result.id}. Please allow up to 30 minutes for transaction to settle.`
    );
  } catch (error) {
    setResultMessage("Failed to update record. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
```

**Example Output:**

```
{
  "format": 2,
  "id": "q_neciTNBsPMq7LQ-uF0p5FJJTtDUU0yLpOQ_Tz-yf4",
  "last_tx": "RDDWJ58aG7jUPeXOSeCWklLuYGWxGP9TWxhT3kCscGcmdmQgGYAVmxr_BHgjOH8t",
  "owner": "kl8stGDQ8qfZqkFJu7fBvCyKvII1Bd5hyczp0G-rZnDEZxsj-5esz6-mnu9E7p53nAdx-xF_FMhy6MIjPGsQYTuj_yVXOVlXe1gPqCfQwXsZaYx_fPDuXYTrYqWV3XA1cGTNdhnT-kXpoPiwudga3KCvlHgRFdSnu28r9H1JVn4EuNzC7CHAVsky3LhkR3e9I-fxaVjZNN-SImouEqN9-Txbrc2nnRGkPu36y1RMfoBAhucEkxj_jNTmDrBf0apYvAHWr_ljct26Ykzc0T-xItFTg8t3rBxd7Pj2MX6Nl7pvMJde8FbT2au2p-ElVdmA2WMdPZ3xML--5RuFtxznuMarMMfBKsUx50HOB4EtTNxMQTm1k6CYCJDUyr1R9Bb0_CytW1M3XIIw1LxwfuZlHg9ZwoAwyyrxLCFfudj5wvmiY4dqwRk4dAfCC4y1J4ryPwp43Xod1KVWWqLsKQK3XI2l5ye-P-TcyWgMM5xKebdqaouJ9...
}
```

## Components

- **Header.js**: Component for displaying the connect wallet button and connected wallet address.
- **RecordsGrid.js**: Component for displaying a grid of ArNS record keys.
- **RecordDetails.js**: Component for displaying details of a selected record, including the ability to update records.
- **Spinner.js**: Component for displaying a loading spinner while processing.

## Utils

- **arweave.js**: Utility functions for interacting with the Arweave network using the Ar.io SDK.
- **auth.js**: Utility functions for wallet connection and address handling.
"""
