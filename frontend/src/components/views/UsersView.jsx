import { useState, useRef } from "react";
import {
  Button,
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"

import { useDisclosure } from "../../hooks/disclosure";

export function UsersView() {
  const [errorMessage, setErrorMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleSubmit ({ email, password }) {
  }

  return (
    <section className="flex flex-col p-10 h-full">
      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-10">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Externos</h2>
          <p className="text-3xl text-primary mt-2">5</p>
        </div>

        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Internos</h2>
          <p className="text-3xl text-primary mt-2">5</p>
        </div>
      </header>

      <main className="w-full mt-10 ">
        <div className="overflow-x-auto">
          <table className="min-w-full rounded border border-1 border-zinc-200">
            <thead className="bg-zinc-200 text-primary block w-full">
              <tr className="flex w-full">
                <th className="border w-1/4 text-lg">Nome</th>
                <th className="border w-1/4 text-lg">Email</th>
                <th className="border w-1/4 text-lg">Telefone</th>
                <th className="border w-1/4 text-lg">Tipo</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center max-h-[44rem] overflow-y-auto block w-full">
              {
                Array(20).fill().map(() => (
                  <tr key={Math.random()} className="flex w-full">
                    <td className="border p-2 w-1/4 text-lg">João</td>
                    <td className="border p-2 w-1/4 text-lg">joao@email.com</td>
                    <td className="border p-2 w-1/4 text-lg">(11) 99999-9999</td>
                    <td className="border p-2 w-1/4 text-lg">Externo</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-auto">
        <Button
          colorScheme="green"
          className="w-1/3"
          onClick={onOpen}
        >
          <Icon as={BiPlus} />
          <span className="pl-2">
            Adicionar usuário interno
          </span>
        </Button>

        <CreateUserModal isOpen={isOpen} onCancel={onClose} onSubmit={handleSubmit} errorMessage={errorMessage} />
      </footer>
    </section>
  )
}

function CreateUserModal({ isOpen, onCancel, onSubmit, errorMessage }) {
  const initialRef = useRef();

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
        <ModalHeader>Criar usuário interno</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nome completo</FormLabel>
            <Input ref={initialRef} placeholder="Seu nome e sobrenome" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="seuemail@gmail.com" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Senha</FormLabel>
            <Input type="password"/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Repita a senha</FormLabel>
            <Input type="password"/>
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
            mr={3}
            onClick={onSubmit}
          >
            Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
