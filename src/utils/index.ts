import { BigNumber, ethers } from 'ethers';

function toBigNum(value: number, d: number) {
  return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

function fromBigNum(value:number, d:number) {
  return parseFloat(ethers.utils.formatUnits(value, d));
}
export { toBigNum, fromBigNum };