import {
  Address,
  ConsoleExecutorConfig,
  ConsoleKit,
  KernelExecutorConfig,
} from "brahma-console-kit";
import { ethers, Wallet } from "ethers";
import { ExecutorMetadata } from "./entity";
import { deployNewSafe } from "./deploy-safe";
import Safe, { SigningMethod } from "@safe-global/protocol-kit";

const ExecutorEoaPK = process.env.EXECUTOR_EOA_PRIVATE_KEY!;
const JsonRpcUrl = process.env.JSON_RPC_URL!;
const ConsoleApiKey = process.env.CONSOLE_API_KEY!;
const ConsoleBaseUrl = process.env.CONSOLE_BASE_URL!;
const ExecutorClientID = process.env.EXECUTOR_CLIENT_ID!;

/// configure according to required executor config for console registration
// const ExecutorConfigConsole: ConsoleExecutorConfig = {
//   clientId: ExecutorClientID,
//   executor: ethers.computeAddress(ExecutorEoaPK),
//   feeReceiver: ethers.ZeroAddress as Address,
//   hopAddresses: ["0xAE75B29ADe678372D77A8B41225654138a7E6ff1"], // addresses that tokens will be moved through during execution
//   inputTokens: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"], // base usdc
//   limitPerExecution: true,
//   timestamp: new Date().getTime(),
// };

/// configure according to required executor metadata
const ExecutorMetadata: ExecutorMetadata = {
  name: "scaffold-agent-executor",
  logo: "",
  metadata: {},
};

/// configure according to required executor config for kernel registration
const ExecutorConfigKernel: KernelExecutorConfig = {
  defaultEvery: "120s",
  executionTTL: "120s",
  type: "INTERVAL",
};

const registerExecutor = async (
  _consoleKit: ConsoleKit,
  _chainId: number,
  _executorConfig: ConsoleExecutorConfig,
  _executorMetadata: ExecutorMetadata,
  protocolKit: Safe
) => {
  // 2. Generate message for signing
  const { domain, message, types } =
    await _consoleKit.automationContext.generateConsoleExecutorRegistration712Message(
      _chainId,
      _executorConfig
    );
  // 3. Create Safe message
  const safeMessage = await protocolKit.createMessage({
    types,
    domain,
    message,
  });

  // 4. Sign with Safe (this will handle the signing process correctly)
  const safeMessageWithSignature = await protocolKit.signMessage(
    safeMessage,
    SigningMethod.ETH_SIGN_TYPED_DATA_V4
  );

  // 5. Get the encoded signatures from Safe
  const encodedSignatures = safeMessageWithSignature.encodedSignatures();

  try {
    const executorData =
      await _consoleKit.automationContext.registerExecutorOnConsole(
        encodedSignatures,
        _chainId,
        _executorConfig,
        _executorMetadata.name,
        _executorMetadata.logo,
        _executorMetadata.metadata
      );

    if (!executorData) throw new Error("register executor on console fail");

    console.log("[executor-reg]", { executorData });
    return { executorData, protocolKit };
  } catch (e) {
    console.log(e);
    throw new Error("register executor on console fail");
  }
};

const registerExecutorOnKernel = async (
  _consoleKit: ConsoleKit,
  _chainId: number,
  _registryId: string,
  _executorConfig: KernelExecutorConfig,
  protocolKit: Safe
) => {
  // Generate message for signing
  const { domain, message, types } =
    await _consoleKit.automationContext.generateKernelExecutorRegistration712Message(
      _chainId,
      _registryId,
      _executorConfig
    );

  // Create and sign message with Safe
  const safeMessage = await protocolKit.createMessage({
    types,
    domain,
    message,
  });

  const safeMessageWithSignature = await protocolKit.signMessage(
    safeMessage,
    SigningMethod.ETH_SIGN_TYPED_DATA_V4
  );

  // Get encoded signatures
  const encodedSignatures = safeMessageWithSignature.encodedSignatures();
  console.log("[executor-kernel-sig]", encodedSignatures);

  try {
    await _consoleKit.automationContext.registerExecutorOnKernel(
      _registryId,
      encodedSignatures,
      _executorConfig
    );
  } catch (e) {
    console.log(e);
    throw new Error("register executor on kernel fail");
  }

  return await _consoleKit.automationContext.fetchExecutorDetails(_registryId);
};

(async () => {
  const consoleKit = new ConsoleKit(ConsoleApiKey, ConsoleBaseUrl);

  const provider = new ethers.JsonRpcProvider(JsonRpcUrl);
  // 1. First deploy Safe
  const { safeAddress, protocolKit } = await deployNewSafe();
  console.log("[safe-provider]", safeAddress);

  // 2. Create configs with Safe address
  const ExecutorConfigConsoleNew: ConsoleExecutorConfig = {
    clientId: ExecutorClientID,
    executor: safeAddress, // Use Safe address here
    feeReceiver: ethers.ZeroAddress as Address,
    hopAddresses: ["0xAE75B29ADe678372D77A8B41225654138a7E6ff1"],
    inputTokens: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
    limitPerExecution: true,
    timestamp: new Date().getTime(),
  };
  const ExecutorConfigKernel: KernelExecutorConfig = {
    defaultEvery: "120s",
    executionTTL: "120s",
    type: "INTERVAL",
  };

  const { chainId: chainIdBig } = await provider.getNetwork();
  const chainId = parseInt(chainIdBig.toString(), 10);
  const {
    executorData: { id: registryId },
  } = await registerExecutor(
    consoleKit,
    chainId,
    ExecutorConfigConsoleNew,
    ExecutorMetadata,
    protocolKit
  );

  const registeredExecutorData = await registerExecutorOnKernel(
    consoleKit,
    chainId,
    registryId,
    ExecutorConfigKernel,
    protocolKit
  );
  console.log("[complete]", { registeredExecutorData });
})();
