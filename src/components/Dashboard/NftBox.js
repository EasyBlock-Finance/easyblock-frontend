/*eslint-disable*/
import React, {useState} from "react";
import {Button, Flex, Input, InputGroup, Spinner, Text} from "@chakra-ui/react";
import toast from "react-hot-toast";
import {NFT_ADDRESS} from "../../contracts/EasyBlock";

export default function NftBox(props) {
    const [nftToMint, setNftToMint] = useState(1);

    /*
    // Listeners
    props.easyBlockContract.on("ShareSold", async (shareAmount, sellAmount, address, event) => {
            if (event.event === "ShareSold" && address === await props.signer.getAddress()) {
                setSharesToBeSold(1);
                setIsSelling(false);
                window.location.reload();
                toast.success("Shares sold successfully. Your balance will be updated soon.", {duration: 5000,});
            }
        }
    );
     */
    return (
        <Flex width={"100%"} backgroundColor={"gray.700"} borderRadius={8} flexDirection={"column"}
              padding={window.innerWidth < 960 ? 4 : 8} marginBottom={4}>
            <Text fontSize="32" fontWeight="bold" pb=".3rem" marginBottom={0} textDecoration={"underline"}>Mint
                EasyBlock NFTs</Text>
            <Text fontSize={14} color={"gray.400"} marginBottom={4}>You can turn your shares into NFTs and trade them on
                the secondary market. Every EasyBlock Avatar NFT
                can be minted with 50 shares and has a mint cost of 20 FTM. EasyBlock Avatar NFTs will receive rewards
                as normal. Maximum of 20 NFTs can be minted at the same time.</Text>
            <Text fontSize={20}><b>Max NFTs you can mint:</b> {Math.floor(props.shareCount / 50)}
            </Text>

            <Flex flexDirection={"column"} maxWidth={300} marginTop={1}>
                <Flex marginBottom={4}>
                    <Text fontSize={20} fontWeight={"bold"} marginRight={4}>NFT Count: </Text>
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
                            value={nftToMint}
                            onChange={(e) => {
                                setNftToMint(e.target.value);
                            }}
                            onBlur={(e) => {
                                if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                    setNftToMint(1);
                                } else if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) > Math.floor(props.shareCount / 50) || parseInt(e.target.value) > 20) {
                                    setNftToMint(Math.min(20, Math.floor(props.shareCount / 50)));
                                }
                            }}
                            textAlign={"center"}
                        />
                    </InputGroup>
                </Flex>
                <Button
                    bg={"#FFFFFF"}
                    p="0px"
                    variant="no-hover"
                    my={{sm: "0px", lg: "0px"}}
                    onClick={async () => {
                        await props.mintNFT(nftToMint)
                    }}
                    style={{width: "100%"}}
                >
                    {props.isMinting || props.userDataLoading ?
                        <Spinner color={"#3e68a4"}/> :
                        <Text
                            fontSize="32"
                            color={"#3e68a4"}
                            fontWeight="bold"
                            cursor="pointer"
                            transition="all .5s ease"
                            my={{sm: "1.5rem", lg: "0px"}}
                        >
                            {"Mint"}
                        </Text>}
                </Button>
            </Flex>
            <Flex flexDirection={"column"} maxWidth={300} marginTop={1}>
                <Text fontSize="32" fontWeight="bold" pb=".3rem" marginTop={4} textDecoration={"underline"}>My
                    NFTs</Text>
                <Text fontSize="16" pb=".3rem" marginBottom={2}>
                    You can browse your NFTs on PaintSwap: <a
                    href={'https://paintswap.finance/marketplace/user'}
                    target={"_blank"}
                    style={{fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer'}}>See all my NFTs</a>
                </Text>
                {/** NFT COUNT*/}
                <Text fontSize={20}><b>Owned NFTs:</b> {props.userNftCount}</Text>
                {/** CLAIM REWARDS*/}
                <Text fontSize={20}><b>Claimable Reward:</b> ${(props.claimableReward / 1000000).toFixed(2)}</Text>
                <Button
                    bg={"#FFFFFF"}
                    p="0px"
                    variant="no-hover"
                    my={{sm: "0px", lg: "0px"}}
                    onClick={async () => {
                        await props.claimRewards()
                    }}
                    style={{width: "100%"}}
                >
                    {props.isClaiming || props.userDataLoading ?
                        <Spinner color={"#3e68a4"}/> :
                        <Text
                            fontSize="32"
                            color={"#3e68a4"}
                            fontWeight="bold"
                            cursor="pointer"
                            transition="all .5s ease"
                            my={{sm: "1.5rem", lg: "0px"}}
                        >
                            {"Claim Rewards"}
                        </Text>}
                </Button>
            </Flex>
        </Flex>
    );
}
