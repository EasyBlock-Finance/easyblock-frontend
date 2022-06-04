/*eslint-disable*/
import React, {useEffect, useState} from "react";
import {Button, Flex, Grid, Input, InputGroup, Spinner, Text} from "@chakra-ui/react";
import toast from "react-hot-toast";
import {NFT_ADDRESS} from "../../contracts/EasyBlock";

export default function NftBox(props) {
    const [nftToMint, setNftToMint] = useState(1);
    const [nftToMintFtm, setNftToMintFtm] = useState(1);
    const [parsedNFTs, setParsedNFTs] = useState([]);

    useEffect(async () => {
        let tmpParsedNFTs = []
        for (let i = 0; i < props.userNFTs.length; i++) {
            tmpParsedNFTs.push(JSON.parse(atob((await props.nftContract.tokenURI(props.userNFTs[i])).slice(29))));
        }
        setParsedNFTs(tmpParsedNFTs);
    }, [props.userNFTs])

    return (
        <Flex width={"100%"} backgroundColor={"gray.700"} borderRadius={8} flexDirection={"column"}
              padding={window.innerWidth < 960 ? 4 : 8} marginBottom={4} marginTop={8}>
            <Text fontSize="48" fontWeight="bold" pb=".3rem" marginBottom={0}>The Easy Club NFTs</Text>

            <Text fontSize="16" pb=".3rem" marginBottom={0}>
                Browse The Easy Club Collection on <a
                href={'https://paintswap.finance/marketplace/collections/' + props.NFT_ADDRESS}
                target={"_blank"}
                style={{fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer'}}>PaintSwap</a>
            </Text>
            <Text fontSize={20}><b>Available To Mint:</b> {5000 - props.minted} / {props.maxSupply}
            </Text>

            <Flex flexDirection={"column"} marginTop={8}>
                <Text fontSize="32" fontWeight="bold" pb=".3rem" marginTop={0}>My
                    NFTs</Text>
                {/** NFT COUNT*/}
                {/*
                <Text fontSize={20}><b>Owned NFTs:</b> {props.userNftCount}</Text>
                <Text fontSize="16" pb=".3rem" marginBottom={0}>
                    You can see your NFTs on PaintSwap: <a
                    href={'https://paintswap.finance/marketplace/user'}
                    target={"_blank"}
                    style={{fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer'}}>See all my NFTs</a>
                </Text>
                */}
                <Grid templateColumns={window.innerWidth < 960 ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)'} gap={4}>
                    {parsedNFTs.map((item) =>
                        <a style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: "#fff",
                            width: 160,
                            height: 180,
                            margin: 4,
                            alignItems: 'center',
                            borderRadius: 8,
                            cursor: 'pointer'
                        }}
                           href={'https://paintswap.finance/marketplace/assets/0x5d6f546f2357e84720371a0510f64dbc3fbace33/' + item.name.slice(15)}
                           target={"_blank"}>
                            <img src={`data:image/svg+xml;base64,${item.image.slice(26)}`}
                                 style={{width: 140, height: 140}}/>
                            <Text style={{
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textAlign: 'center',
                                color: '#000'
                            }}>
                                {item.name}</Text>
                        </a>)}
                </Grid>
                {/** CLAIM REWARDS*/}
                <Text fontSize={20} marginBottom={2} marginTop={4}><b>Claimable
                    Reward:</b> ${(props.claimableReward / 1000000).toFixed(2)}</Text>
                <Button
                    bg={"#FFFFFF"}
                    p="0px"
                    variant="no-hover"
                    my={{sm: "0px", lg: "0px"}}
                    onClick={async () => {
                        await props.claimRewards()
                    }}
                    style={{width: "100%"}}
                    maxWidth={300}
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

            <Flex flexDirection={"column"} marginTop={16}>
                <Text fontSize="32" fontWeight="bold" pb=".3rem" marginTop={0}>Mint NFTs with Shares</Text>
                <Text fontSize={14} color={"gray.400"} marginBottom={4}>You can turn your shares into NFTs and trade
                    them on
                    the secondary market. Every The Easy Club NFT
                    can be minted with 50 shares and has a mint cost of 20 FTM. The Easy Club NFTs will receive rewards
                    as normal. Maximum of 20 NFTs can be minted at the same time.</Text>
                <Flex maxWidth={300} flexDirection={"column"}>
                    <Text fontSize={20}><b>Max NFTs you can mint:</b> {Math.floor(props.shareCount / 50)}
                    </Text>
                    <Flex marginBottom={4}>
                        <Text fontSize={20} fontWeight={"bold"} marginRight={4}>Mint Count: </Text>
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
            </Flex>

            <Flex flexDirection={"column"} marginTop={16}>
                <Text fontSize="32" fontWeight="bold" pb=".3rem" marginTop={0}>Mint NFTs with FTM</Text>
                <Text fontSize={14} color={"gray.400"} marginBottom={4}>You can also mint The Easy Club NFTs with 100
                    FTM without shares.
                    NFTs minted without shares won't earn any StrongBlock rewards.</Text>
                <Flex maxWidth={300} flexDirection={"column"}>
                    <Flex marginBottom={4}>
                        <Text fontSize={20} fontWeight={"bold"} marginRight={4}>Mint Count: </Text>
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
                                value={nftToMintFtm}
                                onChange={(e) => {
                                    setNftToMintFtm(e.target.value);
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "" || isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 1) {
                                        setNftToMintFtm(1);
                                    } else if (!(e.target.value === "" || isNaN(parseInt(e.target.value))) && parseInt(e.target.value) > 20) {
                                        setNftToMintFtm(20);
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
                            await props.mintNFTFtm(nftToMintFtm)
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
            </Flex>
        </Flex>
    );
}
