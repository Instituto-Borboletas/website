import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  FormLabel,
  Textarea
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
  if (volunteers.length === 0)
    return ( <p>Nenhum voluntário registrado até o momento.</p>)

  return (
    <table className="min-w-full rounded border border-1 border-zinc-200">
      <thead className="bg-zinc-200 text-primary block w-full">
        <tr className="flex w-full">
          <th className="border w-1/4 text-lg">Nome</th>
          <th className="border w-1/4 text-lg">Contato</th>
          <th className="border w-1/4 text-lg">Tipo de voluntariado</th>
          <th className="border w-1/4 text-lg">Data de registro</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
        {
          volunteers.map((volunteer) => (
            <tr key={volunteer.id} className="flex w-full">
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{ volunteer.name }</td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                <div className="flex flex-col">
                  <span>{ volunteer.phone }</span>
                  <span>{ volunteer.email }</span>
                </div>
              </td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{ volunteer.kindName }</td>
              <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{new Date(volunteer.createdAt).toLocaleDateString('pt-br')}</td>
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
