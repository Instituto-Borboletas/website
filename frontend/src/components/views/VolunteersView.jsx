import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Stack,
  Spinner,
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
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerCloseButton,
  DrawerOverlay,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import { TbReload } from "react-icons/tb";

import { crudApi } from "../../utils/api";
import { useDisclosure } from "../../hooks/disclosure";
import { useInternalData } from "../../contexts/internal";

export function VolunteersView() {
  const queryClient = useQueryClient();
  const { volunteers, isVolunteersLoading, volunteerKinds, isVolunteerKindsLoading } = useInternalData();

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [isReloadLoading, setIsReloadLoading] = useState(false);

  async function handleCreateKind ({ name, description }) {
    const { data } = await crudApi.post("/volunteers/kinds", { name, description });

    queryClient.setQueryData(["volunteerKinds"], (oldData) => {
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
    await queryClient.invalidateQueries(["volunteers", "volunteerKinds"]);
    setIsReloadLoading(false);
  }

  return (
    <section className="flex flex-col p-4 md:p-10 h-full">
      <h1 className="text-3xl font-bold">Voluntários</h1>

      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-10">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Voluntários registrados</h2>
          <p className="text-3xl text-primary mt-2">
            {
              isVolunteersLoading
                ? "Carregando..."
                : volunteers?.data.length
            }
          </p>
        </div>
      </header>

      <main className="w-full mt-10">
        <div className="overflow-x-auto">
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Voluntários</Tab>
              <Tab>Tipos</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <div className="overflow-x-auto">
                  {
                    isVolunteersLoading
                      ? (<p>Carregando...</p>)
                      : (<VolunteersTable volunteers={volunteers.data} />)
                  }
                </div>
              </TabPanel>

              <TabPanel>
                <div className="overflow-x-auto">
                  {
                    isVolunteerKindsLoading
                      ? (<p>Carregando...</p>)
                      : (<VolunteerKindsTable kinds={volunteerKinds.data} />)
                  }
                </div>
              </TabPanel>
            </TabPanels >
          </Tabs >
        </div>
      </main>

      <footer className="mt-auto">
        <Button
          colorScheme="green"
          className="w-1/3 sm:w-1/4"
          onClick={onOpen}
        >
          <span className="hidden md:block">
            <Icon as={BiPlus}/>
          </span>
          <span className="md:pl-2">Criar um tipo</span>
        </Button>

        <Button
          colorScheme="blue"
          className="w-1/2 sm:w-1/3 ml-5"
          onClick={reloadData}
        >
          { !isReloadLoading ? (<Icon as={TbReload} />) : null }

          <span className="pl-2">
            { isReloadLoading ? "Atualizando..." : "Atualizar dados" }
          </span>
        </Button>

        <CreateVolunteerKindModal isOpen={isOpen} onCancel={onClose} onSubmit={handleCreateKind} />
      </footer>
    </section>
  )
}

function VolunteersTable({ volunteers }) {
  const { isOpen: showDetail, onOpen: openDetail, onClose: closeDetail } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [detailData, setDetailData] = useState({})

  async function openDetailModal (volunteer) {
    openDetail()
    try {
      setIsLoading(true)
      const { data } = await crudApi.get(`/users/detail/${volunteer.createdBy}`)
      setDetailData({ ...data, volunteer })
      setIsError(false)
    } catch (err) {
      setIsError(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (volunteers.length === 0)
    return ( <p>Nenhum voluntário registrado até o momento.</p>)

  return (
    <table className="min-w-full rounded border border-1 border-zinc-200">
      <thead className="bg-zinc-200 text-primary block w-full">
        <tr className="flex w-full">
          <th className="border w-1/3 md:w-1/4 text-lg">Nome</th>
          <th className="border hidden md:block w-1/4 text-lg">Contato</th>
          <th className="border w-1/3 md:w-1/4 text-lg">Tipo de voluntariado</th>
          <th className="border w-1/3 md:w-1/4 text-lg">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          volunteers.map((volunteer) => (
            <tr key={volunteer.id} className="flex w-full">
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">{ volunteer.name }</td>
              <td className="border p-2 hidden md:w-1/4 text-lg md:flex items-center justify-center">
                <div className="flex flex-col">
                  <span>{ volunteer.phone }</span>
                  <span>{ volunteer.email }</span>
                </div>
              </td>
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">{ volunteer.kindName }</td>
              <td className="border p-2 w-1/3 md:w-1/4 text-lg flex items-center justify-center">
                <Button colorScheme="blue" size="sm" onClick={() => openDetailModal(volunteer)}>Detalhar</Button>

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

function VolunteerKindsTable({ kinds }) {
  if (kinds.length === 0)
    return ( <p>Nenhum tipo de voluntário registrado até o momento.</p>)

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
          kinds.map((kind) => (
            <tr key={kind.id} className="flex w-full">
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{ kind.name }</td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{ kind.description }</td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                <div className="flex flex-col">
                  <span>{ kind.created_by_name }</span>
                  <span>{ new Date(kind.createdAt ?? kind.created_at).toLocaleDateString('pt-br') }</span>
                </div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

function CreateVolunteerKindModal({ isOpen, onCancel, onSubmit, onChange = () => {}, errorMessage, isLoading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const initialRef = useRef();

  async function submitForm () {
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
        <ModalHeader>Criar um tipo de voluntariado!</ModalHeader>
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
              placeholder="Nome do tipo de voluntariado"
              required
              value={name}
              onChange={({ target }) => { setName(target.value); onChange() }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              placeholder="Descrição do tipo de voluntariado"
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
            { isLoading ? "Criando..." : "Criar" }
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


function DetailDrawer({ isOpen, data, onClose, isLoading, isError }) {
  async function changeStatus() {
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
                  <h1 className="font-bold text-xl">Dados do voluntário</h1>
                  <FormControl mt={4}>
                    <FormLabel>Nome</FormLabel>
                    <Input disabled value={data.volunteer?.name} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Tipo de voluntariado</FormLabel>
                    <Input disabled value={data.volunteer?.kindName} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Contato</FormLabel>
                    <Input disabled value={data.volunteer?.email || data.email} />
                    <Input className="mt-2" disabled value={data.volunteer?.phone} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Data de registro</FormLabel>
                    <Input disabled value={new Date(data.volunteer?.createdAt).toLocaleDateString()} />
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

                  <FormControl mt={4}>
                    <FormLabel>Telefone</FormLabel>
                    <Input disabled value={data.phone} />
                  </FormControl>
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
