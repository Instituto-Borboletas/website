import { useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Stack,
  Text,
  Spinner,
  InputGroup,
  Input,
  Button,
} from "@chakra-ui/react"

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { useAuth } from "../../contexts/auth";
import { useDisclosure } from "../../hooks/disclosure";

import { ExtraDataDrawer } from "./components/ExtraDataDrawer"

export default function User() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading, logout } = useAuth();

  const { isOpen: showExtraDataModal, onOpen: openExtraDataModal, onClose: closeExtraDataModal } = useDisclosure();

  const mountFullUserData = useCallback(() => {
    return {
      ...user,
      extra: {} // TODO: add `extra` on user data on backend fetch
    }
  }, [user])

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login", {
        state: {
          from: "/meus-dados",
          message: "Você precisa estar logado para acessar seus dados!"
        }
      });
    }

    if (!isLoading) {
      const showDisplayExtraDataForm = searchParams.get("preencher-dados-extra")
      if (showDisplayExtraDataForm === "1")
        openExtraDataModal()
    }

  }, [user, isLoading, navigate, searchParams]);

  if (isLoading) {
    return <main className="flex flex-1 items-center justify-center">
      <Spinner />
    </main>
  }

  return (
    <>
      <Header />

      <main className="flex p-5">
        <div className="flex flex-1 items-center justify-center">
          {user && !isLoading ? <UserForm user={user} /> : <Spinner />}
        </div>

        {
          user?.internal && (
            <Link to="/interno" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg w-1/3 mx-auto text-center">Acesso interno</Link>
          )
        }
        <Button onClick={logout} colorScheme="red" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg w-1/3 mx-auto text-center">Sair</Button>

      </main>
      {
        showExtraDataModal && (
          <ExtraDataDrawer
            isOpen={showExtraDataModal}
            onClose={closeExtraDataModal}
            isEditing={false}
            currentUserData={mountFullUserData()}
          />
        )
      }

      <Footer />
    </>
  )
}

function UserForm({ user }) {
  return (
    <Stack spacing={6} w="full" maxW="md">
      <Stack>
        <Text>Nome completo</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.name}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      <Stack>
        <Text>Email</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.email}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      <Stack>
        <Text>Numero para contato</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.phone ?? "Não informado"}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      {/*
        TODO: add here a check for user extra data
        if it is not present, show a button to add it, so user can register extra data
      */}
    </Stack>
  )
}
