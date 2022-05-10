/*eslint-disable*/
import React, {useState} from "react";
import {Button, Flex, Icon, Text} from "@chakra-ui/react";
import {BsArrowRight, BsChevronDown} from "react-icons/bs";

export default function ExplanationBox(props) {
    const [showExplanation, setShowExplanation] = useState(false);
    return (
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
                }}>What is EasyBlock Strong? <br/>
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
                            amount of <b>${(props.strongPrice * 10).toFixed(0)}</b> and runs on Ethereum Mainnet which has really high gas-fees. These conditions make StrongBlock inaccesible for most of investors.
                            On contrary, <b>EasyBlock</b> has a minimum investment amount of <b>${props.sharePrice * 100}</b> per share and minimal gas fees. <br/>
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
    );
}
