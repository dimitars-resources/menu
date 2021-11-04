import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  extendTheme,
  ScaleFade,
  Flex,
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Input,
  Center,
  Code,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import $ from "jquery";
import "../styles/index.css";
import { motion } from "framer-motion";

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
});

const GiveIcon = () => (
  <Icon
    viewBox="0 0 16 16"
    fill="currentcolor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7h6zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9H2.5z"></path>
  </Icon>
);

function App() {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalLimit, setModalLimit] = useState(0);

  const onLaunch = (e) => {
    var data = e.data;
    switch (data.action) {
      case "open-menu":
        setOpen(true);
        setItemsList(data.itemsList);
        break;

      case "close-menu":
        setOpen(false);
        break;
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Escape") {
      $.post("https://menu/close-menu", JSON.stringify({}));
    }
  };

  useEffect(() => {
    window.addEventListener("message", onLaunch);
    return () => {
      window.removeEventListener("message", onLaunch);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    var results = itemsList.filter((data) =>
      data.label.toLowerCase().includes(value)
    );
    setFiltered(results);
  };

  const handleGiveItem = (e) => {
    $.post(
      "https://menu/give-item",
      JSON.stringify({
        item: e.target.amount.id,
        amount: e.target.amount.value,
      })
    );
  };

  const handleModal = (e) => {
    setModalName(e.target.id);
    setModalLimit(e.target.name);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <ChakraProvider theme={theme}>
      {open ? (
        <ScaleFade initialScale={0.9} in={open}>
          <Flex
            justify={"center"}
            align={"center"}
            width={"100vw"}
            height={"100vh"}
          >
            <Box
              width={"50vw"}
              height={"60vh"}
              borderRadius={"md"}
              style={{ backgroundColor: "#1A202C" }}
              overflow={"hidden"}
            >
              <Tabs isFitted colorScheme={"blue"}>
                <TabList mb="1em">
                  <Tab fontWeight={"semibold"}>Items</Tab>
                  <Tab fontWeight={"semibold"}>Create</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Center>
                      <Input
                        width={"90%"}
                        height={"12"}
                        marginBottom={"2"}
                        minWidth={"0"}
                        fontSize={"lg"}
                        fontWeight={"semibold"}
                        variant="outline"
                        placeholder="🔍 Search"
                        colorScheme={"blue"}
                        onChange={handleSearch}
                      />
                    </Center>
                    <Box maxHeight={"47vh"} overflowY={"auto"}>
                      <Center>
                        <Flex
                          width={"90%"}
                          flexWrap={"wrap"}
                          justify={"center"}
                        >
                          {filtered
                            ? filtered.length > 0 &&
                              filtered.map(function (data) {
                                const { name, label, limit } = data;
                                return (
                                  <Button
                                    id={name}
                                    name={limit}
                                    onClick={handleModal}
                                    margin={"2"}
                                    colorScheme={"blue"}
                                  >
                                    {label}
                                  </Button>
                                );
                              })
                            : itemsList.map(function (data) {
                                const { name, label, limit } = data;
                                return (
                                  <Button
                                    id={name}
                                    name={limit}
                                    onClick={handleModal}
                                    margin={"2"}
                                    colorScheme={"blue"}
                                  >
                                    {label}
                                  </Button>
                                );
                              })}
                          <Modal
                            isOpen={modalOpen}
                            onClose={handleCloseModal}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>How much do you want?</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <motion.form onSubmit={handleGiveItem}>
                                  <Flex
                                    flexWrap={"nowrap"}
                                    justify={"space-between"}
                                  >
                                    <NumberInput
                                      defaultValue={1}
                                      min={1}
                                      max={modalLimit}
                                      size="md"
                                      maxW={24}
                                      marginRight={"2"}
                                      id={modalName}
                                      name="amount"
                                    >
                                      <NumberInputField />
                                      <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                      </NumberInputStepper>
                                    </NumberInput>
                                    <Button
                                      leftIcon={<GiveIcon />}
                                      colorScheme="green"
                                      size="md"
                                      width={400}
                                      type="submit"
                                    >
                                      Give
                                    </Button>
                                  </Flex>
                                </motion.form>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </Flex>
                      </Center>
                    </Box>
                  </TabPanel>
                  <TabPanel></TabPanel>
                </TabPanels>
              </Tabs>
              <Center>
                <Text fontWeight="500">
                  Made with ❤️ by Dimitar#3431
                </Text>
              </Center>
            </Box>
          </Flex>
        </ScaleFade>
      ) : (
        <></>
      )}
    </ChakraProvider>
  );
}

export default App;
