/*eslint-disable*/
import React, {useState} from "react";
import {
    Flex,
    SimpleGrid, Spacer, Spinner,
    Stat,
    StatLabel,
    StatNumber, useColorModeValue
} from "@chakra-ui/react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import IconBox from "../Icons/IconBox";
import {AiFillPieChart, AiOutlineBlock, AiOutlineLineChart, BsFillPeopleFill, GiReceiveMoney} from "react-icons/all";
import {BiNetworkChart} from "react-icons/bi";
import {WalletIcon} from "../Icons/Icons";
import {FiDollarSign} from "react-icons/fi";

const dollarUSLocale = Intl.NumberFormat('en-US');

export default function StatBox(props) {
    // Color module
    const textColor = useColorModeValue("gray.700", "white");
    // UI controls
    const [showStatDetails, setShowStatDetails] = useState(false);

    return (
        <>
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
                                        ${dollarUSLocale.format((props.strongPrice * 10).toFixed(0))}
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
                                    {props.generalDataLoading ?
                                        <Spinner/> :
                                        <StatNumber fontSize="lg" color={textColor}>
                                            {props.nodesOwned}
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
                                    Total Value of Nodes
                                </StatLabel>
                                <Flex>
                                    {props.generalDataLoading ?
                                        <Spinner/> :
                                        <StatNumber fontSize="lg" color={textColor}>
                                            ${dollarUSLocale.format(props.strongPrice * 10 * props.nodesOwned)}
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
                                        ${dollarUSLocale.format(props.totalRewardsPaid)}
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
                                        {props.generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                {props.totalShareCount === 0 ? 0 : (props.nodesOwned * 3 * props.strongPrice / props.totalShareCount * 100).toFixed(2)} $
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
                <SimpleGrid columns={{sm: 1, md: 2, xl: 3}} spacing="12px" paddingLeft={0} paddingRight={0}
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
                                        Until Next Node
                                    </StatLabel>
                                    <Flex>

                                        {props.generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                {((props.newInvestments) / (props.strongPrice * 10) * 100).toFixed(0)} %
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
                                        {props.generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {props.shareHolderCount}
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
                                        {props.generalDataLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor} fontWeight="bold">
                                                {dollarUSLocale.format(props.totalShareCount)}
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
                                        {props.priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {dollarUSLocale.format((props.totalBalance + props.newInvestments - props.wallet1Rewards - props.wallet2Rewards).toFixed(2))} $
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
                <SimpleGrid columns={{sm: 1, md: 5, xl: 5}} spacing="12px" paddingLeft={0} paddingRight={0}
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
                                            {(props.wallet1Strong + props.wallet2Strong + props.wallet3Strong + props.wallet4Strong).toFixed(2)} STRNGR<br/>
                                            (~${dollarUSLocale.format(((props.wallet1Strong + props.wallet2Strong + props.wallet3Strong + props.wallet4Strong) * props.strongPrice).toFixed(2))})
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
                                        Wallet 1 Not Claimed
                                    </StatLabel>
                                    <Flex>
                                        {props.priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {(props.wallet1Strong).toFixed(2)} STRNGR<br/>
                                                (~${dollarUSLocale.format((props.wallet1Strong * props.strongPrice).toFixed(2))})
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
                                        Wallet 2 Not Claimed
                                    </StatLabel>
                                    <Flex>
                                        {props.priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {(props.wallet2Strong).toFixed(2)} STRNGR
                                                <br/>
                                                (~${dollarUSLocale.format((props.wallet2Strong * props.strongPrice).toFixed(2))})
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
                                        Wallet 3 Not Claimed
                                    </StatLabel>
                                    <Flex>
                                        {props.priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {(props.wallet3Strong).toFixed(2)} STRNGR
                                                <br/>
                                                (~${dollarUSLocale.format((props.wallet3Strong * props.strongPrice).toFixed(2))})
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
                                        Wallet 4 Not Claimed
                                    </StatLabel>
                                    <Flex>
                                        {props.priceLoading ?
                                            <Spinner/> :
                                            <StatNumber fontSize="lg" color={textColor}>
                                                {(props.wallet4Strong).toFixed(2)} STRNGR
                                                <br/>
                                                (~${dollarUSLocale.format((props.wallet4Strong * props.strongPrice).toFixed(2))})
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
        </>
    );
}
