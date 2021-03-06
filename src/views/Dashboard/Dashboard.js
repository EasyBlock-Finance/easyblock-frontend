import {useEffect} from 'react'
// Chakra imports
import {
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    Image, Input, InputGroup,
    Portal,
    SimpleGrid,
    Spacer,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    useColorMode,
    useColorModeValue,
    Spinner
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import IconBox from "components/Icons/IconBox";
// Custom icons
import {
    WalletIcon,
} from "components/Icons/Icons.js";
import React, {useState} from "react";
// React Icons
import {BsArrowRight} from "react-icons/bs";
import {FiDollarSign} from "react-icons/fi";
import {BiNetworkChart} from "react-icons/bi";
import {AiOutlineBlock} from "react-icons/all";
import {BsFillPeopleFill} from "react-icons/all";
import {AiOutlineLineChart} from "react-icons/all";
import {GiProfit} from "react-icons/all";
import {AiFillPieChart} from "react-icons/all";
import {GrMoney} from "react-icons/all";
import {GiReceiveMoney} from "react-icons/all";
import {BsChevronDown} from "react-icons/bs";
// Navbar
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
// Web3
import {ethers} from 'ethers';
import {
    CONTRACT_ADDRESS,
    EASYBLOCK_ABI,
    PURCHASE_TOKEN_ABI,
    NFT_ADDRESS,
    NFT_ABI,
    REWARD_ADDRESS,
    REWARD_ABI
} from "../../contracts/EasyBlock";
// Toast
import toast, {Toaster, useToasterStore} from 'react-hot-toast';
// Analytics
import {initializeFirebase} from "../../util/firebase";
import ExplanationBox from "../../components/Dashboard/ExplanationBox";
import StatBox from "../../components/Dashboard/StatBox";
import UserWalletRewards from "../../components/Dashboard/UserWalletRewards";
import SellShareBox from "../../components/Dashboard/SellShareBox";
// Cookie
import CookieConsent from "react-cookie-consent";
import ReferalBox from "../../components/Dashboard/ReferalBox";
import NftBox from "../../components/Dashboard/NftBox";

initializeFirebase();


let provider;
let metamaskInstalled = false;
if (window.ethereum != null) {
    metamaskInstalled = true;
    console.log("Metamask installed.");
    window.ethereum.enable();
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
} else {
    console.log("Metamask not installed.");
    provider = new ethers.providers.getDefaultProvider("https://rpc.ftm.tools");
}

const easyBlockContract = new ethers.Contract(CONTRACT_ADDRESS, EASYBLOCK_ABI, provider);
const usdcContract = new ethers.Contract("0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", PURCHASE_TOKEN_ABI, provider);
const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider)
const rewardContract = new ethers.Contract(REWARD_ADDRESS, REWARD_ABI, provider);

let signer = null;
let easyBlockWithSigner = null;
let nftContractWithSigner = null;
let rewardContractWithSigner = null;

let depositTokenContract = null;
let depositTokenContractWithSigner = null;

export default function Dashboard() {
    let pastDistribution = new Date();
    let nextDistribution = new Date("05/31/2022");

    let Difference_In_Time = nextDistribution.getTime() - pastDistribution.getTime();
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    // WEB3 START
    const connectWalletHandler = async () => {
        if (!metamaskInstalled) {
            alert("Please install Metamask to use EasyBlock.");
            return;
        }
        try {
            await window.ethereum.enable();
            let chainId = await provider.getNetwork();
            chainId = chainId['chainId'];

            if (chainId !== 250) {
                if (window.confirm("Please switch to Fantom Network to use EasyBlock.")) {
                    await changeNetworkToFTM();
                }
            } else {
                await connectAndGetUserData();
            }
        } catch (e) {
            console.log(e);
        }
    };

    // WEB3 END
    // Chakra Color Mode
    const {colorMode, toggleColorMode} = useColorMode();
    const textColor = useColorModeValue("gray.700", "white");

    // General stats
    const [totalInvestments, setTotalInvestments] = useState(0);
    const [totalRewardsPaid, setTotalRewardsPaid] = useState(0);
    const [totalShareCount, setTotalShareCount] = useState(60);
    const [strongPrice, setStrongPrice] = useState(0);
    const [nodesOwned, setNodesOwned] = useState(0);
    const [purchaseTokenContract, setPurchaseTokenContract] = useState("");
    const [sharePrice, setSharePrice] = useState(0);
    const [currentWalletBalance, setCurrentWalletBalance] = useState(0);
    const [notClaimedRewards, setNotClaimedRewards] = useState(0);
    const [premiumCollected, setPremiumCollected] = useState(0);
    const [maxSharesToBeSold, setMaxSharesToBeSold] = useState(0);
    const [sellPrice, setSellPrice] = useState(0);
    // Different wallets start
    const [wallet1Rewards, setWallet1Rewards] = useState(0);
    const [wallet1Strong, setWallet1Strong] = useState(0);

    const [wallet2Rewards, setWallet2Rewards] = useState(0);
    const [wallet2Strong, setWallet2Strong] = useState(0);

    const [wallet3Rewards, setWallet3Rewards] = useState(0);
    const [wallet3Strong, setWallet3Strong] = useState(0);

    const [wallet4Strong, setWallet4Strong] = useState(0);

    // Different wallets end
    const [shareHolderCount, setShareHolderCount] = useState(0);
    const [newInvestments, setNewInvestments] = useState(0);

    // User stats
    const [userWallet, setUserWallet] = useState("");
    const [userShares, setUserShares] = useState(0);
    const [userPendingRewards, setUserPendingRewards] = useState(0);
    const [totalUserRewards, setTotalUserRewards] = useState(0);
    const [purchaseAllowance, setPurchaseAllowance] = useState(0);

    const [sharesToBeBought, setSharesToBeBought] = useState(100);

    const inputBg = useColorModeValue("white", "gray.800");

    const overlayRef = React.useRef();

    // UI CONTROLLERS
    const [generalDataLoading, setGeneralDataLoading] = useState(true);
    const [userDataLoading, setUserDataLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [buyError, setBuyError] = useState(false);
    const [priceLoading, setPriceLoading] = useState(true);
    const [rewardDistributing, setRewardDistributing] = useState(false);

    const [showWalletDetails, setShowWalletDetails] = useState(false);

    const {toasts} = useToasterStore();
    const TOAST_LIMIT = 1;

    // Referral
    const [totalReferralRewardsDistributed, setTotalReferralRewardsDistributed] = useState(0);
    const [userReferralPurchaseCount, setUserReferralPurchaseCount] = useState(0);
    const [userReferralRewards, setUserReferralRewards] = useState(0);
    const [referer, setReferer] = useState("0x0000000000000000000000000000000000000000");
    // Auto-compounding
    const [isAutoCompound, setIsAutoCompound] = useState(false);
    const [isToggleAutoCompounding, setIsToggleAutoCompounding] = useState(false);
    // NFT
    const [userNftCount, setUserNftCount] = useState(0);
    const [claimableReward, setClaimableReward] = useState(0);
    const [maxSupply, setMaxSupply] = useState(5000);
    const [minted, setMinted] = useState(0);
    const [userNFTs, setUserNFTs] = useState([]);

    useEffect(() => {
        let fullUrl = window.location.href;
        let splitUrl = fullUrl.split('?');
        if (splitUrl.length > 1) {
            let params = splitUrl[1];
            if (params.indexOf("r=") != -1) {
                let referer = params.slice(2, 44);
                setReferer(referer);
            }
        }
    }, []);

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.remove(t.id)); // Dismiss ??? Use toast.remove(t.id) for no exit animation
    }, [toasts]);

    // Web3 methods
    async function changeNetworkToFTM() {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: `0x${Number(250).toString(16)}`,
                    chainName: "Fantom",
                    nativeCurrency: {
                        name: "Fantom",
                        symbol: "FTM",
                        decimals: 18
                    },
                    rpcUrls: ["https://rpc.ftm.tools/"],
                    blockExplorerUrls: ["https://ftmscan.com/"]
                }]
            });
        } catch (e) {
            alert(e.message);
        }
    }


    async function getNeededAmountData() {
        // Current wallet's balance for till next node
        fetch('https://openapi.debank.com/v1/user/total_balance?id=0xc73D10A7A1dBD3dea1AAA5a32Bf03D72DFCBFDBe').then(response => response.json()).then(data => {
            try {
                setCurrentWalletBalance(data['total_usd_value']);
            } catch (e) {
            }

        });
        setWallet1Strong(66.5419 + (Date.now() - 1658273203000) / 1000 / 60 / 60 / 24 * 0.075 * 100);
        setWallet2Strong(107.1869 + (Date.now() - 1658273203000) / 1000 / 60 / 60 / 24 * 0.075 * 100);
        setWallet3Strong(101.9777 + (Date.now() - 1658273203000) / 1000 / 60 / 60 / 24 * 0.075 * 100);
        setWallet4Strong(44.7447 + (Date.now() - 1658273203000) / 1000 / 60 / 60 / 24 * 0.075 * 35);
        setPriceLoading(false);
        /*
        // Wallet 1
        fetch('https://openapi.debank.com/v1/user/protocol?id=0xde6f949cec8ba92a8d963e9a0065c03753802d14&protocol_id=strongblock').then(response => response.json()).then(data => {
                try {
                    // Specific wallets
                    setWallet1Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                    setWallet1Strong(data['portfolio_item_list'][0]['detail']['supply_token_list'][0]['amount']);
                } catch (e) {
                    console.log(e);
                }
            }
        );
        // Wallet 2
        fetch('https://openapi.debank.com/v1/user/protocol?id=0xeB1b78C06510566a9E50e760B9F5aFE788ca5E6B&protocol_id=strongblock').then(response => response.json()).then(data => {
                try {
                    // Specific wallets
                    setWallet2Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                    setWallet2Strong(data['portfolio_item_list'][0]['detail']['supply_token_list'][0]['amount']);
                } catch (e) {
                }
            }
        );
        // Wallet 3
        fetch('https://openapi.debank.com/v1/user/protocol?id=0xc73D10A7A1dBD3dea1AAA5a32Bf03D72DFCBFDBe&protocol_id=strongblock').then(response => response.json()).then(data => {
                try {
                    // Specific wallets
                    setWallet3Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                    setWallet3Strong(data['portfolio_item_list'][0]['detail']['supply_token_list'][0]['amount']);

                    setPriceLoading(false);
                } catch (e) {
                }
            }
        );
        // Wallet 4
        fetch('https://openapi.debank.com/v1/user/protocol?id=0xeb5e4368B3a804b86270f26D01f3E8208bE32560&protocol_id=strongblock').then(response => response.json()).then(data => {
                try {
                    // Specific wallets
                    setWallet4Strong(data['portfolio_item_list'][0]['detail']['supply_token_list'][0]['amount']);

                    setPriceLoading(false);
                } catch (e) {
                }
            }
        );*/
    }

    async function connectAndGetUserData() {
        try {
            // Info about signer
            signer = provider.getSigner();
            let shouldProceed = false;
            try {
                await signer.getAddress();
                shouldProceed = true;
            } catch (e) {
                setUserDataLoading(false);
            }
            if (signer != null && shouldProceed) {
                let walletAddress = await signer.getAddress();
                setUserWallet(walletAddress);
                easyBlockWithSigner = easyBlockContract.connect(signer);
                nftContractWithSigner = nftContract.connect(signer);
                rewardContractWithSigner = rewardContract.connect(signer);

                let userShares = parseInt(await easyBlockContract.shareCount(walletAddress), 10);

                setUserShares(userShares / 100);
                setIsConnected(true);

                // Deposit token contracts
                depositTokenContractWithSigner = depositTokenContract.connect(signer);
                let allowance = parseInt(await depositTokenContract.allowance(walletAddress, CONTRACT_ADDRESS), 10);
                setPurchaseAllowance(allowance);
                setUserDataLoading(false);

                // Referral
                setUserReferralPurchaseCount(parseInt(await easyBlockContract.referSaleCount(walletAddress), 10));
                setUserReferralRewards(parseInt(await easyBlockContract.referFeeEarned(walletAddress), 10) / (10 ** 6));

                // Autocompound
                let isUserAutoCompound = await easyBlockContract.isAutoCompounding(walletAddress);
                setIsAutoCompound(isUserAutoCompound);

                // NFT
                let balance = parseInt(await nftContract.balanceOf(walletAddress), 10);
                setUserNftCount(balance);
                let userNfts = [];
                for (let i = 0; i < balance; i++) {
                    userNfts.push(parseInt(await nftContract.tokenOfOwnerByIndex(walletAddress, i), 10));
                }
                console.log("User NFTs");
                console.log(userNfts);
                setUserNFTs(userNfts);
                setClaimableReward(parseInt(await rewardContractWithSigner.getAllRewards(), 10));


            } else {
                setIsConnected(false);
                setUserDataLoading(false);
            }
        } catch (e) {
            setIsConnected(false);
            console.log("Get user data error: ");
            console.log(e);
            await connectAndGetUserData();
        }
    }

    async function getSmartContractData() {
        // Data from contract
        try {
            let totalInvestment = parseInt(await easyBlockContract.totalInvestment(), 10);
            let totalRewards = parseInt(await easyBlockContract.totalRewardsDistributed(), 10);
            let totalShares = parseInt(await easyBlockContract.totalShareCount(), 10);
            let purchaseTokenAddress = await easyBlockContract.purchaseToken();
            let sharePrice = parseInt(await easyBlockContract.getSharePrice(), 10);
            let totalNodesOwned = parseInt(await easyBlockContract.nodeCount(), 10);
            let investment = parseInt(await easyBlockContract.newInvestments(), 10);
            let sharePurchaseEnabled = await easyBlockContract.sharePurchaseEnabled();
            let holderCount = parseInt(await easyBlockContract.holderCount(), 10);
            let premiumCollected = parseInt(await easyBlockContract.premiumCollected(), 10);
            let maxSharesToSold = parseInt(await easyBlockContract.getMaxAmountOfSharesToBeSold(), 10);
            let sellPrice = parseInt(await easyBlockContract.getSellPrice(), 10);
            let totalReferralRewards = parseInt(await easyBlockContract.totalReferralRewardDistributed(), 10);

            setTotalInvestments(totalInvestment);
            setTotalRewardsPaid(totalRewards / 1000000); // USDC has 6 decimals
            setTotalShareCount(totalShares / 100); // Shares have 2 decimals
            setPurchaseTokenContract(purchaseTokenAddress);
            setSharePrice(sharePrice / 1000000); // USDC has 6 decimals
            setNodesOwned(totalNodesOwned);
            setNewInvestments(investment / 1000000); // USDC has 6 decimals
            setPremiumCollected(premiumCollected / 1000000); // USDC has 6 decimals
            setRewardDistributing(!sharePurchaseEnabled);
            setShareHolderCount(holderCount);
            setMaxSharesToBeSold(Math.floor(maxSharesToSold / 100)); // Shares have 2 decimals
            setSellPrice(sellPrice / 1000000 * 100); // USDC has 6 decimals and shares have 2 decimals
            setTotalReferralRewardsDistributed(totalReferralRewards / 1000000); // USDC has 6 decimals


            // Deposit token contracts
            depositTokenContract = new ethers.Contract(purchaseTokenAddress, PURCHASE_TOKEN_ABI, provider);

            // NFT
            setMaxSupply(parseInt(await nftContract.maxSupply(), 10));
            setMinted(parseInt(await nftContract.numTokensMinted(), 10));

            // UI Change
            setGeneralDataLoading(false);
            console.log("Smart contract data here")

            await connectAndGetUserData()
        } catch (e) {
            console.log("General methods error: ");
            console.log(e);
            let chainId = await provider.getNetwork();
            chainId = chainId['chainId'];
            if (chainId !== 250) {
                if (window.confirm("Please switch to Fantom Network to use EasyBlock.")) {
                    await changeNetworkToFTM();
                }
            } else {
                getSmartContractData();
            }
        }
    }

    useEffect(async () => {
        if (colorMode === "light") {
            toggleColorMode();
        }
        try {
            // Strong price from coin gecko
            fetch('https://api.dexscreener.io/latest/dex/pairs/ethereum/0x453a43e2bf3080f7a23c9bb034ccdd869e306102').then(response => response.json()).then(data => {
                    let price = data.pair.priceUsd;
                    setStrongPrice(price);
                }
            );
        } catch (e) {
            console.log(e);
        }
        try {
            await getNeededAmountData();
        } catch (e) {
            console.log(e);
        }

        await getSmartContractData();
    }, [signer]);

    // CONTRACT INTERACTION FUNCTIONS
    async function claimRewards() {
        if (signer != null) {
            setIsClaiming(true);
            await easyBlockWithSigner.claimRewards();
        } else {
            await connectWalletHandler();
        }
    }

    async function buyShares(count) {
        let approvalAmount = 10000000000;
        if (count * 10 * 1000000 > approvalAmount) {
            approvalAmount = count * 10 * 1000000;
        }
        setBuyError(false);
        try {
            if (signer != null) {
                setIsBuying(true);
                if (purchaseAllowance >= count * 10 * 1000000) {
                    await easyBlockWithSigner.buyShares(count, referer);
                } else {
                    await depositTokenContractWithSigner.approve(CONTRACT_ADDRESS, approvalAmount);
                }
            } else {
                await connectWalletHandler();
            }
        } catch (e) {
            console.log(e);
            toast.error("Transaction error occured. Please be sure you have enough USDC in your account.", {duration: 5000,});
            setIsBuying(false);
            setBuyError(true);
        }
    }

    async function sellShares(count) {
        try {
            if (signer != null) {
                await easyBlockWithSigner.sellBackShares(count);
            }
        } catch (e) {
            console.log(e);
            toast.error("An error has occured please check the transaction, refresh, and try again.", {duration: 5000,});
        }
    }

    // NFT interactions
    async function mintNFT(count) {
        try {
            if (signer != null) {
                setIsMinting(true);
                const options = {value: ethers.utils.parseEther((20 * count).toString())}
                await nftContractWithSigner.mintForSelf(count, options);
            } else {
                await connectWalletHandler();
            }
        } catch (e) {
            console.log(e);
            toast.error("An error occurred. Can't mint NFT.", {duration: 5000,});
            setIsMinting(false);
        }
    }

    async function mintNFTFtm(count) {
        try {
            if (signer != null) {
                setIsMinting(true);
                const options = {value: ethers.utils.parseEther((100 * count).toString())}
                await nftContractWithSigner.mintForSelfFtm(count, options);
            } else {
                await connectWalletHandler();
            }
        } catch (e) {
            console.log(e);
            toast.error("An error occurred. Can't mint NFT.", {duration: 5000,});
            setIsMinting(false);
        }
    }

    async function claimRewards() {
        try {
            if (signer != null) {
                setIsClaiming(true);
                await rewardContractWithSigner.claimAll();
            } else {
                await connectWalletHandler();
            }
        } catch (e) {
            console.log(e);
            toast.error("An error occurred. Can't claim reward.", {duration: 5000,});
            setIsClaiming(false);
        }
    }

    // CONTRACT EVENT LISTENERS
    easyBlockContract.on("Investment", async (shareCount, price, address, event) => {
            if (event.event === "Investment" && address === await signer.getAddress()) {
                setGeneralDataLoading(true);
                setUserDataLoading(true);
                // await getSmartContractData();
                window.location.reload();
                setIsBuying(false);
                setSharesToBeBought(0);
                toast.success("Shares bought successfully. Your balance will be updated soon.", {duration: 5000,});
            }
        }
    );

    usdcContract.on("Approval", async (target, spender, value, event) => {
        if (event.event === "Approval" && signer != null && target === await signer.getAddress() && spender === CONTRACT_ADDRESS) {
            await updateAllowance();
            setIsBuying(false);
            toast.success("Approval successful. You can buy your shares now!", {duration: 5000,});
        }
    });

    nftContract.on("Transfer", async (from, to, tokenId, event) => {
        console.log("Inside event.");
        console.log(event);
        if (event.event === "Transfer" && to === await signer.getAddress()) {
            console.log("Should act.")
            await getSmartContractData();
            await connectAndGetUserData();
            setIsMinting(false);
            toast.success("NFT minted successfuly.", {duration: 5000,});
        }
    })

    rewardContract.on("Claim", async (address, amount, token, event) => {
        console.log("Inside event.");
        console.log(event);
        if (event.event === "Claim" && address === await signer.getAddress()) {
            console.log("Should act.")
            await getSmartContractData();
            await connectAndGetUserData();
            setIsClaiming(false);
            toast.success("Reward Claimed.", {duration: 5000,});
        }
    });

    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });

    // Allowance
    async function updateAllowance() {
        try {
            let allowance = await depositTokenContractWithSigner.allowance(await signer.getAddress(), CONTRACT_ADDRESS);
            setPurchaseAllowance(allowance);
        } catch (e) {
            await updateAllowance()
        }
    }

    // Reward calculations
    function calculateCurrentRewardSingle(reward) {
        reward *= strongPrice;
        reward -= 901; // average full wallet gas cost to claim
        reward += premiumCollected; // the premium from new share sales (dilution prevention amount + 5%)
        return (reward) / totalShareCount * userShares * 0.9;
    }

    function calculateEstimatedRewardsSingle(reward) {
        reward *= strongPrice;
        reward = reward / (20 - Difference_In_Days) * 20;
        reward -= 901; // average full wallet gas cost to claim
        reward += premiumCollected; // the premium from new share sales (dilution prevention amount + 5%)
        return (reward) / totalShareCount * userShares * 0.9;
    }

    return (
        <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 32}}>
            <Toaster/>
            <Portal>
                <AdminNavbar
                    signer={signer}
                    connectWalletHandler={() => connectWalletHandler()}
                    setSigner={(newSigner) => {
                        signer = newSigner;
                    }}
                    logoText={"EasyBlock Strong"}
                    isConnected={isConnected}
                />
            </Portal>
            <Flex flexDirection="column" pt={{base: "60px", md: "75px"}} maxWidth={"1400px"} paddingLeft={0}
                  paddingRight={0}>
                <ExplanationBox strongPrice={strongPrice} sharePrice={sharePrice}/>
                <StatBox strongPrice={strongPrice} generalDataLoading={generalDataLoading} wallet1Strong={wallet1Strong}
                         wallet1Rewards={wallet1Rewards}
                         wallet2Strong={wallet2Strong} wallet2Rewards={wallet2Rewards} wallet3Strong={wallet3Strong}
                         wallet3Rewards={wallet3Rewards} nodesOwned={nodesOwned} totalInvestments={totalInvestments}
                         newInvestments={newInvestments} shareHolderCount={shareHolderCount}
                         totalShareCount={totalShareCount} priceLoading={priceLoading}
                         currentWalletBalance={currentWalletBalance}
                         wallet4Strong={wallet4Strong}
                         totalRewardsPaid={totalRewardsPaid}/>
                {isConnected ?
                    <NftBox
                        shareCount={userShares}
                        mintNFT={async (count) => await mintNFT(count)}
                        mintNFTFtm={async (count) => await mintNFTFtm(count)}
                        isMinting={isMinting}
                        userNftCount={userNftCount}
                        claimableReward={claimableReward}
                        isClaiming={isClaiming}
                        claimRewards={async () => await claimRewards()}
                        NFT_ADDRESS={NFT_ADDRESS}
                        maxSupply={maxSupply}
                        minted={minted}
                        userNFTs={userNFTs}
                        nftContract={nftContract}/> : null}
                <Grid
                    templateColumns={{md: "1fr", lg: "1.2fr 1.8fr"}}
                    templateRows={{md: "1fr auto", lg: "1fr"}}
                    my="26px"
                    gap="24px"
                >
                    <Card maxHeight="640px" p="1rem">
                        <CardBody
                            p="0px"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                            w="100%"
                            h={{sm: "600px", lg: "400px"}}
                            bgSize="cover"
                            position="relative"
                            borderRadius="15px"
                        >
                            <Box
                                bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
                                w="100%"
                                position="absolute"
                                h="inherit"
                                borderRadius="inherit"
                                ref={overlayRef}
                            ></Box>
                            <Portal containerRef={overlayRef}>
                                <Flex
                                    flexDirection="column"
                                    color="white"
                                    p="1.5rem 1.2rem 0.3rem 1.2rem"
                                    lineHeight="1.6"
                                >
                                    <Text fontSize="24" fontWeight="bold" pb=".3rem" marginBottom={1}>
                                        Buy EasyBlock Shares
                                    </Text>
                                    <Text fontSize="16" pb=".3rem" marginBottom={4}>
                                        You can also buy shares in NFT form. <a
                                        href={'https://paintswap.finance/marketplace/collections/' + NFT_ADDRESS}
                                        target={"_blank"}
                                        style={{fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer'}}>Browse
                                        all EasyBlock NFTs.</a>
                                    </Text>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        marginBottom: 32,
                                        flexDirection: window.innerWidth >= 960 ? "row" : "column"
                                    }}>
                                        <Text fontSize="24" fontWeight="bold" marginRight={8}>
                                            Share Count:
                                        </Text>
                                        <InputGroup
                                            bg={inputBg}
                                            borderRadius="15px"
                                            w="100px"
                                        >
                                            <Input
                                                fontSize="16"
                                                py="11px"
                                                placeholder="1"
                                                borderRadius="inherit"
                                                value={sharesToBeBought}
                                                onChange={(e) => {
                                                    setSharesToBeBought(e.target.value);
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                                        setSharesToBeBought(1);
                                                    }
                                                }}
                                                textAlign={"center"}
                                            />
                                        </InputGroup>
                                        {window.innerWidth >= 960 ?
                                            <>
                                                <Text style={{
                                                    fontSize: 24,
                                                    marginLeft: 32
                                                }}><span
                                                    style={{fontWeight: 'bold'}}>Total:</span> {generalDataLoading ?
                                                    <Spinner/> : (isNaN(parseInt(sharesToBeBought)) || parseInt(sharesToBeBought) < 1) ? (sharePrice * 100).toFixed(2) : (sharePrice * sharesToBeBought * 100).toFixed(2)}
                                                </Text>
                                                <Image
                                                    src={'/coins/UsdcLogo.png'}
                                                    alt="chakra image"
                                                    width={8}
                                                    style={{marginLeft: 8}}
                                                />
                                            </> :
                                            <div style={{display: 'flex', flexDirection: "row", alignItems: 'center'}}>
                                                <Text style={{
                                                    fontSize: 24,
                                                }}><span
                                                    style={{fontWeight: 'bold'}}>Total:</span>
                                                    {generalDataLoading ?
                                                        <Spinner/> : (isNaN(parseInt(sharesToBeBought)) || parseInt(sharesToBeBought * 100) < 1) ? sharePrice : (sharePrice * sharesToBeBought * 100).toFixed(2)}
                                                </Text>
                                                <Image
                                                    src={'/coins/UsdcLogo.png'}
                                                    alt="chakra image"
                                                    width={7}
                                                    height={7}
                                                    style={{marginLeft: 8}}
                                                />
                                            </div>}
                                    </div>
                                    {buyError ?
                                        <Text fontSize="16" fontWeight="bold" pb=".3rem" marginBottom={4}
                                              color={"red.400"}>
                                            Transaction error occured. Please be sure you have enough USDC or FTM (to
                                            cover gas fees) in your
                                            account.
                                        </Text> : null}
                                    {userDataLoading ? null : purchaseAllowance >= (sharesToBeBought * 10000000) ?
                                        <Flex align="center">
                                            <Button
                                                p="0px"
                                                variant="no-hover"
                                                bg="transparent"
                                                my={{sm: "0px", lg: "0px"}}
                                                onClick={() => window.open("https://swap.spiritswap.finance/#/exchange/swap/FTM/USDC", '_blank')}
                                            >
                                                <Text
                                                    fontSize="lg"
                                                    color={textColor}
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    transition="all .5s ease"
                                                    my={{sm: "1.5rem", lg: "0px"}}
                                                    _hover={{me: "4px"}}
                                                >
                                                    Get USDC on SpiritSwap
                                                </Text>
                                                <Icon
                                                    as={BsArrowRight}
                                                    w="20px"
                                                    h="20px"
                                                    fontSize="2xl"
                                                    transition="all .5s ease"
                                                    mx=".3rem"
                                                    cursor="pointer"
                                                    pt="4px"
                                                    _hover={{transform: "translateX(20%)"}}
                                                />
                                            </Button>
                                        </Flex>
                                        :
                                        window.innerWidth > 960 ?
                                            <Text fontSize={"md"} marginBottom={"4"}>You only need to Approve the first
                                                time you are using the protocol.</Text> : null}
                                    {rewardDistributing ?
                                        <Text fontSize="16" fontWeight="bold" pb=".3rem" marginBottom={4}
                                              color={"red.400"}>
                                            Share purchase is temporarily disabled because of StrongBlock's recent
                                            reward cap announcement.
                                        </Text>
                                        :
                                        <Button
                                            bg={"#FFFFFF"}
                                            p="0px"
                                            variant="no-hover"
                                            my={{sm: "0px", lg: "0px"}}
                                            onClick={() => {
                                                if (!metamaskInstalled) {
                                                    alert("Please install Metamask to use EasyBlock.");
                                                } else if (!isConnected) {
                                                    connectWalletHandler();
                                                } else {
                                                    buyShares(sharesToBeBought * 100);
                                                }
                                            }}
                                            paddingLeft={8}
                                            paddingRight={8}
                                            paddingTop={6}
                                            paddingBottom={6}
                                        >
                                            {!isBuying || userDataLoading ?
                                                <Text
                                                    fontSize="32"
                                                    color={"#3e68a4"}
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    transition="all .5s ease"
                                                    my={{sm: "1.5rem", lg: "0px"}}
                                                >
                                                    {purchaseAllowance >= (sharesToBeBought * 10000000) ? "Buy Shares" : "Approve"}
                                                </Text> : <Spinner color={"#3e68a4"}/>}
                                        </Button>}

                                </Flex>
                            </Portal>
                        </CardBody>
                    </Card>
                    <Card minHeight="290.5px" p="1.2rem">
                        <CardBody w="100%">
                            <Flex flexDirection={{sm: "column", lg: "row"}} w="100%">
                                <Flex
                                    flexDirection="column"
                                    h="100%"
                                    lineHeight="1.6"
                                    width={{lg: "45%"}}
                                >
                                    <Text fontSize="sm" color="gray.400" fontWeight="bold">
                                        Connected
                                        Wallet: {userDataLoading ? <Spinner/> : <Text>
                                        {
                                            !isConnected ? "Please Connect Wallet" : userWallet}</Text>}
                                    </Text>
                                    <Text
                                        fontSize="xl"
                                        color={textColor}
                                        fontWeight="bold"
                                        pb=".5rem"
                                        marginTop="8px"
                                    >
                                        - Shares Owned: {userDataLoading ? <Spinner/> : <span>
                                        {userShares}</span>}
                                    </Text>

                                    {(userDataLoading || !isConnected) ? null :
                                        isAutoCompound ?
                                            <Button
                                                bg={"red.500"}
                                                p="0px"
                                                variant="no-hover"
                                                my={{sm: "0px", lg: "0px"}}
                                                onClick={async () => {
                                                    setIsToggleAutoCompounding(true);
                                                    await easyBlockWithSigner.setAutoCompounding(false);
                                                    setTimeout(async () => {
                                                        await connectAndGetUserData();
                                                        setIsToggleAutoCompounding(false);
                                                    }, 15000);
                                                }}
                                                paddingLeft={8}
                                                paddingRight={8}
                                                paddingTop={6}
                                                paddingBottom={6}
                                                style={{marginBottom: 8}}
                                            >
                                                {isToggleAutoCompounding ? <Spinner/> : <Text
                                                    fontSize="16"
                                                    color={"#ffffff"}
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    transition="all .5s ease"
                                                    my={{sm: "1.5rem", lg: "0px"}}
                                                >
                                                    {"Disable Auto-Compounding"}
                                                </Text>}
                                            </Button>
                                            :
                                            <Button
                                                bg={"#43a047"}
                                                p="0px"
                                                variant="no-hover"
                                                my={{sm: "0px", lg: "0px"}}
                                                onClick={async () => {
                                                    setIsToggleAutoCompounding(true);
                                                    await easyBlockWithSigner.setAutoCompounding(true);
                                                    setTimeout(async () => {
                                                        await connectAndGetUserData();
                                                        setIsToggleAutoCompounding(false);
                                                    }, 15000);
                                                }}
                                                paddingLeft={8}
                                                paddingRight={8}
                                                paddingTop={6}
                                                paddingBottom={6}
                                                style={{marginBottom: 8}}
                                            >
                                                {isToggleAutoCompounding ? <Spinner/> : <Text
                                                    fontSize="16"
                                                    color={"#ffffff"}
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    transition="all .5s ease"
                                                    my={{sm: "1.5rem", lg: "0px"}}
                                                >
                                                    {"Enable Auto-Compounding"}
                                                </Text>}
                                            </Button>}


                                    <UserWalletRewards userDataLoading={userDataLoading}
                                                       totalShareCount={totalShareCount}
                                                       userShares={userShares + userNftCount * 50}
                                                       reward={wallet1Strong}
                                                       name={"Wallet 1"}
                                                       distributionDate={"May 31"}
                                                       strongPrice={strongPrice}
                                                       nextWallet={true}
                                                       premiumCollected={premiumCollected}/>
                                    {showWalletDetails ?
                                        <>
                                            <UserWalletRewards userDataLoading={userDataLoading}
                                                               totalShareCount={totalShareCount}
                                                               userShares={userShares + userNftCount * 50}
                                                               reward={wallet2Strong}
                                                               name={"Wallet 2"}
                                                               distributionDate={"June 10"}
                                                               strongPrice={strongPrice}
                                            />
                                            <UserWalletRewards userDataLoading={userDataLoading}
                                                               totalShareCount={totalShareCount}
                                                               userShares={userShares + userNftCount * 50}
                                                               reward={wallet3Strong}
                                                               name={"Wallet 3"}
                                                               distributionDate={"June 20"}
                                                               strongPrice={strongPrice}
                                            /></>
                                        : <p onClick={() => {
                                            setShowWalletDetails(true)
                                        }} style={{
                                            cursor: "pointer",
                                            marginTop: -16,
                                            opacity: 0.9,
                                            marginLeft: 8,
                                            textSize: 8,
                                            marginBottom: 16
                                        }}>Show
                                            Other Wallets</p>}
                                    {showWalletDetails ? <p onClick={() => {
                                        setShowWalletDetails(false)
                                    }} style={{
                                        cursor: "pointer",
                                        marginTop: -16,
                                        opacity: 0.9,
                                        marginLeft: 8,
                                        textSize: 8,
                                        marginBottom: 16
                                    }}>Show Less</p> : null}

                                    <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                        (*) This is the reward accumulated from Strongblock but not yet claimed and
                                        distributed. Remember that the distributed amount can be lower because of
                                        Strongblock's claim and maintenance fees.
                                    </Text>
                                    <Spacer/>

                                </Flex>
                                <Spacer/>
                                <Flex
                                    bg="#FFFFFF"
                                    align="center"
                                    justify="center"
                                    borderRadius="15px"
                                    flexDirection={"column"}
                                    padding={4}
                                    width={window.innerWidth < 960 ? "100%" : "50%"}
                                >
                                    <Image
                                        src={'/coins/UsdcLogo.png'}
                                        alt="chakra image"
                                        width={100}
                                    />
                                    <Text style={{
                                        marginBottom: 16,
                                        fontSize: 16,
                                        color: "#3e68a4",
                                        marginTop: 8,
                                        textAlign: 'center',
                                    }}><b>Next Reward Distribution:</b><br/>To Be Announced<br/>
                                        <span
                                            style={{fontWeight: 'normal', fontSize: 14}}>{/*Because of the low price of $STRNGR the distribution couldn't happen at the moment because the gas fees to claim outweigh the rewards.*/}
                                        </span>
                                        <br/>
                                        {/*userDataLoading ? <Spinner/> :
                                            <span style={{fontSize: 20, marginTop: 16, fontWeight: 'normal'}}>
                                                <b>Estimated Amount:</b> ${totalShareCount === 0 ? 0
                                                : calculateEstimatedRewardsSingle(wallet1Strong) > (calculateCurrentRewardSingle(wallet1Strong))
                                                    ? calculateEstimatedRewardsSingle(wallet1Strong).toFixed(2)
                                                    : (calculateCurrentRewardSingle(wallet1Strong)).toFixed(2)}</span>*/}
                                    </Text>

                                </Flex>
                            </Flex>
                        </CardBody>
                    </Card>
                </Grid>

                {isConnected ?
                    <ReferalBox userDataLoading={userDataLoading} easyBlockContract={easyBlockContract}
                                signer={signer} userShares={userShares} userWallet={userWallet}
                                totalReferralRewards={totalReferralRewardsDistributed}
                                referSale={userReferralPurchaseCount}
                                referFee={userReferralRewards}/> : null}
                {(isConnected && userShares !== 0) ?
                    <SellShareBox maxSharesToSold={maxSharesToBeSold} sellPrice={sellPrice}
                                  sellShares={async (count) => await sellShares(count)}
                                  userDataLoading={userDataLoading} easyBlockContract={easyBlockContract}
                                  signer={signer} userShares={userShares}/> : null}

            </Flex>
            <CookieConsent
                location="bottom"
                buttonText="I understand"
                style={{background: "#2B373B"}}
                buttonStyle={{color: "#ffffff", backgroundColor: "#3e68a4", fontSize: "13px"}}
                expires={150}
            >
                By using this website you agree to our use of cookies, our{" "}
                <a href={"https://drive.google.com/file/d/1gabHyca4TJOvfrNWvFpbWRY02bZGlzdq/view"}
                   style={{textDecoration: "underline"}} target={"_blank"}>Terms of Use</a>, and {" "}
                <a href={"https://strongblock.com/terms-of-service.html"} style={{textDecoration: "underline"}}
                   target={"_blank"}>Strongblock's
                    Terms of Use</a>.
            </CookieConsent>
        </div>
    );
}
