import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BiPlus } from "react-icons/bi";
import { TbReload } from "react-icons/tb";
import {
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
  FormLabel
} from "@chakra-ui/react";

import { crudApi } from "../../utils/api";
import { useDisclosure } from "../../hooks/disclosure";
import { useInternalData } from "../../contexts/internal";

export function HelpsView() {
  const queryClient = useQueryClient();
  const { helps, isHelpsLoading, helpKinds, isHelpKindsLoading } = useInternalData()

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReloadLoading, setIsReloadLoading] = useState(false);

  async function handleCreateKind ({ name, description }) {
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
    <section className="flex flex-col p-10 h-full">
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
          className="w-1/5"
          onClick={onOpen}
        >
          <Icon as={BiPlus} />
          <span className="pl-2">Criar tipo de ajuda</span>
        </Button>

        <Button
          colorScheme="blue"
          className="w-1/5 ml-5"
          onClick={reloadData}
        >
          { !isReloadLoading ? (<Icon as={TbReload} />) : null }

          <span className="pl-2">
            { isReloadLoading ? "Atualizando..." : "Atualizar dados" }
          </span>
        </Button>

        <CreateHelpKindModal isOpen={isOpen} onCancel={onClose} onSubmit={handleCreateKind} />
      </footer>
    </section >
  )
}

function HelpsTable({ helps }) {
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
          <th className="border w-1/4 text-lg">Usuário</th>
          <th className="border w-1/4 text-lg">Descrição</th>
          <th className="border w-1/4 text-lg">Tipo de ajuda</th>
          <th className="border w-1/4 text-lg">Data de registro</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          helps?.map((help) => (
            <tr key={help.id} className="flex w-full">
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">{ help.createdByName }</td>
              <td className="border p-2 w-1/4 text-md flex items-center justify-center">{ help.description }</td>
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">{ help.kind }</td>
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">{new Date(help.createdAt).toLocaleDateString('pt-br')}</td>
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
          <th className="border w-1/4 text-lg">Tipo</th>
          <th className="border w-1/4 text-lg">Descrição</th>
          <th className="border w-1/4 text-lg">Registro</th>
          <th className="border w-1/4 text-lg">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          helpKinds?.map((kind) => (
            <tr key={kind.id} className="flex w-full">
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">{ kind.name }</td>
              <td className="border p-2 w-1/4 text-md flex items-center justify-center">{ kind.description }</td>
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">
                <div className="flex flex-col">
                  <span className="text-lg">{ kind.createdBy }</span>
                  <span className="text-md">{new Date(kind.createdAt).toLocaleDateString('pt-br')}</span>
                </div>
              </td>
              <td className="border p-2 w-1/4 text-lg flex items-center justify-center">
                <div className="flex">
                  <a href="#" className="text-primary">Editar</a>
                  <span className="px-2">|</span>
                  <a href="#" className="text-red-500">Excluir</a>
                </div>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

function CreateHelpKindModal({ isOpen, onCancel, onSubmit, onChange = () => {}, errorMessage, isLoading }) {
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
            <Input
              placeholder="Descrição do tipo de ajuda"
              required
              value={description}
              onChange={({ target }) => { setDescription(target.value); onChange() }}
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
