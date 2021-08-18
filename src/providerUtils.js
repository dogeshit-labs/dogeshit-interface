//import { gasAmount, gasPrice } from './constants.js';

export const MetaMaskSend = async (to, from, txData, gas, gasPrice) => {
  const params = {
    gasPrice: gasPrice,
    gas: gas,
    to: to,
    from: from,
    data: txData
  }
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [params]
    });
    return txHash;
  } catch(error) {
    console.error(error)
    return false;
  }
}
