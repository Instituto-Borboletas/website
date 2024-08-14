import { useState, useRef } from "react";
import {
  Button,
  Icon,
  Input,
  Modal,
  Select,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"
import { useQuery } from '@tanstack/react-query'

import { crudApi } from "../../utils/api";
import { useDisclosure } from "../../hooks/disclosure";
import { PasswordInput } from "../PasswordInput";

export function UsersView() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isPending, error, data, isLoading } = useQuery({
  //   queryKey: ["internalUsersListing"],
  //   queryFn: () =>
  //     crudApi.get("/users"),
  // })

  const toast = useToast();

  async function handleSubmit ({ userType, name, email, password, confirmationPassword }) {
    if (!userType || !name || !email || !password || !confirmationPassword) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    if (password !== confirmationPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    setErrorMessage(null);

    try {
      setIsLoading(true);
      // const response = await crudApi.post("/users", {
      //   userType,
      //   name,
      //   email,
      //   password,
      //});
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Usuário criado com suscesso!",
        description: "O novo usuário já pode acessar o sistema e ser visto na listagem de usuários.",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      if (error.response.status === 409) { }
    } finally {
      setIsLoading(false);
      handleClose();
    }
  }

  function handleClose () {
    setErrorMessage(null);
    onClose();
  }

  return (
    <section className="flex flex-col p-10 h-full">
      <h1 className="text-3xl font-bold">Usuários</h1>

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

      <main className="w-full mt-10">
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
            <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
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
          <span className="pl-2">Adicionar usuário</span>
        </Button>

        <CreateUserModal
          isOpen={isOpen}
          onCancel={onClose}
          onSubmit={handleSubmit}
          onChange={() => setErrorMessage(null)}
          errorMessage={errorMessage}
          isLoading={isLoading}
        />
      </footer>
    </section>
  )
}

function CreateUserModal({ isOpen, onCancel, onSubmit, onChange, errorMessage, isLoading }) {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const initialRef = useRef();

  async function submitForm () {
    await onSubmit({ name, email, password, confirmationPassword: passwordConfirmation });

    setUserType("");
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
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
        <ModalHeader>Criar usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {
            errorMessage && (
              <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )
          }

          <FormControl isRequired>
            <FormLabel>Tipo de usuário</FormLabel>
            <Select
              value={userType}
              onChange={({ target }) => setUserType(target.value)}
              placeholder="Selecione um tipo de usuário"
              required
            >
              <option value="intern">Interno</option>
              <option value="external">Externo</option>
            </Select>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Nome completo</FormLabel>
            <Input
              ref={initialRef}
              placeholder="O nome e sobrenome do novo usuário"
              required
              value={name}
              onChange={({ target }) => { setName(target.value); onChange() }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="email@email.com"
              required
              value={email}
              onChange={({ target }) => { setEmail(target.value); onChange(); }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Senha</FormLabel>
            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value); onChange(); }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Repita a senha</FormLabel>
            <PasswordInput
              value={passwordConfirmation}
              onChange={({ target }) => { setPasswordConfirmation(target.value); onChange(); }}
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
