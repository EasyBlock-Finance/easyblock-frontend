/*eslint-disable*/
import React, {useState} from "react";
import {Button, Flex, Input, InputGroup, Spinner, Text} from "@chakra-ui/react";
import toast from "react-hot-toast";

export default function SellShareBox(props) {
    const [sharesToBeSold, setSharesToBeSold] = useState(1);
    const [isSelling, setIsSelling] = useState(false);

    // Listeners
    props.easyBlockContract.on("ShareSold", async (shareAmount, sellAmount, address, event) => {
            if (event.event === "ShareSold" && address === await props.signer.getAddress()) {
                setSharesToBeSold(1);
                isSelling(false);
                window.location.reload();
                toast.success("Shares sold successfully. Your balance will be updated soon.", {duration: 5000,});
            }
        }
    );
    return (
        <Flex width={"100%"} backgroundColor={"gray.700"} borderRadius={8} flexDirection={"column"} padding={8}>
            <Text fontSize="24" fontWeight="bold" pb=".3rem" marginBottom={0}>Sell Shares</Text>
            <Text fontSize={14} color={"gray.400"} marginBottom={4}>Selling shares is an experimental function and
                shouldn't be used to make profits. It's sole purpose is to
                give shareholder who need immediate money to exit the project. There is a 40% (which is the reason sell
                price is lower than buy price) fee for selling shares
                (15% goes to the developers and 25% goes to the community reward pool).</Text>
            <Text fontSize={18}><b>Max Shares You Can Sell:</b> {props.maxSharesToSold}</Text>
            <Text fontSize={18} marginBottom={8}><b>Sell Price:</b> ${props.sellPrice}</Text>
            <Flex flexDirection={"column"} maxWidth={300}>
                <Flex marginBottom={4}>
                    <Text fontSize={24} fontWeight={"bold"} marginRight={4}>Share Count: </Text>
                    <Flex flex={1}/>
                    <InputGroup
                        borderRadius="15px"
                        w="100px"
                    >
                        <Input
                            fontSize="16"
                            py="11px"
                            placeholder="1"
                            borderRadius="inherit"
                            value={sharesToBeSold}
                            onChange={(e) => {
                                setSharesToBeSold(e.target.value);
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                    setSharesToBeSold(1);
                                } else if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) > props.maxSharesToSold) {
                                    setSharesToBeSold(props.maxSharesToSold);
                                }
                            }}
                            textAlign={"center"}
                        />
                    </InputGroup>
                </Flex>
                <Text fontSize={18} marginBottom={2} textAlign={"center"} width={"100%"}><b>You will
                    receive: </b> {(sharesToBeSold * props.sellPrice).toFixed(2)} $USDC</Text>
                <Button
                    bg={"#FFFFFF"}
                    p="0px"
                    variant="no-hover"
                    my={{sm: "0px", lg: "0px"}}
                    onClick={async () => {
                        setIsSelling(true);
                        await props.sellShares(sharesToBeSold)
                    }}
                    style={{width: "100%"}}
                >
                    {!isSelling || props.userDataLoading ?
                        <Text
                            fontSize="32"
                            color={"#3e68a4"}
                            fontWeight="bold"
                            cursor="pointer"
                            transition="all .5s ease"
                            my={{sm: "1.5rem", lg: "0px"}}
                        >
                            {"Sell Shares"}
                        </Text> : <Spinner color={"#3e68a4"}/>}
                </Button>
            </Flex>
        </Flex>
    );
}
