import { useState, useRef, useEffect } from "react";
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
import { FaInfoCircle } from "react-icons/fa";
import { BiPlus } from "react-icons/bi"

import { crudApi } from "../../utils/api";
import { useInternalData } from "../../contexts/internal";
import { useDisclosure } from "../../hooks/disclosure";
import { PasswordInput } from "../PasswordInput";
import { useQueryClient } from "@tanstack/react-query";

export function UsersView() {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState(null);
  const [userList, setUserList] = useState([]);
  const [internalCount, setInternalCount] = useState(0);
  const [externalCount, setExternalCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { users, isUsersLoading } = useInternalData();

  const toast = useToast();

  async function handleSubmit ({ userType, name, email, password, confirmationPassword }) {
    if (!userType || !name || !email || !password || !confirmationPassword) {
      setErrorMessage("Preencha todos os campos");
      return false;
    }

    if (password !== confirmationPassword) {
      setErrorMessage("As senhas não coincidem");
      return false;
    }

    setErrorMessage(null);

    try {
      setIsLoading(true);

      const response = await crudApi.post("/users/create", {
        userType,
        name,
        email,
        password
      });

      queryClient.setQueryData(["internalUsersListing"], (oldData) => {
        return {
          ...oldData,
          data: [
            ...oldData.data,
            response.data
          ]
        }
      })

      toast({
        title: "Usuário criado com suscesso!",
        description: "O novo usuário já pode acessar o sistema e ser visto na listagem de usuários.",
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      handleClose();
      return true;
    } catch (error) {
      if (error.response.status === 409) {
        console.log(error.response.data)
        const { key } = error.response.data;
        if (key === "email") {
          setErrorMessage("Já existe um usuário com esse email cadastrado.");
          return false;
        }
      }

      setErrorMessage("Ocorreu um erro ao criar o usuário. Tente novamente mais tarde.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose () {
    setErrorMessage(null);
    onClose();
  }

  useEffect(() => {
    const { internal, external } = users?.data.reduce((acc, user) => {
      if (user.userType === "internal") {
        acc.internal += 1;
      } else {
        acc.external += 1;
      }

      return acc;
    }, { internal: 0, external: 0 }) ?? { internal: 0, external: 0 };

    setInternalCount(internal);
    setExternalCount(external);
  }, [users]);

  useEffect(() => {
    if (!users) return;

    const filteredUsers = users.data.filter(user => {
      if (typeFilter === "internal") {
        return user.userType === "internal";
      }

      if (typeFilter === "external") {
        return user.userType === "external";
      }

      return true;
    });

    setUserList(filteredUsers);
  }, [typeFilter]);

  return (
    <section className="flex flex-col p-10 h-full">
      <h1 className="text-3xl font-bold">Usuários</h1>

      <header className="flex flex-col">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-10">
          <div
            //  FIX: this is not the right way to render dynamic tailwind. use some lib that fixes it
            className={`bg-white p-5 rounded shadow-md cursor-pointer ${typeFilter === 'external' ? 'bg-zinc-200' : ''}`}
            onClick={() => typeFilter === "external" ? setTypeFilter(null) : setTypeFilter("external")}
          >
            <h2 className="text-lg font-bold">Externos</h2>
            <p className="text-3xl text-primary mt-2">{ externalCount }</p>
          </div>

          <div
            //  FIX: this is not the right way to render dynamic tailwind. use some lib that fixes it
            className={`bg-white p-5 rounded shadow-md cursor-pointer ${typeFilter === 'internal' ? 'bg-zinc-200' : ''}`}
            onClick={() => typeFilter === "internal" ? setTypeFilter(null) : setTypeFilter("internal")}
          >
            <h2 className="text-lg font-bold">Internos</h2>
            <p className="text-3xl text-primary mt-2">{ internalCount }</p>
          </div>
        </section>

        <div className="mt-2 flex items-center text-zinc-500">
          <Icon as={FaInfoCircle} />
          <p className="ml-1">
            Para filtrar os tipos usuários, clique nos cartões acima. Caso queira remover o filtro, clique novamente no cartão selecionado.
          </p>
        </div>
      </header>

      <main className="w-full mt-10">
        <div className="overflow-x-auto">
          { isUsersLoading
          ? (<p>Carregando...</p>)
          : (
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
                  userList.map((user) => (
                    <tr key={user.id} className="flex w-full">
                      <td className="border p-2 w-1/4 text-lg">{ user.name }</td>
                      <td className="border p-2 w-1/4 text-lg">{ user.email }</td>
                      <td className="border p-2 w-1/4 text-lg">{ user.phone ?? "Não informado" }</td>
                      <td className="border p-2 w-1/4 text-lg">{ user.userType === "internal" ? "Interno" : "Externo" }</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            )
          }
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

  async function submitForm (event) {
    event.preventDefault();

    const success = await onSubmit({ userType, name, email, password, confirmationPassword: passwordConfirmation });

    if (success) {
      setUserType("");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    }
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
              <option value="internal">Interno</option>
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
