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
  Input,
  Center,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Spacer,
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
  const [modalClearOpen, setModalClearOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalEditName, setModalEditName] = useState("");
  const [modalEditLabel, setModalEditLabel] = useState("");
  const [modalEditWeight, setModalEditWeight] = useState(0);
  const [modalEditLimit, setModalEditLimit] = useState(0);
  const [modalDeleteName, setModalDeleteName] = useState("");
  const [modalLimit, setModalLimit] = useState(0);
  const [usingLimit, setUsingLimit] = useState(false);
  const [usingWeight, setUsingWeight] = useState(false);
  const [resourceName, setResourceName] = useState("menu");
  const [itemsCount, setItemsCount] = useState(0);
  const [menuWidth, setMenuWidth] = useState(50);
  const [menuHeight, setMenuHeight] = useState(35);
  const [locales, setLocales] = useState([]);

  const onLaunch = (e) => {
    var data = e.data;
    switch (data.action) {
      case "open-menu":
        setResourceName(data.name);
        setItemsList(data.itemsList);
        setUsingLimit(data.limit);
        setUsingWeight(data.weight);
        setItemsCount(data.itemsList.length);
        setMenuWidth(data.width);
        setMenuHeight(data.height);
        setOpen(true);
        break;

      case "close-menu":
        setFiltered(null);
        setOpen(false);
        break;
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Escape") {
      $.post(`https://${resourceName}/close-menu`, JSON.stringify({}));
    }
  };

  useEffect(() => {
    fetch("../locales.json")
    .then(response => response.json())
    .then(json => setLocales(json));
  }, [])

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

  // Credit to: chezza#1234
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    var results = itemsList.filter((data) =>
      data.label.toLowerCase().includes(value)
    );
    setFiltered(results);
  };

  const handleGiveItem = (e) => {
    $.post(
      `https://${resourceName}/give-item`,
      JSON.stringify({
        item: e.target.amount.id,
        amount: e.target.amount.value,
      })
    );
  };

  const handleCreateItem = (e) => {
    $.post(
      `https://${resourceName}/create-item`,
      JSON.stringify({
        name: e.target.name.value,
        label: e.target.label.value,
        weight: e.target.weight.value,
        limit: e.target.limit.value,
        isLimit: usingLimit,
        isWeight: usingWeight,
      })
    );
  };

  const handleClearInventory = (e) => {
    setModalClearOpen(false);
    $.post(`https://${resourceName}/clear-inventory`, JSON.stringify({}));
  };

  const handleEditItem = (e) => {
    $.post(
      `https://${resourceName}/edit-item`,
      JSON.stringify({
        prevName: modalEditName,
        name: e.target.name.value,
        label: e.target.label.value,
        weight: e.target.weight.value,
        limit: e.target.limit.value,
        isLimit: usingLimit,
        isWeight: usingWeight,
      })
    );
  };

  const handleDeleteItem = (e) => {
    setModalDeleteOpen(false);
    $.post(
      `https://${resourceName}/delete-item`,
      JSON.stringify({
        name: modalDeleteName
      })
    );
  };

  const handleModal = (e) => {
    setModalName(e.target.id);
    if (usingLimit) {
      setModalLimit(e.target.name);
    } else {
      setModalLimit(1000);
    }
    setModalOpen(true);
  };

  const handleEditModal = (name, label, limit, weight) => {
    setModalEditName(name);
    setModalEditLabel(label);
    setModalEditLimit(limit);
    setModalEditWeight(weight);
    setModalEditOpen(true);
  };

  const handleDeleteModal = (name) => {
    setModalDeleteName(name);
    setModalDeleteOpen(true);
  };

  const handleModalClear = (e) => {
    setModalClearOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  }

  const handleCloseModalDelete = () => {
    setModalDeleteOpen(false);
  }

  const handleCloseModalClear = () => {
    setModalClearOpen(false);
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
              width={menuWidth + "vw"}
              height={menuHeight + "vh"}
              borderRadius={"md"}
              style={{ backgroundColor: "#1A202C" }}
              overflow={"hidden"}
            >
              <Tabs isFitted colorScheme={"blue"}>
                <TabList mb="1em">
                  <Tab fontWeight={"semibold"}>{locales.itemsTab ? locales.itemsTab : 'Items'}</Tab>
                  <Tab fontWeight={"semibold"}>{locales.createTab ? locales.createTab : 'Create'}</Tab>
                  <Tab fontWeight={"semibold"}>{locales.informationTab ? locales.informationTab : 'Information'}</Tab>
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
                        placeholder={locales.searchPlaceholder ? locales.searchPlaceholder : '🔍 Search'}
                        colorScheme={"blue"}
                        onChange={handleSearch}
                      />
                    </Center>
                    <Box maxHeight={menuHeight - 10 + "vh"} overflowY={"auto"}>
                      <Center>
                        <Flex
                          width={"90%"}
                          flexWrap={"wrap"}
                          justify={"center"}
                        >
                          {filtered ? (
                            filtered.length == 0 && (
                              <Center>
                                <Alert
                                  status="error"
                                  borderRadius={"md"}
                                  fontWeight={"500"}
                                  marginTop={"2"}
                                >
                                  <AlertIcon />
                                  {locales.noItemsWithThatName ? locales.noItemsWithThatName : 'Cannot find any item by that name.'}
                                </Alert>
                              </Center>
                            )
                          ) : (
                            <></>
                          )}

                          {filtered
                            ? filtered.length > 0 &&
                              filtered.map(function (data) {
                                const { name, label, limit, weight } = data;
                                return (
                                  <Button
                                    id={name}
                                    name={limit}
                                    onClick={handleModal}
                                    margin={"2"}
                                    colorScheme={"blue"}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      handleEditModal(name, label, limit, weight);
                                    }}
                                    onMouseDown={(e) => {
                                      if (e.button === 1) {
                                        e.preventDefault();
                                        
                                        handleDeleteModal(name);
                                      }
                                    }}
                                  >
                                    {label}
                                  </Button>
                                );
                              })
                            : itemsList.map(function (data) {
                                const { name, label, limit, weight } = data;
                                return (
                                  <Button
                                    id={name}
                                    name={limit}
                                    onClick={handleModal}
                                    margin={"2"}
                                    colorScheme={"blue"}
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      handleEditModal(name, label, limit, weight);
                                    }}
                                    onMouseDown={(e) => {
                                      if (e.button === 1) {
                                        e.preventDefault();
                                        
                                        handleDeleteModal(name);
                                      }
                                    }}
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
                              <ModalHeader>{locales.giveModalHeader ? locales.giveModalHeader : 'How much do you want?'}</ModalHeader>
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
                                      {locales.giveButton ? locales.giveButton : 'Give'}
                                    </Button>
                                  </Flex>
                                </motion.form>
                              </ModalBody>
                            </ModalContent>
                          </Modal>

                          <Modal
                            isOpen={modalEditOpen}
                            onClose={handleCloseEditModal}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Edit item</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <motion.form onSubmit={handleEditItem}>
                                  <Flex wrap={"wrap"}>
                                    <Text
                                      marginBottom={"1"}
                                      fontSize={"md"}
                                      fontWeight={"semibold"}
                                    >
                                      {locales.itemName ? locales.itemName : 'Name'}
                                    </Text>
                                    <Input
                                      width={"100%"}
                                      height={"12"}
                                      marginBottom={"2"}
                                      minWidth={"0"}
                                      fontSize={"lg"}
                                      fontWeight={"semibold"}
                                      variant="outline"
                                      defaultValue={modalEditName}
                                      colorScheme={"blue"}
                                      name="name"
                                      required
                                    ></Input>
                                  </Flex>

                                  <Flex wrap={"wrap"}>
                                    <Text
                                      marginBottom={"1"}
                                      fontSize={"md"}
                                      fontWeight={"semibold"}
                                    >
                                      {locales.itemLabel ? locales.itemLabel : 'Label'}
                                    </Text>
                                    <Input
                                      width={"100%"}
                                      height={"12"}
                                      marginBottom={"2"}
                                      minWidth={"0"}
                                      fontSize={"lg"}
                                      fontWeight={"semibold"}
                                      variant="outline"
                                      defaultValue={modalEditLabel}
                                      colorScheme={"blue"}
                                      name="label"
                                      required
                                    ></Input>
                                  </Flex>

                                  <Flex wrap={"nowrap"}>
                                    <Flex wrap={"wrap"}>
                                      <Text
                                        marginBottom={"1"}
                                        fontSize={"md"}
                                        fontWeight={"semibold"}
                                      >
                                        {locales.itemWeight ? locales.itemWeight : 'Weight'}
                                      </Text>
                                      <NumberInput
                                        defaultValue={modalEditWeight || 0.0}
                                        min={0.0}
                                        max={1000.0}
                                        precision={2}
                                        size="md"
                                        marginBottom={"4"}
                                        marginRight={"2"}
                                        width={"99%"}
                                        name="weight"
                                        isDisabled={!usingWeight}
                                      >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Flex>
                                    <Flex wrap={"wrap"}>
                                      <Text
                                        marginBottom={"1"}
                                        fontSize={"md"}
                                        fontWeight={"semibold"}
                                      >
                                        {locales.itemLimit ? locales.itemLimit : 'Limit'}
                                      </Text>
                                      <NumberInput
                                        defaultValue={modalEditLimit || 1}
                                        min={1}
                                        max={1000}
                                        size="md"
                                        marginBottom={"4"}
                                        width={"99%"}
                                        name="limit"
                                        isDisabled={!usingLimit}
                                      >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                          <NumberIncrementStepper />
                                          <NumberDecrementStepper />
                                        </NumberInputStepper>
                                      </NumberInput>
                                    </Flex>
                                  </Flex>

                                  <Flex justify="space-between" wrap="nowrap" mb="3" mt="4">
                                    <Button
                                      colorScheme="green"
                                      type="submit"
                                      width={"49%"}
                                      marginRight={"1%"}
                                    >
                                      {locales.confirmEditModal ? locales.confirmEditModal : 'Edit'}
                                    </Button>
                                    <Button
                                      onClick={handleCloseEditModal}
                                      colorScheme="red"
                                      width={"49%"}
                                    >
                                      {locales.cancelEditModal ? locales.cancelEditModal : 'Cancel'}
                                    </Button>
                                  </Flex>
                                </motion.form>
                              </ModalBody>
                            </ModalContent>
                          </Modal>

                          <Modal
                            onClose={handleCloseModalDelete}
                            isOpen={modalDeleteOpen}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>{locales.deleteModalHeader ? locales.deleteModalHeader : 'Delete item with name:'} {modalDeleteName}</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <Flex justify="space-between" wrap="nowrap">
                                  <Button
                                    onClick={handleDeleteItem}
                                    colorScheme="red"
                                    width={"49%"}
                                    marginRight={"1%"}
                                  >
                                    {locales.confirmDeleteModal ? locales.confirmDeleteModal : 'Delete'}
                                  </Button>
                                  <Button
                                    onClick={handleCloseModalDelete}
                                    colorScheme="blue"
                                    width={"49%"}
                                  >
                                    {locales.cancelDeleteModal ? locales.cancelDeleteModal : 'Cancel'}
                                  </Button>
                                </Flex>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        </Flex>
                      </Center>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Center>
                      <motion.form onSubmit={handleCreateItem}>
                        <Center>
                          <Text
                            marginBottom={"2"}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                          >
                            {locales.createTabHeader ? locales.createTabHeader : 'Create new item'}
                          </Text>
                        </Center>
                        <Flex wrap={"wrap"}>
                          <Text
                            marginBottom={"1"}
                            fontSize={"md"}
                            fontWeight={"semibold"}
                          >
                            {locales.itemName ? locales.itemName : 'Name'}
                          </Text>
                          <Input
                            width={"100%"}
                            height={"12"}
                            marginBottom={"2"}
                            minWidth={"0"}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            variant="outline"
                            placeholder={locales.itemNamePlaceholder ? locales.itemNamePlaceholder : 'bread'}
                            colorScheme={"blue"}
                            name="name"
                            required
                          ></Input>
                        </Flex>
                        <Flex wrap={"wrap"}>
                          <Text
                            marginBottom={"1"}
                            fontSize={"md"}
                            fontWeight={"semibold"}
                          >
                            {locales.itemLabel ? locales.itemLabel : 'Label'}
                          </Text>
                          <Input
                            width={"100%"}
                            height={"12"}
                            marginBottom={"2"}
                            minWidth={"0"}
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            variant="outline"
                            placeholder={locales.itemLabelPlaceholder ? locales.itemLabelPlaceholder : 'Bread'}
                            colorScheme={"blue"}
                            name="label"
                            required
                          ></Input>
                        </Flex>
                        <Flex wrap={"nowrap"}>
                          <Flex wrap={"wrap"}>
                            <Text
                              marginBottom={"1"}
                              fontSize={"md"}
                              fontWeight={"semibold"}
                            >
                              {locales.itemWeight ? locales.itemWeight : 'Weight'}
                            </Text>
                            <NumberInput
                              defaultValue={0.0}
                              min={0.0}
                              max={1000.0}
                              precision={2}
                              size="md"
                              marginBottom={"4"}
                              marginRight={"2"}
                              width={"99%"}
                              name="weight"
                              isDisabled={!usingWeight}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Flex>
                          <Flex wrap={"wrap"}>
                            <Text
                              marginBottom={"1"}
                              fontSize={"md"}
                              fontWeight={"semibold"}
                            >
                              {locales.itemLimit ? locales.itemLimit : 'Limit'}
                            </Text>
                            <NumberInput
                              defaultValue={1}
                              min={1}
                              max={1000}
                              size="md"
                              marginBottom={"4"}
                              width={"99%"}
                              name="limit"
                              isDisabled={!usingLimit}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Flex>
                        </Flex>
                        <Button
                          colorScheme="green"
                          size="md"
                          type="submit"
                          width={"100%"}
                          marginBottom={"2"}
                        >
                          {locales.createButton ? locales.createButton : 'Create'}
                        </Button>
                      </motion.form>
                    </Center>
                  </TabPanel>
                  <TabPanel>
                    <Center>
                      <Alert status="info" width={"50%"} borderRadius={"md"}>
                        <AlertIcon />
                        {locales.totalItemsCount ? locales.totalItemsCount : 'Total items count'}: {itemsCount}
                        <Spacer />
                        <Button
                          onClick={handleModalClear}
                          colorScheme="red"
                          size="sm"
                        >
                          {locales.clearInventory ? locales.clearInventory : 'Clear Inventory'}
                        </Button>
                      </Alert>
                    </Center>

                    <Modal
                      onClose={handleCloseModalClear}
                      isOpen={modalClearOpen}
                      isCentered
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>{locales.clearModalHeader ? locales.clearModalHeader : 'Are you sure?'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Flex justify="space-between" wrap="nowrap">
                            <Button
                              onClick={handleClearInventory}
                              colorScheme="green"
                              width={"49%"}
                              marginRight={"1%"}
                            >
                              {locales.confirmClearModal ? locales.confirmClearModal : 'Confirm'}
                            </Button>
                            <Button
                              onClick={handleCloseModalClear}
                              colorScheme="red"
                              width={"49%"}
                            >
                              {locales.cancelClearModal ? locales.cancelClearModal : 'Cancel'}
                            </Button>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  </TabPanel>
                </TabPanels>
              </Tabs>
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
