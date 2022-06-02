/*eslint-disable*/
import React, {useState} from "react";
import {Button, Flex, Input, InputGroup, Spinner, Text} from "@chakra-ui/react";
import toast from "react-hot-toast";

export default function ReferalBox(props) {
    return (
        <Flex width={"100%"} backgroundColor={"gray.700"} borderRadius={8} flexDirection={"column"}
              maxWidth={window.innerWidth < 960 ? "380px" : "unset"}
              padding={window.innerWidth < 960 ? 4 : 8} marginBottom={4}>
            <Text fontSize="24" fontWeight="bold" pb=".3rem" marginBottom={0}>Refer Your Friends</Text>
            <Text fontSize={16} color={"gray.400"} marginBottom={4}>You can invite your friends and earn rewards
                in <b>USDC</b>. All you need to do is to share your link and when they buy shares with your
                link, <b>1%</b> of their purchase will be directly deposited into your wallet.</Text>

            <Text fontSize={20} marginBottom={4}><b style={{fontSize: 24}}>Your Referral
                Link: </b>
                {props.userShares > 0 ? <a
                    style={{
                        textDecoration: "underline",
                    }}>https://strong.easyblock.finance?r={props.userWallet}</a> : "You need to have at least 1 shares to refer"}
            </Text>

            <Text fontSize={20}><b>Total Referral Rewards Distributed: </b>{0.4608 + props.totalReferralRewards.toFixed(4)} USDC</Text>
            <Text fontSize={20}><b>Purchases Made with Your Link: </b>{props.referSale}</Text>
            <Text fontSize={20}><b>Your Referral Earnings: </b>{props.referFee.toFixed(4)} $USDC</Text>
        </Flex>
    );
}
