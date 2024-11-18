import { useState, useEffect } from "react";
import {
  Button,
  Icon,
  useToast,
  FormLabel,
  FormControl,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerFooter,
  DrawerContent,
  Stack,
  Spinner,
  Textarea,
} from "@chakra-ui/react"
import { FaInfoCircle } from "react-icons/fa";
import { BiPlus } from "react-icons/bi"

import { CreateUserModal } from "./components/CreateUserModal";

import { crudApi } from "../../../utils/api";
import { useInternalData } from "../../../contexts/internal";
import { useDisclosure } from "../../../hooks/disclosure";
import { useQueryClient } from "@tanstack/react-query";

export function UsersView() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState(null);
  const [userList, setUserList] = useState([]);
  const [internalCount, setInternalCount] = useState(0);
  const [externalCount, setExternalCount] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { users, isUsersLoading } = useInternalData();

  const [isError, setIsError] = useState(false)
  const [detailData, setDetailData] = useState({})

  async function openDetailModal(userId) {
    onOpenDetail()
    try {
      setIsLoading(true)
      const { data } = await crudApi.get(`/users/detail/${userId}`)
      setDetailData({ ...data, extra: data.extra ?? {}, address: data.address ?? {} })
      setIsError(false)
    } catch (err) {
      setIsError(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit({ userType, name, email, password, confirmationPassword }) {
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

  function handleClose() {
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
            <p className="text-3xl text-primary mt-2">{externalCount}</p>
          </div>

          <div
            //  FIX: this is not the right way to render dynamic tailwind. use some lib that fixes it
            className={`bg-white p-5 rounded shadow-md cursor-pointer ${typeFilter === 'internal' ? 'bg-zinc-200' : ''}`}
            onClick={() => typeFilter === "internal" ? setTypeFilter(null) : setTypeFilter("internal")}
          >
            <h2 className="text-lg font-bold">Internos</h2>
            <p className="text-3xl text-primary mt-2">{internalCount}</p>
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
          {isUsersLoading && !users
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
                        <td className="border p-2 w-1/4">{user.name}</td>
                        <td className="border p-2 w-1/4">{user.email}</td>
                        <td className="border p-2 w-1/4">{user.phone ?? "Não informado"}</td>
                        <td className="border p-2 w-1/4 hidden lg:block">{user.userType === "internal" ? "Interno" : "Externo"}</td>
                        <td className="border p-2 w-1/4 lg:w-1/5">
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => openDetailModal(user.id)}
                          >
                            Detalhar
                          </Button>

                          <DetailDrawer
                            isOpen={isOpenDetail}
                            onClose={onCloseDetail}
                            isLoading={isLoading}
                            isError={isError}
                            data={detailData}
                          />
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
        <DrawerHeader>Detalhe do usuário</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody>
          {
            isLoading
              ? (
                <Spinner />
              )
              : (
                <>
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
                      <Input value={data.extra.birthDate ? new Date(data.extra.birthDate).toLocaleDateString() : ''} disabled />
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
