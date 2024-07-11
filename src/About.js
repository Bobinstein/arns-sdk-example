import React from "react";

/**
 * About component for displaying information about the application.
 */
const About = () => {
  return (
    <div className="about">
      <h1>About</h1>
      <h2>This Project</h2>
      <p>
        This simple project was made to serve as an example for interacting with
        the Arweave Name System (ArNS) using the ar.io SDK.
      </p>
      <p>
        The source code may be found on{" "}
        <a
          href="https://github.com/Bobinstein/arns-sdk-example"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        . The source code contains code comments explaining the use of every
        method from the ar.io SDK.
      </p>
      <h2>ArNS</h2>
      <p>
        The Arweave Name System is a way to assign friendly names to Arweave
        wallets, Transaction IDs or AO Process IDs. When combined with Arweave{" "}
        <a
          href="https://docs.ar.io/manifests/"
          target="_blank"
          rel="noreferrer"
        >
          manifests
        </a>
        , ArNS can be used to easily host and share full websites like this one
        on the permaweb.
      </p>
      <p>
        Learn more about ArNS on the{" "}
        <a
          href="https://docs.ar.io/arns/"
          target="https://docs.ar.io/arns/"
          rel="noreferrer"
        >
          official documentation portal
        </a>
      </p>
      <h2>ar.io SDK</h2>
      <p>
        The ar.io SDK is an npm package that can be used for interactions with
        all aspects of the{" "}
        <a
          href="https://docs.ar.io/introduction/"
          target="_blank"
          rel="noreferrer"
        >
          ar.io network
        </a>
        . This includes ArNS names, the{" "}
        <a
          href="https://docs.ar.io/gateway-network/"
          target="_blank"
          rel="noreferrer"
        >
          Gateway Address Registry
        </a>
        , and the tIO token.
      </p>
      <p>
        The SDK source code can be found on{" "}
        <a
          href="https://github.com/ar-io/ar-io-sdk"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        , and documentation for its installation and usage can be found on the{" "}
        <a href="https://docs.ar.io/sdk/" target="_blank" rel="noreferrer">
          official documentation portal
        </a>
      </p>
    </div>
  );
};

export default About;
