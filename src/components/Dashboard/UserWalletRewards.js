/*eslint-disable*/
import React from "react";
import {
    Flex,
    Spinner,
    Stat,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import IconBox from "../Icons/IconBox";
import {FiDollarSign} from "react-icons/fi";


export default function UserWalletRewards(props) {
    function calculateCurrentRewardSingle(reward) {
        reward -= 901; // average full wallet gas cost to claim
        if (typeof props.nextWallet !== "undefined" && props.nextWallet !== null && props.nextWallet) {
            reward += props.premiumCollected;
        }
        if (reward < 0) {
            reward = 0;
        }
        return (reward) / props.totalShareCount * props.userShares * 0.9;
    }

    return (
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
                            {props.name} Revenue <br/>(Distribution: {props.distributionDate})
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize="lg" color={"gray.600"}
                                        fontWeight="bold">
                                {props.userDataLoading ? <Spinner/> : <span>
                                                                ${props.totalShareCount === 0 ? 0 : calculateCurrentRewardSingle(props.reward * props.strongPrice).toFixed(2)}</span>}
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <IconBox as="box" h={"48px"} w={"48px"} bg={"#3e68a4"}>
                        <FiDollarSign h={"48px"} w={"48px"} color={"#fff"}/>
                    </IconBox>
                </Flex>
            </CardBody>
        </Card>
    );
}
