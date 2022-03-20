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
        return (reward) / props.totalShareCount * props.userShares
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
                            Wallet 2 Revenue <br/>(Distribution: March 27)
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize="lg" color={"gray.600"}
                                        fontWeight="bold">
                                {props.userDataLoading ? <Spinner/> : <span>
                                                                {props.totalShareCount === 0 ? 0 : calculateCurrentRewardSingle(props.reward).toFixed(2)}</span>} $
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
