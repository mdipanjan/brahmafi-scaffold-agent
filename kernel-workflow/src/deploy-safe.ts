import Safe from "@safe-global/protocol-kit";
import { base } from "viem/chains";
import { createPublicClient, http } from "viem";

export const deployNewSafe = async () => {
  const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
  const protocolKit = await Safe.init({
    provider:
      "https://base-mainnet.g.alchemy.com/v2/W-MJECgYsx2IDJXrp74AkWTLluSTPYhH",
    signer: process.env.AGENT_PRIVATE_KEY,
    predictedSafe: {
      safeAccountConfig: {
        owners: [process.env.AGENT_ADDRESS as string],
        threshold: 1,
      },
      safeDeploymentConfig: {
        saltNonce,
      },
    },
  });

  const safeAddress = await protocolKit.getAddress();

  const deploymentTransaction =
    await protocolKit.createSafeDeploymentTransaction();

  const safeClient = await protocolKit.getSafeProvider().getExternalSigner();

  const transactionHash = await safeClient?.sendTransaction({
    to: deploymentTransaction.to,
    value: BigInt(deploymentTransaction.value),
    data: deploymentTransaction.data as `0x${string}`,
    chain: base as any,
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });
  await publicClient?.waitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  await publicClient?.waitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  });

  console.log(
    `A new Safe multisig was successfully deployed on base mainnet. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`
  );

  return {
    protocolKit,
    safeAddress,
  };
};
