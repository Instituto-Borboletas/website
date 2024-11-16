import { useState, useEffect } from "react";
import {
  Button,
  Icon,
  useToast,
} from "@chakra-ui/react"
import { FaInfoCircle } from "react-icons/fa";
import { BiPlus } from "react-icons/bi"

import { CreateUserModal } from "./components/CreateUserModal";

import { crudApi } from "../../../utils/api";
import { useInternalData } from "../../../contexts/internal";
import { useDisclosure } from "../../../hooks/disclosure";
import { useQueryClient } from "@tanstack/react-query";
import { DetailUserModal } from "./components/DetailUserModal";

export function UsersView() {
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState(null);
  const [userList, setUserList] = useState([]);
  const [internalCount, setInternalCount] = useState(0);
  const [externalCount, setExternalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
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

  function handleDetailUser(userId) {
    setSelectedUser(userId);
    onOpenDetail();
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
  }, [users, isUsersLoading]);

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
  }, [typeFilter, users, isUsersLoading]);

  return (
    <section className="flex flex-col p-4 lg:p-10 h-full">
      <h1 className="text-3xl font-bold">Usuários</h1>

      <header className="flex flex-col">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-10">
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
          { isUsersLoading && !users
          ? (<p>Carregando...</p>)
          : (
            <table className="min-w-full rounded border border-1 border-zinc-200">
              <thead className="bg-zinc-200 text-primary block w-full">
                <tr className="flex w-full text-sm lg:text-lg">
                  <th className="border w-1/4">Nome</th>
                  <th className="border w-1/4">Email</th>
                  <th className="border w-1/4">Telefone</th>
                  <th className="border hidden lg:block w-1/4">Tipo</th>
                  <th className="border w-1/4 lg:w-1/5">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
                {
                  userList.map((user) => (
                    <tr key={user.id} className="flex w-full text-sm lg:text-lg">
                      <td className="border p-2 w-1/4">{ user.name }</td>
                      <td className="border p-2 w-1/4">{ user.email }</td>
                      <td className="border p-2 w-1/4">{ user.phone ?? "Não informado" }</td>
                      <td className="border p-2 w-1/4 hidden lg:block">{ user.userType === "internal" ? "Interno" : "Externo" }</td>
                      <td className="border p-2 w-1/4 lg:w-1/5">
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleDetailUser(user.id)}
                        >
                          Detalhar
                        </Button>
                        <DetailUserModal isOpen={isOpenDetail} onClose={onCloseDetail} userId={selectedUser} />
                      </td>
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

