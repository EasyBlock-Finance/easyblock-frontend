/*eslint-disable*/
import React, {useState} from "react";
import {Flex} from "@chakra-ui/react";

export default function SellShareBox(props) {
    return (
        <Flex width={"100%"} height={100} backgroundColor={"#FFFFFF"} borderRadius={8}>
            <p>Sell Shares</p>
            <p>Selling shares is an experimental function and shouldn't be used to make profits. It's sole purpose is to
                give shareholder who need immediate money to exit the project. There is a 40% fee for selling shares
                (15% goes to the developers and 25% goes to the community reward pool).</p>
        </Flex>
    );
}
