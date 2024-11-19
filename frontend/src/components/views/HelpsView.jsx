import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BiPlus } from "react-icons/bi";
import { TbReload } from "react-icons/tb";
import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  Spinner,
} from "@chakra-ui/react";

import { crudApi } from "../../utils/api";
import { useDisclosure } from "../../hooks/disclosure";
import { useInternalData } from "../../contexts/internal";

export function HelpsView() {
  const queryClient = useQueryClient();
  const { helps, isHelpsLoading, helpKinds, isHelpKindsLoading } = useInternalData()

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReloadLoading, setIsReloadLoading] = useState(false);

  async function handleCreateKind({ name, description }) {
    const { data } = await crudApi.post("/helps/kinds", { name, description });

    queryClient.setQueryData(["helpKinds"], (oldData) => {
      return {
        ...oldData,
        data: [
          ...oldData.data,
          data
        ]
      }
    })
  }

  async function reloadData(event) {
    event.preventDefault();

    setIsReloadLoading(true);
    await queryClient.invalidateQueries(["helps", "helpKinds"]);
    setIsReloadLoading(false);
  }

  return (
    <section className="flex flex-col p-4 md:p-10 h-full">
      <h1 className="text-3xl font-bold">Ajudas</h1>

      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-5">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Pedidos de ajuda registrados</h2>
          <p className="text-3xl text-primary mt-2">
            {
              isHelpsLoading
                ? "Carregando..."
                : helps?.data.length
            }
          </p>
        </div>
      </header>

      <main className="w-full mt-5">
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Pedidos</Tab>
            <Tab>Tipos</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="overflow-x-auto">
                {
                  isHelpsLoading
                    ? (<p>Carregando...</p>)
                    : (<HelpsTable helps={helps?.data} />)
                }
              </div>
            </TabPanel>

            <TabPanel>
              <div className="overflow-x-auto">
                {
                  isHelpKindsLoading
                    ? (<p>Carregando...</p>)
                    : (<HelpKindsTable helpKinds={helpKinds?.data} />)
                }
              </div>
            </TabPanel>
          </TabPanels >
        </Tabs >
      </main >

      <footer className="mt-auto">
        <Button
          colorScheme="green"
          className="w-1/3 md:w-1/5"
          onClick={onOpen}
        >
          <Icon as={BiPlus} />
          <span className="pl-2">Criar tipo</span>
        </Button>

        <Button
          colorScheme="blue"
          className="w-1/2 sm:w-1/3 ml-5"
          onClick={reloadData}
        >
          {!isReloadLoading ? (<Icon as={TbReload} />) : null}

          <span className="pl-2">
            {isReloadLoading ? "Atualizando..." : "Atualizar dados"}
          </span>
        </Button>

        <CreateHelpKindModal isOpen={isOpen} onCancel={onClose} onSubmit={handleCreateKind} />
      </footer>
    </section >
  )
}

function HelpsTable({ helps }) {
  const { isOpen: showDetail, onOpen: openDetail, onClose: closeDetail } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [detailData, setDetailData] = useState({})

  async function fetchDetail(userId, help) {
    try {
      setIsLoading(true)
      const { data } = await crudApi.get(`/users/detail/${userId}`)
      setDetailData({ ...data, help, extra: data.extra ?? {}, address: data.address ?? {} })
      setIsLoading(false)
      setIsError(false)
    } catch (err) {
      setIsError(err)
      setIsLoading(true)
    }
  }

  function openDetailModal(help) {
    fetchDetail(help.createdBy, help)
    openDetail()
  }

  if (helps.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-full flex-1">
        <p>Nenhum pedido de ajuda registrado até o momento.</p>
      </section>
    )
  }

  return (
    <table className="min-w-full rounded border border-1 border-zinc-200">
      <thead className="bg-zinc-200 text-primary block w-full">
        <tr className="flex w-full">
          <th className="border w-1/3 md:w-1/4 text-lg">Usuário</th>
          <th className="border hidden md:block md:w-1/4 text-lg">Descrição</th>
          <th className="border w-1/3 md:w-1/4 text-lg">Tipo de ajuda</th>
          <th className="border w-1/3 md:w-1/4 text-lg">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          helps?.map((help) => (
            <tr key={help.id} className="flex w-full">
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">{help.createdByName}</td>
              <td className="border p-2 hidden md:flex w-1/4 text-md items-center justify-center">{help.description}</td>
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">{help.kind}</td>
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">
                <Button colorScheme="blue" size="sm" onClick={() => openDetailModal(help)}>Detalhar</Button>

                <DetailDrawer
                  isOpen={showDetail}
                  onClose={closeDetail}
                  isError={isError}
                  isLoading={isLoading}
                  data={detailData}
                  onConfirm={(...params) => console.info("submit on detail", ...params)}
                />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

function HelpKindsTable({ helpKinds }) {

  if (helpKinds.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center h-full flex-1">
        <p>Nenhum tipo de ajuda registrado até o momento.</p>
      </section>
    )
  }
  return (
    <table className="min-w-full rounded border border-1 border-zinc-200">
      <thead className="bg-zinc-200 text-primary block w-full">
        <tr className="flex w-full">
          <th className="border w-1/3 text-lg">Tipo</th>
          <th className="border w-1/3 text-lg">Descrição</th>
          <th className="border w-1/3 text-lg">Registro</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          helpKinds?.map((kind) => (
            <tr key={kind.id} className="flex w-full">
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{kind.name}</td>
              <td className="border p-2 w-1/3 text-md flex items-center justify-center">{kind.description}</td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                <div className="flex flex-col">
                  <span className="text-lg">{kind.username}</span>
                  <span className="text-md">{new Date(kind.createdAt ?? kind.created_at).toLocaleDateString('pt-br')}</span>
                </div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

function CreateHelpKindModal({ isOpen, onCancel, onSubmit, onChange = () => { }, errorMessage, isLoading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const initialRef = useRef();

  async function submitForm() {
    await onSubmit({ name, description });

    setName("");
    setDescription("");
    onCancel();
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={onCancel}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar um tipo de ajuda!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {
            errorMessage && (
              <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )
          }

          <FormControl mt={4} isRequired>
            <FormLabel>Nome</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Nome do tipo de ajuda"
              required
              value={name}
              onChange={({ target }) => { setName(target.value); onChange() }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              placeholder="Descrição do tipo de ajuda"
              required
              value={description}
              onChange={({ target }) => { setDescription(target.value); onChange() }}
              resize="none"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={submitForm}
            isDisabled={errorMessage || isLoading}
          >
            {isLoading ? "Criando..." : "Criar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function DetailDrawer({ isOpen, data, onClose, isLoading, isError }) {
  async function changeStatus() {
  }

  function incomeLabel(incomeString) {
    const labels = {
      "-1000": "Até R$ 1000",
      "1001-2000": "De R$ 1001 até R$ 2000",
      "2001-3000": "De R$ 2001 até R$ 5000",
      "5000-": "De R$ 2001 até R$ 5000"
    }

    return labels[incomeString]
  }

  function housingLabel(housingString) {
    const labels = {
      "rent": "Aluguel",
      "own": "Própria",
      "minhacasaminhavida": "Própria pelo Minha casa minha vida",
      "given": "Cedida",
    }

    return labels[housingString]
  }

  function workLabel(workString) {
    const labels = {
      "formal": "Formal",
      "informal": "Informal",
      "unemployed": "Desempregada"
    }

    return labels[workString]
  }

  function relationLabel(relationString) {

    const labels = {
      "maried": "Casamento",
      "stable_union": "União estável",
      "affair": "Namoro",
      "ex": "Ex namorado/companheiro",
      "not_apply": "Não se aplica"
    }
    return labels[relationString]
  }

  if (!isOpen) return null

  return (
    <Drawer
      blockScrollOnMount={true}
      isOpen={true}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
      size="xl"
      className="md:max-h-[50vh]"
    >

      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Detalhe</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {
            isLoading
              ? (
                <Spinner />
              )
              : (
                <>
                  <h1 className="font-bold text-xl">Dados do pedido de ajuda</h1>
                  <FormControl mt={4}>
                    <FormLabel>Tipo de ajuda</FormLabel>
                    <Input disabled value={data.help?.kind} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Descrição do pedido</FormLabel>
                    <Textarea
                      type="text"
                      resize="none"
                      disabled
                      value={data.help?.description}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Data do pedido</FormLabel>
                    <Input disabled value={new Date(data.help?.createdAt).toLocaleDateString()} />
                  </FormControl>


                  <h1 className="mt-10 font-bold text-xl">Dados do usuário</h1>
                  <FormControl mt={4}>
                    <FormLabel>Nome completo</FormLabel>
                    <Input disabled value={data.name} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Email</FormLabel>
                    <Input disabled value={data.email} />
                  </FormControl>

                  <FormControl mt={4} isRequired>
                    <FormLabel>Telefone para contato</FormLabel>
                    <Input value={data.extra.phone} disabled />
                  </FormControl>

                  <Stack mt={4} display="flex" flexDir="row">
                    <FormControl isRequired>
                      <FormLabel>CPF</FormLabel>
                      <Input value={data.extra.cpf} disabled />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Data de nascimento</FormLabel>
                      <Input value={new Date(data.extra.birthDate).toLocaleDateString()} disabled />
                    </FormControl>
                  </Stack>

                  {data.extra.adultChildren > 0 && (
                    <FormControl mt={4}>
                      <FormLabel>Quantidade de filhos maiores de 18 anos</FormLabel>
                      <Input disabled value={data.extra.adultChildren} type="number" />
                    </FormControl>
                  )}

                  {data.extra.kidChildren > 0 && (
                    <FormControl mt={4}>
                      <FormLabel>Quantidade de filhos menores de 18 anos</FormLabel>
                      <Input disabled value={data.extra.kidChildren} type="number" />
                    </FormControl>
                  )}

                  <FormControl mt={4} isRequired>
                    <FormLabel>Tipo de trabalho</FormLabel>
                    <Input value={workLabel(data.extra.work)} disabled />
                  </FormControl>

                  <FormControl mt={4} isRequired>
                    <FormLabel>Renda</FormLabel>
                    <Input value={incomeLabel(data.extra.income)} disabled />
                  </FormControl>

                  <FormControl mt={4} isRequired>
                    <FormLabel>Tipo de moradia</FormLabel>
                    <Input value={housingLabel(data.extra.housing)} disabled />
                  </FormControl>

                  <FormControl mt={4} isRequired>
                    <FormLabel>Tipo de relacionamento</FormLabel>
                    <Input value={relationLabel(data.extra.relation)} disabled />
                  </FormControl>

                  <Stack mt={8}>
                    <h1>Endereço</h1>

                    <Stack display="flex" flexDir="row">
                      <FormControl isRequired className="w-1/2">
                        <FormLabel>CEP</FormLabel>
                        <Input value={data.address.zip} disabled />

                      </FormControl>
                      <FormControl isRequired className="w-1/2">
                        <FormLabel>Cidade</FormLabel>
                        <Input value={data.address.city} disabled />
                      </FormControl>
                    </Stack>

                    <Stack display="flex" flexDir="row">
                      <FormControl isRequired className="w-1/2">
                        <FormLabel>Rua</FormLabel>
                        <Input value={data.address.street} disabled />
                      </FormControl>

                      <FormControl isRequired className="w-1/2">
                        <FormLabel>Bairro</FormLabel>
                        <Input value={data.address.neighborhood} disabled />
                      </FormControl>
                    </Stack>

                    <Stack display="flex" flexDir="row">
                      <FormControl w="80%" isRequired>
                        <FormLabel>Complemento</FormLabel>
                        <Input value={data.address.complement} disabled />
                      </FormControl>

                      <FormControl w="20%" isRequired>
                        <FormLabel>Nº</FormLabel>
                        <Input value={data.address.number} disabled />
                      </FormControl>
                    </Stack>

                    {data.address.description && (
                      <FormControl>
                        <FormLabel>Descrição</FormLabel>
                        <Textarea
                          type="text"
                          resize="none"
                          disabled
                          value={data.address.description}
                        />
                      </FormControl>
                    )}
                  </Stack>

                  <Stack mt={8}>
                    <h1>Contato de confiança</h1>
                    <Stack display="flex" flexDir="row">
                      <FormControl className="w-1/2">
                        <FormLabel>Nome</FormLabel>
                        <Input value={data.extra.trustedName} disabled />
                      </FormControl>

                      <FormControl className="w-1/2">
                        <FormLabel>Número</FormLabel>
                        <Input value={data.extra.trustedPhone} disabled />
                      </FormControl>
                    </Stack>
                  </Stack>
                </>
              )}
        </DrawerBody>

        <DrawerFooter>
          {/*
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={changeStatus}
            >
              Salvar
            </Button>
          */}

          <Button
            variant="ghost"
            onClick={onClose}
          >
            Fechar
          </Button>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
