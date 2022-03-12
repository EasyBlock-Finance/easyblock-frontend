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
import {CONTRACT_ADDRESS, EASYBLOCK_ABI, PURCHASE_TOKEN_ABI} from "../../contracts/EasyBlock";
// Toast
import toast, {Toaster, useToasterStore} from 'react-hot-toast';
// Analytics
import {initializeFirebase} from "../../util/firebase";

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

let signer = null;
let easyBlockWithSigner = null;

let depositTokenContract = null;
let depositTokenContractWithSigner = null;

const dollarUSLocale = Intl.NumberFormat('en-US');

export default function Dashboard() {
    let pastDistribution = new Date();
    let nextDistribution = new Date("03/17/2022");

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
    const [totalBalance, setTotalBalance] = useState(1);
    const [notClaimedRewards, setNotClaimedRewards] = useState(0);
    // Different wallets start
    const [wallet1Rewards, setWallet1Rewards] = useState(0);
    const [wallet1Strong, setWallet1Strong] = useState(0);

    const [wallet2Rewards, setWallet2Rewards] = useState(0);
    const [wallet2Strong, setWallet2Strong] = useState(0);

    const [wallet3Rewards, setWallet3Rewards] = useState(0);
    const [wallet3Strong, setWallet3Strong] = useState(0);

    // Different wallets end
    const [shareHolderCount, setShareHolderCount] = useState(0);
    const [newInvestments, setNewInvestments] = useState(0);

    // User stats
    const [userWallet, setUserWallet] = useState("");
    const [userShares, setUserShares] = useState(0);
    const [userPendingRewards, setUserPendingRewards] = useState(0);
    const [totalUserRewards, setTotalUserRewards] = useState(0);
    const [purchaseAllowance, setPurchaseAllowance] = useState(0);

    const [sharesToBeBought, setSharesToBeBought] = useState(30);

    const inputBg = useColorModeValue("white", "gray.800");

    const overlayRef = React.useRef();

    // UI CONTROLLERS
    const [generalDataLoading, setGeneralDataLoading] = useState(true);
    const [userDataLoading, setUserDataLoading] = useState(true);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [buyError, setBuyError] = useState(false);
    const [priceLoading, setPriceLoading] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);
    const [rewardDistributing, setRewardDistributing] = useState(false);

    const [showStatDetails, setShowStatDetails] = useState(false);
    const [showWalletDetails, setShowWalletDetails] = useState(false);

    const {toasts} = useToasterStore();
    const TOAST_LIMIT = 1;

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.remove(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
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
        let balance = 0;

        fetch('https://openapi.debank.com/v1/user/total_balance?id=0xde6f949cec8ba92a8d963e9a0065c03753802d14').then(response => response.json()).then(data => {
                balance += data['total_usd_value'];
                fetch('https://openapi.debank.com/v1/user/total_balance?id=0xeB1b78C06510566a9E50e760B9F5aFE788ca5E6B').then(response => response.json()).then(data => {
                        balance += data['total_usd_value'];
                        fetch('https://openapi.debank.com/v1/user/total_balance?id=0xc73D10A7A1dBD3dea1AAA5a32Bf03D72DFCBFDBe').then(response => response.json()).then(data => {
                            balance += data['total_usd_value'];

                            fetch('https://openapi.debank.com/v1/user/protocol?id=0xde6f949cec8ba92a8d963e9a0065c03753802d14&protocol_id=strongblock').then(response => response.json()).then(data => {
                                    try {
                                        // Specific wallets
                                        setWallet1Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                                        setWallet1Strong(data['portfolio_item_list'][0]['detail']['token_list'][0]['amount']);

                                        fetch('https://openapi.debank.com/v1/user/protocol?id=0xeB1b78C06510566a9E50e760B9F5aFE788ca5E6B&protocol_id=strongblock').then(response => response.json()).then(data => {
                                                try {
                                                    // Specific wallets
                                                    setWallet2Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                                                    setWallet2Strong(data['portfolio_item_list'][0]['detail']['token_list'][0]['amount']);

                                                    fetch('https://openapi.debank.com/v1/user/protocol?id=0xc73D10A7A1dBD3dea1AAA5a32Bf03D72DFCBFDBe&protocol_id=strongblock').then(response => response.json()).then(data => {
                                                            try {
                                                                // Specific wallets
                                                                setWallet3Rewards(data['portfolio_item_list'][0]['stats']['asset_usd_value']);
                                                                setWallet3Strong(data['portfolio_item_list'][0]['detail']['token_list'][0]['amount']);

                                                                setTotalBalance(balance);
                                                                setPriceLoading(false);
                                                            } catch (e) {
                                                            }
                                                        }
                                                    );
                                                } catch (e) {
                                                }
                                            }
                                        );
                                    } catch (e) {
                                    }
                                }
                            );

                        });
                    }
                );
            }
        );
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

                let userShares = parseInt(await easyBlockContract.shareCount(walletAddress), 10);
                let claimableReward = parseInt(await easyBlockContract.claimableReward(walletAddress), 10);

                setUserShares(userShares);
                setUserPendingRewards(claimableReward / 1000000);
                setIsConnected(true);

                // Deposit token contracts
                depositTokenContractWithSigner = depositTokenContract.connect(signer);
                let allowance = parseInt(await depositTokenContract.allowance(walletAddress, CONTRACT_ADDRESS), 10);
                setPurchaseAllowance(allowance);
                setUserDataLoading(false);

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

            setTotalInvestments(totalInvestment);
            setTotalRewardsPaid(totalRewards);
            setTotalShareCount(totalShares);
            setPurchaseTokenContract(purchaseTokenAddress);
            setSharePrice(sharePrice / 1000000);
            setNodesOwned(totalNodesOwned);
            setNewInvestments(investment / 1000000); // USDC has 6 decimals
            setRewardDistributing(!sharePurchaseEnabled);
            setShareHolderCount(holderCount);


            // Deposit token contracts
            depositTokenContract = new ethers.Contract(purchaseTokenAddress, PURCHASE_TOKEN_ABI, provider);

            // UI Change
            setGeneralDataLoading(false);

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
            fetch('https://api.coingecko.com/api/v3/coins/strong').then(response => response.json()).then(data => {
                    let price = data.market_data.current_price.usd;
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
                    await easyBlockWithSigner.buyShares(count);
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

    // CONTRACT EVENT LISTENERS
    easyBlockContract.on("RewardCollected", async (amount, address, event) => {
        if (event.event === "RewardCollected" && address === await signer.getAddress()) {
            // await getSmartContractData();
            window.location.reload();
            setUserPendingRewards(0);
            setIsClaiming(false);
            toast.success("Rewards claimed successfully. Your balance will be updated soon.", {duration: 5000,});
        }
    });
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

    async function updateAllowance() {
        try {
            let allowance = await depositTokenContractWithSigner.allowance(await signer.getAddress(), CONTRACT_ADDRESS);
            setPurchaseAllowance(allowance);
        } catch (e) {
            await updateAllowance()
        }
    }

    usdcContract.on("Approval", async (target, spender, value, event) => {
        if (event.event === "Approval" && signer != null && target === await signer.getAddress() && spender === CONTRACT_ADDRESS) {
            await updateAllowance();
            setIsBuying(false);
            toast.success("Approval successful. You can buy your shares now!", {duration: 5000,});
        }
    });

    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });

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
                    logoText={"EasyBlock"}
                    isConnected={isConnected}
                />
            </Portal>
            <Flex flexDirection="column" pt={{base: "60px", md: "75px"}} maxWidth={"1400px"} paddingLeft={0}
                  paddingRight={0}>
                <Flex
                    bg="#FFFFFF"
                    align="start"
                    justify="center"
                    borderRadius="15px"
                    flexDirection={"column"}
                    padding={4}
                    marginBottom={4}
                    onClick={() => {
                        setShowExplanation(!showExplanation)
                    }}
                    cursor={"pointer"}
                >
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "#3e68a4",
                            marginTop: 0
                        }}>What is EasyBlock? <br/>
                        </Text>
                        <BsChevronDown h={100} w={100} color={"#000000"}
                                       style={{marginLeft: 16, width: 24, height: 24, cursor: "pointer"}}
                                       onClick={() => {
                                           setShowExplanation(!showExplanation)
                                       }}/>
                    </div>
                    {showExplanation ? <>

                            <span
                                style={{fontWeight: 'normal', color: "#000000", fontSize: 16}}>
                            EasyBlock is a protocol running on Fantom Network which enables investors of all sizes to invest in StrongBlock Nodes. StrongBlock requires a minimum investment
                            amount of <b>{(strongPrice * 10).toFixed(0)} $</b> and runs on Ethereum Mainnet which has really high gas-fees. These conditions make StrongBlock inaccesible for most of investors.
                            On contrary, <b>EasyBlock</b> has a minimum investment amount of <b>10 $</b> per share and minimal gas fees. <br/>
                            The amount generated from share sales are bridged to Ethereum Mainnet and used to purchase StrongBlock Nodes. Revenue generated from those nodes is bridged back to Fantom on optimal intervals and distributed to shareholders.
                        </span>
                        <Button
                            p="0px"
                            variant="no-hover"
                            bg="transparent"
                            my={{sm: "1.5rem", lg: "0px"}}
                            onClick={() => window.open("https://docs.easyblock.finance", '_blank')}
                        >
                            <Text
                                fontSize="sm"
                                color={"#3e68a4"}
                                fontWeight="bold"
                                cursor="pointer"
                                transition="all .5s ease"
                                my={{sm: "1.5rem", lg: "0px"}}
                                _hover={{me: "4px"}}
                            >
                                Learn More
                            </Text>
                            <Icon
                                color={"#3e68a4"}
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
                        <Button
                            p="0px"
                            variant="no-hover"
                            bg="transparent"
                            my={{sm: "1.5rem", lg: "0px"}}
                            onClick={() => window.open("https://docs.easyblock.finance/faq", '_blank')}
                        >
                            <Text
                                fontSize="sm"
                                color={"#3e68a4"}
                                fontWeight="bold"
                                cursor="pointer"
                                transition="all .5s ease"
                                my={{sm: "1.5rem", lg: "0px"}}
                                _hover={{me: "4px"}}
                            >
                                FAQ
                            </Text>
                            <Icon
                                color={"#3e68a4"}
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
                    </> : null}
                </Flex>
                <SimpleGrid columns={{sm: 1, md: 2, xl: 5}} spacing="12px" paddingLeft={0} paddingRight={0}
                            marginBottom={4}>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        StrongBlock APR
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor}>
                                            ~230%
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <img style={{width: 36, height: 36}} src={'/stronblock/StrongBlockLogo.png'}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Strong Node Price
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="lg" color={textColor}>
                                            {dollarUSLocale.format(strongPrice * 10)} $
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <AiOutlineLineChart h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Owned Nodes
                                    </StatLabel>
                                    <Flex>
                                        {generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {nodesOwned}
                                            </StatNumber>}
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <BiNetworkChart h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Total Investment
                                    </StatLabel>
                                    <Flex>
                                        {generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {dollarUSLocale.format((totalInvestments / 1000000).toFixed(2))} $
                                            </StatNumber>}
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <WalletIcon h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Profit Distributed
                                    </StatLabel>
                                    <Flex>
                                        <StatNumber fontSize="md" color={textColor}>
                                            {dollarUSLocale.format(87297 + 13132 + 10513)} $
                                        </StatNumber>
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <WalletIcon h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/*
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Monthly Revenue <br/>/ 100 Shares
                                    </StatLabel>
                                    <Flex>
                                        {generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                {totalShareCount === 0 ? 0 : (nodesOwned * 3 * strongPrice / totalShareCount * 100).toFixed(2)} $
                                            </StatNumber>}
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <FiDollarSign h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    */}
                </SimpleGrid>
                {showStatDetails ? <>
                    <SimpleGrid columns={{sm: 1, md: 2, xl: 4}} spacing="12px" paddingLeft={0} paddingRight={0}
                                marginBottom={4}>
                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Estimated Yearly Revenue
                                        </StatLabel>
                                        <Flex>
                                            {generalDataLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                    {dollarUSLocale.format((nodesOwned * 0.091 * 365 * strongPrice).toFixed(0))} $
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <FiDollarSign h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Until Next Node
                                        </StatLabel>
                                        <Flex>
                                            {priceLoading || generalDataLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                    {((totalBalance + newInvestments - wallet1Rewards - wallet2Rewards) / (strongPrice * 10) * 100).toFixed(0)} %
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <AiFillPieChart h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat>
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Share Holders
                                        </StatLabel>
                                        <Flex>
                                            {generalDataLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor}>
                                                    {shareHolderCount}
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <Spacer/>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <BsFillPeopleFill h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Total Shares
                                        </StatLabel>
                                        <Flex>
                                            {generalDataLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                    {dollarUSLocale.format(totalShareCount)}
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <AiOutlineBlock h={"48px"} w={"48px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        {/*
                    <Card minH="83px">
                        <CardBody>
                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                <Stat me="auto">
                                    <StatLabel
                                        fontSize="sm"
                                        color="gray.400"
                                        fontWeight="bold"
                                        pb=".1rem"
                                    >
                                        Capital Waiting To Be Invested
                                    </StatLabel>
                                    <Flex>
                                        {priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {dollarUSLocale.format((totalBalance + newInvestments - wallet1Rewards - wallet2Rewards).toFixed(2))} $
                                            </StatNumber>}
                                    </Flex>
                                </Stat>
                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                    <GrMoney h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                </IconBox>
                            </Flex>
                        </CardBody>
                    </Card>
                    */}
                    </SimpleGrid>
                    <SimpleGrid columns={{sm: 1, md: 4, xl: 4}} spacing="12px" paddingLeft={0} paddingRight={0}
                                marginBottom={4}>
                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Total Not Claimed Revenue
                                        </StatLabel>
                                        <Flex>
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {(wallet1Strong + wallet2Strong).toFixed(2)} STRONG
                                            </StatNumber>
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <GiReceiveMoney h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Wallet 1 Not Claimed Revenue
                                        </StatLabel>
                                        <Flex>
                                            {priceLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor}>
                                                    {(wallet1Strong).toFixed(2)} STRONG
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <GiReceiveMoney h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Wallet 2 Not Claimed Revenue
                                        </StatLabel>
                                        <Flex>
                                            {priceLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor}>
                                                    {(wallet2Strong).toFixed(2)} STRONG
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <GiReceiveMoney h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>

                        <Card minH="83px">
                            <CardBody>
                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                    <Stat me="auto">
                                        <StatLabel
                                            fontSize="sm"
                                            color="gray.400"
                                            fontWeight="bold"
                                            pb=".1rem"
                                        >
                                            Wallet 3 Not Claimed Revenue
                                        </StatLabel>
                                        <Flex>
                                            {priceLoading ?
                                                <Spinner/> :
                                                <StatNumber fontSize="lg" color={textColor}>
                                                    {(wallet3Strong).toFixed(2)} STRONG
                                                </StatNumber>}
                                        </Flex>
                                    </Stat>
                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#FFFFFF"}>
                                        <GiReceiveMoney h={"36px"} w={"36px"} color={"#3e68a4"}/>
                                    </IconBox>
                                </Flex>
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                </> : <p onClick={() => {
                    setShowStatDetails(true)
                }} style={{cursor: "pointer", marginTop: -8, opacity: 0.9, marginLeft: 16}}>Show More Statistics</p>}
                {showStatDetails ? <p onClick={() => {
                    setShowStatDetails(false)
                }} style={{cursor: "pointer", marginTop: -8, opacity: 0.9, marginLeft: 16}}>Show Less</p> : null}
                <Grid
                    templateColumns={{md: "1fr", lg: "1.2fr 1.8fr"}}
                    templateRows={{md: "1fr auto", lg: "1fr"}}
                    my="26px"
                    gap="24px"
                >
                    <Card maxHeight="600px" p="1rem">
                        <CardBody
                            p="0px"
                            bgPosition="center"
                            bgRepeat="no-repeat"
                            w="100%"
                            h={{sm: "400px", lg: "400px"}}
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
                                    <Text fontSize="24" fontWeight="bold" pb=".3rem" marginBottom={4}>
                                        Buy EasyBlock Shares
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
                                                    <Spinner/> : (isNaN(parseInt(sharesToBeBought)) || parseInt(sharesToBeBought) < 1) ? sharePrice.toFixed(2) : (sharePrice * sharesToBeBought).toFixed(2)}
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
                                                        <Spinner/> : (isNaN(parseInt(sharesToBeBought)) || parseInt(sharesToBeBought) < 1) ? sharePrice : sharePrice * sharesToBeBought}
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
                                        <Text fontSize={"md"} marginBottom={"4"}>You only need to Approve the first
                                            time you are using the protocol.</Text>}
                                    {rewardDistributing ?
                                        <Text fontSize="16" fontWeight="bold" pb=".3rem" marginBottom={4}
                                              color={"red.400"}>
                                            Reward distribution in progress. Share purchase will be re-enabled after
                                            it ends.
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
                                                    buyShares(sharesToBeBought);
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

                                    <Card minH="83px" backgroundColor={"#FFFFFF"} marginBottom={"16px"}>
                                        <CardBody>
                                            <Flex flexDirection="row" align="center" justify="center" w="100%">
                                                <Stat me="auto">
                                                    <StatLabel
                                                        fontSize="sm"
                                                        color="#3e68a4"
                                                        fontWeight="bold"
                                                        pb=".1rem"
                                                    >
                                                        Wallet 2 Revenue <br/>(Distribution: March 17)
                                                    </StatLabel>
                                                    <Flex>
                                                        <StatNumber fontSize="lg" color={"gray.600"}
                                                                    fontWeight="bold">
                                                            {userDataLoading ? <Spinner/> : <span>
                                                                {totalShareCount === 0 ? 0 : ((wallet2Rewards) / totalShareCount * userShares).toFixed(2)}</span>} $
                                                        </StatNumber>
                                                    </Flex>
                                                </Stat>
                                                <IconBox as="box" h={"48px"} w={"48px"} bg={"#3e68a4"}>
                                                    <FiDollarSign h={"48px"} w={"48px"} color={"#fff"}/>
                                                </IconBox>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                    {showWalletDetails ?
                                        <Card minH="83px" backgroundColor={"#FFFFFF"} marginBottom={"16px"}>
                                            <CardBody>
                                                <Flex flexDirection="row" align="center" justify="center" w="100%">
                                                    <Stat me="auto">
                                                        <StatLabel
                                                            fontSize="sm"
                                                            color="#3e68a4"
                                                            fontWeight="bold"
                                                            pb=".1rem"
                                                        >
                                                            Wallet 1 Revenue <br/>(Distribution: March 22)
                                                        </StatLabel>
                                                        <Flex>
                                                            <StatNumber fontSize="lg" color={"gray.600"}
                                                                        fontWeight="bold">
                                                                {userDataLoading ? <Spinner/> : <span>
                                                                {totalShareCount === 0 ? 0 : ((wallet1Rewards) / totalShareCount * userShares).toFixed(2)}</span>} $
                                                            </StatNumber>
                                                        </Flex>
                                                    </Stat>
                                                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#3e68a4"}>
                                                        <FiDollarSign h={"48px"} w={"48px"} color={"#fff"}/>
                                                    </IconBox>
                                                </Flex>
                                            </CardBody>
                                        </Card>

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
                                        distributed.
                                        We currently have 2 wallets holding the nodes and their rewards will be
                                        distributed every 5 days one after another. These amounts keep growing as time
                                        passes.
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
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: "#3e68a4",
                                        marginTop: 8,
                                        textAlign: 'center',
                                    }}>Next Reward Distribution:<br/>March 17, 2022<br/>
                                        <span
                                            style={{fontWeight: 'normal', fontSize: 14}}>Your share from the generated revenue will be directly deposited into your wallet every 5 days.</span>
                                        <br/>
                                        {userDataLoading ? <Spinner/> :
                                            <span style={{fontSize: 20, marginTop: 16, fontWeight: 'normal'}}><b>Estimated Amount:</b> {totalShareCount === 0 ? 0 : ((wallet2Rewards) / totalShareCount * userShares / (10 - Difference_In_Days) * 10) > ((wallet2Rewards) / totalShareCount * userShares) ? ((wallet2Rewards) / totalShareCount * userShares / (10 - Difference_In_Days) * 10).toFixed(2) : ((wallet2Rewards) / totalShareCount * userShares).toFixed(2)} $</span>}
                                    </Text>

                                </Flex>
                            </Flex>
                        </CardBody>
                    </Card>
                </Grid>
            </Flex>
        </div>
    );
}
