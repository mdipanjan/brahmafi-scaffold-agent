# Intelligent DCA Agent Plan for CowSwap

This document outlines the comprehensive plan to build an **Intelligent Dollar-Cost Averaging (DCA) Agent** on **CowSwap** using the existing **Scaffold Agent** structure and leveraging **ConsoleKit** from [Brahma](https://brahma.fi/). The agent will create limit orders using workflows, dynamically adjust order sizes based on price, volume, and liquidity, and utilize the [Coingecko API](https://www.coingecko.com/en/api) for real-time price feeds.

## Table of Contents

1. [Objectives and Requirements](#1-objectives-and-requirements)
2. [Architecture Overview](#2-architecture-overview)
3. [Key Components](#3-key-components)
   - [3.1. CowSwap Integration](#31-cowswap-integration)
   - [3.2. Workflow Management](#32-workflow-management)
   - [3.3. Limit Order Creation](#33-limit-order-creation)
   - [3.4. Dynamic Size Adjustment](#34-dynamic-size-adjustment)
   - [3.5. Price Feed Integration](#35-price-feed-integration)
   - [3.6. Monitoring and Execution](#36-monitoring-and-execution)
   - [3.7. Security Measures](#37-security-measures)
4. [Implementation Steps](#4-implementation-steps)
   - [4.1. Environment Setup](#41-environment-setup)
   - [4.2. Setting Up CowSwap SDK](#42-setting-up-cowswap-sdk)
   - [4.3. Developing Workflow Logic](#43-developing-workflow-logic)
   - [4.4. Integrating Coingecko API](#44-integrating-coingecko-api)
   - [4.5. Implementing Dynamic Adjustment Algorithms](#45-implementing-dynamic-adjustment-algorithms)
   - [4.6. Creating Limit Orders](#46-creating-limit-orders)
   - [4.7. Testing and Deployment](#47-testing-and-deployment)
5. [Tools and Technologies](#5-tools-and-technologies)
6. [Timeline and Milestones](#6-timeline-and-milestones)
7. [Potential Challenges and Solutions](#7-potential-challenges-and-solutions)
8. [References](#8-references)

---

## 1. Objectives and Requirements

- **Automated Trading Strategy:** Implement a DCA strategy that automates the purchase of tokens at regular intervals.
- **Dynamic Order Sizing:** Adjust the size of each purchase based on real-time market data such as price, volume, and liquidity.
- **Limit Order Creation:** Use workflows to create and manage limit orders on CowSwap.
- **Price Feed Integration:** Utilize the Coingecko API to obtain accurate and up-to-date price information.
- **Security:** Ensure all operations are secure, with proper authentication and authorization mechanisms in place.
- **Scalability:** Design the system to handle increased load and additional functionalities in the future.

## 2. Architecture Overview

The **Intelligent DCA Agent** will be built upon the existing **Scaffold Agent** structure, integrating CowSwap's SDK and ConsoleKit to facilitate automated DeFi operations. The architecture consists of the following layers:

1. **Data Layer:** Fetches and processes real-time market data from Coingecko and CowSwap.
2. **Logic Layer:** Implements the DCA algorithm, decision-making processes, and dynamic adjustments.
3. **Execution Layer:** Interfaces with CowSwap SDK to create and manage limit orders.
4. **Workflow Management:** Coordinates the sequence of operations using ConsoleKit's `kernel-workflow`.
5. **Security Layer:** Manages keys, permissions, and ensures secure interactions with APIs and blockchain.

![Architecture Diagram](./images/architecture_diagram.png) _(Placeholder for actual diagram)_

## 3. Key Components

### 3.1. CowSwap Integration

- **CowSwap SDK:** Utilize CowSwap's SDK to interact with the protocol for creating, managing, and executing orders.
- **Custom DApp Integration:** Develop or extend the existing DApp to leverage CowSwap's functionalities.
- **Tool Integration:** Create dedicated tools within `agent-server/src/tools/` for CowSwap operations.

### 3.2. Workflow Management

- **ConsoleKit Kernel Workflow:** Leverage `kernel-workflow` to manage and automate the creation and execution of limit orders.
- **Task Scheduling:** Define and schedule tasks that align with the DCA strategy using existing scripts like `agent-workflow.ts`.

### 3.3. Limit Order Creation

- **Order Parameters:** Define the parameters for limit orders, including token pairs, amounts, price thresholds, and expiration times.
- **Order Lifecycle Management:** Implement logic to handle the creation, updating, and cancellation of orders based on market conditions.

### 3.4. Dynamic Size Adjustment

- **Algorithm Development:** Develop algorithms that adjust order sizes dynamically based on factors like price volatility, trading volume, and liquidity.
- **Risk Management:** Incorporate risk assessment mechanisms to prevent overexposure or significant losses.

### 3.5. Price Feed Integration

- **Coingecko API:** Integrate with Coingecko to fetch real-time and historical price data.
- **Data Processing:** Implement modules to process and analyze price data for informed decision-making.

### 3.6. Monitoring and Execution

- **Real-Time Monitoring:** Set up systems to monitor market conditions, order statuses, and agent performance in real-time.
- **Alerting System:** Implement alerts for specific events, such as significant price changes or order execution failures.
- **Logging:** Maintain comprehensive logs for auditing and debugging purposes.

### 3.7. Security Measures

- **API Key Management:** Securely manage and store API keys for Coingecko and CowSwap.
- **Smart Contract Security:** Review and audit smart contracts to prevent vulnerabilities.
- **Access Controls:** Implement strict access controls to restrict unauthorized actions.

## 4. Implementation Steps

### 4.1. Environment Setup

1. **Clone Repository:**

   ```bash
   git clone https://github.com/your-repo/scaffold-agent.git
   cd scaffold-agent
   ```

2. **Install Dependencies:**

   ```bash
   cd agent-server
   yarn install
   ```

3. **Set Up Environment Variables:**
   - Duplicate the `.env.example` file to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```
   - Ensure the `.gitignore` includes `.env` to prevent sensitive information from being committed.

### 4.2. Setting Up CowSwap SDK

1. **Install CowSwap SDK:**

   ```bash
   yarn add @cowprotocol/hook-dapp-lib
   ```

2. **Configure CowSwap SDK:**

   - Integrate CowSwap SDK within `agent-server/src/tools/` by creating new tools or extending existing ones.
   - Reference [CowSwap SDK Documentation](https://docs.cow.fi/cow-protocol/reference/sdks/cow-sdk) for detailed setup instructions.

3. **Fork and Clone CowSwap Safe App Example:**

   ```bash
   git clone https://github.com/cowprotocol/safe-app-example.git
   cd safe-app-example
   ```

4. **Run the Safe App Locally:**
   ```bash
   yarn install
   PORT=9999 yarn start
   ```
   - Add the custom DApp to your Safe Wallet as per the [CowSwap Safe App Tutorial](https://docs.cow.fi/cow-protocol/tutorials/swap-in-safe-app).

### 4.3. Developing Workflow Logic

1. **Define Workflows:**

   - Utilize `kernel-workflow/src/agent-workflow.ts` to define tasks related to limit order creation and management.
   - Implement task polling and execution mechanisms.

2. **Create Dedicated Tools:**

   - Develop new tools within `agent-server/src/tools/` for handling CowSwap-specific operations like creating limit orders, fetching order statuses, etc.
   - Example: Extend `swapper.ts` or create a new `dcaSwapper.ts` tool.

3. **Integrate with Existing Tools:**
   - Ensure seamless interaction between new CowSwap tools and existing tools like `sender.ts`, `bridger.ts`, etc.

### 4.4. Integrating Coingecko API

1. **Obtain Coingecko API Key:**

   - Register and obtain an API key from [Coingecko](https://www.coingecko.com/en/api).

2. **Create a Price Fetching Tool:**

   - Develop a new tool `priceFetcher.ts` within `agent-server/src/tools/` that interacts with the Coingecko API.

   ```typescript
   // File: scaffold-agent/agent-server/src/tools/priceFetcher.ts
   import { tool } from "@langchain/core/tools";
   import axios from "axios";
   import { z } from "zod";

   const priceFetcherSchema = z.object({
     tokenId: z.string(),
     vsCurrency: z.string().default("usd"),
   });

   const priceFetcherTool = tool(
     async ({
       tokenId,
       vsCurrency,
     }: {
       tokenId: string;
       vsCurrency?: string;
     }): Promise<string> => {
       try {
         const response = await axios.get(
           `https://api.coingecko.com/api/v3/simple/price`,
           {
             params: {
               ids: tokenId,
               vs_currencies: vsCurrency,
             },
           }
         );
         const price = response.data[tokenId][vsCurrency];
         return `The current price of ${tokenId} is ${price} ${vsCurrency}.`;
       } catch (error) {
         console.error(error);
         return "An error occurred while fetching the price.";
       }
     },
     {
       name: "priceFetcher",
       description:
         "Fetches the current price of a specified token from Coingecko.",
       schema: priceFetcherSchema,
     }
   );

   export default priceFetcherTool;
   ```

3. **Update Tools Index:**
   - Add the new `priceFetcherTool` to `agent-server/src/tools/index.ts`.
   ```typescript
   import priceFetcher from "./priceFetcher";
   export const tools = [
     adder,
     sender,
     bridger,
     swapper,
     bridgeStatus,
     priceFetcher,
   ];
   ```

### 4.5. Implementing Dynamic Adjustment Algorithms

1. **Develop Adjustment Logic:**

   - Create algorithms that adjust DCA order sizes based on fetched price, volume, and liquidity data.
   - Example: Implement a volatility-based scaling factor that increases order size during low volatility periods and decreases during high volatility.

2. **Integrate with Existing Tools:**

   - Utilize the `priceFetcherTool` to obtain necessary market data within the adjustment algorithms.
   - Implement the logic within `agent-server/src/controller/` or as part of the workflow in `kernel-workflow`.

3. **Risk Management:**
   - Define maximum and minimum order sizes to prevent overexposure.
   - Implement safeguards against sudden market swings.

### 4.6. Creating Limit Orders

1. **Define Limit Order Parameters:**

   - Token pairs (e.g., ETH/USDC)
   - Order amounts based on dynamic adjustment algorithms
   - Price thresholds for order execution
   - Expiration times for orders

2. **Implement Order Creation:**

   - Utilize CowSwap SDK within a dedicated tool (e.g., `limitOrderCreator.ts`) to create and manage limit orders.

   ```typescript
   // File: scaffold-agent/agent-server/src/tools/limitOrderCreator.ts
   import { tool } from "@langchain/core/tools";
   import { ConsoleKit } from "brahma-console-kit";
   import { z } from "zod";
   import { ConsoleKitConfig } from "../config";

   const limitOrderCreatorSchema = z.object({
     chainId: z.number(),
     account: z.string(),
     tokenIn: z.string(),
     tokenOut: z.string(),
     amountIn: z.string(),
     limitPrice: z.string(),
     expiration: z.string(),
   });

   const limitOrderCreatorTool = tool(
     async ({
       chainId,
       tokenIn,
       tokenOut,
       amountIn,
       limitPrice,
       expiration,
       account,
     }): Promise<string> => {
       const consoleKit = new ConsoleKit(
         ConsoleKitConfig.apiKey,
         ConsoleKitConfig.baseUrl
       );
       try {
         const order = await consoleKit.coreActions.createLimitOrder({
           chainId,
           account: account as `0x${string}`,
           tokenIn: tokenIn as `0x${string}`,
           tokenOut: tokenOut as `0x${string}`,
           amountIn,
           limitPrice,
           expiration,
         });
         return `Limit order created successfully: ${JSON.stringify(
           order,
           null,
           2
         )}`;
       } catch (error) {
         console.error(error);
         return "An error occurred while creating the limit order.";
       }
     },
     {
       name: "limitOrderCreator",
       description:
         "Creates a limit order on CowSwap with specified parameters.",
       schema: limitOrderCreatorSchema,
     }
   );

   export default limitOrderCreatorTool;
   ```

3. **Update Tools Index:**

   - Add `limitOrderCreatorTool` to `agent-server/src/tools/index.ts`.

   ```typescript
   import limitOrderCreator from "./limitOrderCreator";
   export const tools = [
     adder,
     sender,
     bridger,
     swapper,
     bridgeStatus,
     priceFetcher,
     limitOrderCreator,
   ];
   ```

4. **Integrate with Workflow:**
   - Modify `kernel-workflow/src/agent-workflow.ts` to include tasks for creating and managing limit orders based on the DCA strategy.

### 4.7. Testing and Deployment

1. **Unit Testing:**

   - Write unit tests for all new tools using existing testing frameworks (e.g., Jest).
   - Ensure each tool functions as expected in isolation.

2. **Integration Testing:**

   - Test the interaction between workflow components, CowSwap SDK, and Coingecko API.
   - Simulate various market conditions to validate dynamic adjustments and order executions.

3. **Deployment:**

   - Deploy the updated **Agent Server** and **Kernel Workflow** to a production environment.
   - Ensure environment variables and API keys are securely managed in the deployment setup.

4. **Monitoring:**
   - Set up monitoring tools to track agent performance, order statuses, and workflow executions.
   - Implement alerting mechanisms for critical events or failures.

## 5. Tools and Technologies

- **Programming Languages:** TypeScript, JavaScript
- **Frameworks and Libraries:**
  - [CowSwap SDK](https://docs.cow.fi/cow-protocol/reference/sdks/cow-sdk)
  - [ConsoleKit](https://github.com/Brahma-fi/console-kit)
  - [Coingecko API](https://www.coingecko.com/en/api)
  - [LangChain](https://langchain.com/)
  - [Ethers.js](https://ethers.io/)
  - [Express](https://expressjs.com/)
- **Development Tools:** Yarn, NPM, Git, VSCode
- **Testing Frameworks:** Jest, Mocha
- **Deployment Platforms:** AWS, Heroku, Vercel (Choose based on scalability and reliability)
- **Security Tools:** OpenZeppelin, Audit Tools

## 6. Timeline and Milestones

| Milestone                          | Description                                       | Estimated Time |
| ---------------------------------- | ------------------------------------------------- | -------------- |
| **1. Environment Setup**           | Set up development environment and dependencies.  | 1 week         |
| **2. SDK Integration**             | Integrate CowSwap SDK and configure settings.     | 1-2 weeks      |
| **3. Workflow Development**        | Develop and define automation workflows.          | 2 weeks        |
| **4. API Integration**             | Integrate Coingecko for price feeds.              | 1 week         |
| **5. Algorithm Implementation**    | Implement dynamic adjustment algorithms.          | 2-3 weeks      |
| **6. Order Execution Module**      | Develop modules for creating and managing orders. | 2 weeks        |
| **7. Testing Phase**               | Conduct unit and integration testing.             | 2 weeks        |
| **8. Deployment**                  | Deploy the agent to production.                   | 1 week         |
| **9. Monitoring and Optimization** | Monitor performance and optimize as needed.       | Ongoing        |

## 7. Potential Challenges and Solutions

| Challenge                          | Solution                                                  |
| ---------------------------------- | --------------------------------------------------------- |
| **API Rate Limits**                | Implement caching and rate-limiting strategies.           |
| **Market Volatility**              | Use robust algorithms to handle sudden changes.           |
| **Smart Contract Vulnerabilities** | Conduct thorough code audits and security reviews.        |
| **Workflow Failures**              | Implement retry mechanisms and error handling.            |
| **Data Inconsistency**             | Validate and sanitize all incoming data.                  |
| **Scalability Issues**             | Design the system to be modular and scalable.             |
| **Security Breaches**              | Employ multi-signature wallets and secure key management. |

## 8. References

- [CowSwap SDK Documentation](https://docs.cow.fi/cow-protocol/reference/sdks/cow-sdk)
- [CowSwap Safe App Tutorial](https://docs.cow.fi/cow-protocol/tutorials/swap-in-safe-app)
- [Hook DApp Tutorial](https://docs.cow.fi/cow-protocol/tutorials/hook-dapp)
- [Coingecko API Documentation](https://www.coingecko.com/en/api)
- [ConsoleKit Documentation](https://github.com/Brahma-fi/console-kit)
- [Scaffold Agent Repository](https://github.com/your-repo/scaffold-agent)
- [LangChain Documentation](https://langchain.com/docs/)
- [Ethers.js Documentation](https://docs.ethers.io/)

---

By following this structured plan, you can develop an **Intelligent DCA Agent** that leverages **CowSwap**'s robust infrastructure, **ConsoleKit**'s automation capabilities, and real-time market data from **Coingecko** to execute automated, dynamic DeFi strategies effectively and securely.
