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
import { crudApi } from "../../utils/api";

export default function User() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading, logout: logUserOut } = useAuth();

  const { isOpen: showExtraDataModal, onOpen: openExtraDataModal, onClose: closeExtraDataModal } = useDisclosure();

  async function handleExtraDataEdit(newExtraData) {
    try {
      const { data } = await crudApi.put("/users/external/extra", newExtraData.extra)
      console.info(data)
      return null
    } catch (error) {
      return error.response.data
    }
  }

  async function logout () {
    await logUserOut()
    navigate("/login", {
      state: {
        from: "/meus-dados",
      }
    });
  }

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
      if (showDisplayExtraDataForm === "1") {
        openExtraDataModal()
        setSearchParams({})
      }
    }

  }, [user, isLoading, navigate, searchParams]); user

  if (isLoading) {
    return <main className="flex flex-1 items-center justify-center">
      <Spinner />
    </main>
  }

  return (
    <>
      <Header />

      <main className="flex p-5 w-5/6">
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Olá, {user?.name}!
          </h1>

          <nav className="flex space-x-2">
            {
              user?.internal && (
              <Button>
                <Link to="/interno">
                  Acesso interno
                </Link>
              </Button>
              )
            }
            <Button onClick={openExtraDataModal}>
              Dados cadastrais
            </Button>

            <Button
              onClick={logout}
              colorScheme="red" className="bg-primary text-white py-2 px-4 rounded-lg text-center"
            >
              Sair
            </Button>
          </nav>
        </header>
        <div className="flex flex-col flex-1 items-center justify-center">
          <section>
            <h1>Pedidos de ajuda</h1>
          </section>

          <section>
            <h1>Voluntariados</h1>
          </section>
        </div>

        {
          showExtraDataModal && (
            <ExtraDataDrawer
              isOpen={showExtraDataModal}
              onClose={closeExtraDataModal}
              isEditing={false}
              currentUserData={user}
              onConfirm={handleExtraDataEdit}
            />
          )
        }

      </main>
      <Footer />
    </>
  )
}
