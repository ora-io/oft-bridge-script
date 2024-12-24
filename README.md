# OFT Bridge Script

## Overview

This project provides a simple example demonstrating how to send **OFT (Omnichain Fungible Tokens)** across different blockchain networks using scripts. You can use it to send tokens across chains or send back the OFT tokens to the origin chain. It supports transferring tokens between the mainnet and the Base network.

## Prerequisites

Before getting started, ensure you have the following tools installed:

- **Node.js** (recommended v16 or higher)
- **Yarn** (a JavaScript package manager)

You can check if these are installed by running the following commands:

```bash
node -v
yarn -v
```

If they're not installed, you can install them from [Node.js official website](https://nodejs.org/) and [Yarn official website](https://yarnpkg.com/).

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   Run the following command to clone this repository to your local machine:

   ```bash
   git clone git@github.com:ora-io/oft-bridge-script.git
   cd oft-bridge-script
   ```

2. **Install Dependencies**

   Install the required dependencies using `Yarn`:

   ```bash
   yarn install
   ```

3. **Copy the Environment Variables File**

   In the root directory of the project, you'll find a `.env.example` file. Copy it and rename it to `.env`:

   ```bash
   cp .env.example .env
   ```

4. **Fill in the Environment Variables**

   Open the `.env` file and fill in the following required fields:
   - **{XXX}_RPC_URL**: The RPC URL of the network you want to use.
   - **SENDER_ACCOUNT_PRIV_KEY**: The private key of the sender account (used to sign the transaction).
   - **RECEIVER_ACCOUNT_ADDRESS**: The address of the receiving account.
   - **SEND_AMOUNT**: The amount of tokens to send. (if you want to send 1 ora coin, put 1 in here).

   Example:

   ```env
   # Test bridge token
   SENDER_ACCOUNT_PRIV_KEY=your_wallet_private_key
   RECEIVER_ACCOUNT_ADDRESS=receiver_wallet_address

   # Token amount to send
   SEND_AMOUNT=1
   ```

## Usage

Once you've configured the environment variables, you can run the following commands to send OFT tokens across chains:

### Sending Tokens Between Networks

#### Ethereum to Other Networks

- **To Arbitrum:**
  ```bash
  yarn run ora-eth-to-arbitrum
  ```

- **To Base:**
  ```bash
  yarn run ora-eth-to-base
  ```

- **To Binance:**
  ```bash
  yarn run ora-eth-to-binance
  ```

#### Base to Other Networks

- **To Ethereum:**
  ```bash
  yarn run ora-base-to-eth
  ```

- **To Binance:**
  ```bash
  yarn run ora-base-to-binance
  ```

- **To Arbitrum:**
  ```bash
  yarn run ora-base-to-arbitrum
  ```

#### Arbitrum to Other Networks

- **To Base:**
  ```bash
  yarn run ora-arbitrum-to-base
  ```

- **To Binance:**
  ```bash
  yarn run ora-arbitrum-to-binance
  ```

- **To Ethereum:**
  ```bash
  yarn run ora-arbitrum-to-eth
  ```

#### Binance to Other Networks

- **To Base:**
  ```bash
  yarn run ora-binance-to-base
  ```

- **To Arbitrum:**
  ```bash
  yarn run ora-binance-to-arbitrum
  ```

- **To Ethereum:**
  ```bash
  yarn run ora-binance-to-eth
  ```

This command will send the tokens back from the Base network to the mainnet.

## Important Notes

- Make sure that the private keys and addresses you are using are correct and secure.
- Double-check the token amounts before sending to avoid sending incorrect values.
- This script is intended for development and testing purposes. Please ensure proper validation and auditing before using it in a production environment.

## Common Issues

### How do I get my wallet private key?

Your wallet private key can typically be exported from the wallet you are using (e.g., MetaMask or other wallets). Make sure to keep the private key secure and do not expose it to anyone.

### How do I get my wallet address?

You can view your wallet address in your crypto wallet. Wallet addresses usually begin with `0x` followed by a string of characters.

### Does this support other networks?

Currently, this project supports the mainnet and the Base network. Additional blockchain networks may be supported in the future.

## Contributing

We welcome contributions! If you have any ideas, improvements, or bug fixes, feel free to submit a pull request. Before submitting, please ensure that all tests are run and the code is thoroughly validated.

## License

This project is licensed under the [MIT License](LICENSE), which allows you to freely use, modify, and distribute the code.

---

If you encounter any issues or have questions, please feel free to open an issue or reach out. We hope this tool helps you in your cross-chain token transfer needs!