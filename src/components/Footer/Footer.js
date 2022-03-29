/*eslint-disable*/
import React from "react";
import {Flex, Link, List, ListItem, Text} from "@chakra-ui/react";
import PropTypes from "prop-types";
import {FiTwitter} from "react-icons/fi";
import {BiBookBookmark} from "react-icons/bi";
import {AiFillGithub} from "react-icons/all";
import {FaDiscord} from "react-icons/all";
import {AiFillMediumSquare} from "react-icons/all";

export default function Footer(props) {
    // const linkTeal = useColorModeValue("teal.400", "red.200");=
    return (
        <div style={{padding: 16}}>
            <Flex
                flexDirection={{
                    base: "column",
                    xl: "row",
                }}
                alignItems={{
                    base: "center",
                    xl: "start",
                }}
                justifyContent="center"
                px="30px"
                pb="20px"

            >
                <List display="flex">
                    <ListItem
                        me={{
                            base: "20px",
                            md: "44px",
                        }}
                    >
                        <Link color="gray.400" href="https://twitter.com/easyblock_fin" target={'_blank'}>
                            <FiTwitter size={25}/>
                        </Link>
                    </ListItem>
                    <ListItem
                        me={{
                            base: "20px",
                            md: "44px",
                        }}
                    >
                        <Link color="gray.400" href="https://docs.easyblock.finance" target={'_blank'}>
                            <BiBookBookmark size={25}/>
                        </Link>
                    </ListItem>
                    <ListItem
                        me={{
                            base: "20px",
                            md: "44px",
                        }}
                    >
                        <Link color="gray.400" href="https://github.com/EasyBlock-Finance" target={'_blank'}>
                            <AiFillGithub size={25}/>
                        </Link>
                    </ListItem>
                    <ListItem
                        me={{
                            base: "20px",
                            md: "44px",
                        }}
                    >
                        <Link color="gray.400" href="https://discord.gg/kcShzPgxT9" target={'_blank'}>
                            <FaDiscord size={25}/>
                        </Link>
                    </ListItem>
                    <ListItem
                        me={{
                            base: "20px",
                            md: "44px",
                        }}
                    >
                        <Link color="gray.400" href="https://medium.com/easyblock" target={'_blank'}>
                            <AiFillMediumSquare size={25}/>
                        </Link>
                    </ListItem>
                </List>
            </Flex>
            <p style={{textAlign: 'center', fontSize: 12, color: "#ff7f7", marginTop: 32}}>
                Use of easyblock.finance (the “Site”) and the Easyblock protocol (the “Protocol”) is strictly at your
                own risk.
                Before using the Protocol, users should fully understand and accept the risks involved, which
                include,
                but are not limited to, front-end errors, bugs, hacks, regulatory and tax uncertainty, and total
                loss of
                funds. Do not deploy funds you cannot afford to lose. The Protocol is unaudited yet and involves a
                substantial degree of risk. No representations or warranties are made as to the safety of funds
                deployed, and easyblock.finance will not be liable or responsible for any losses incurred. By using the
                Site or
                the
                Protocol, you represent and warrant that your use does not violate any law, rule or regulation in
                your
                jurisdiction of residence. We are not affiliated with Strongblock and not liable for any losses which
                could be incurred by them.
            </p>
            <p style={{cursor: "pointer", textAlign: "center", fontSize: 14, color: "#ff7f7", marginTop: 8, textDecoration:"underline"}}><a
                href={"https://drive.google.com/file/d/1gabHyca4TJOvfrNWvFpbWRY02bZGlzdq/view?usp=sharing"}
                target={"_blank"}
            >Terms of
                Service</a></p>
        </div>
    );
}
