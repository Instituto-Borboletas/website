import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Spinner,
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

  async function logout() {
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

      <main className="container p-5 flex w-full md:w-5/6">
        <header className="flex items-center justify-between">
          <div className="font-bold text-xl self-start">
            <div className="relative size-28 flex items-center justify-center">
              <img
                className="size-full"
                src="/profile.png"
              />
            </div>
            <h1>
              Olá, {user?.name}!
            </h1>
          </div>

          <nav className="flex flex-col md:flex-row gap-2">
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
              colorScheme="red" className="bg-primary text-white md:py-2 md:px-4 rounded-lg text-center"
            >
              Sair
            </Button>
          </nav>
        </header>

        <section className="flex flex-col flex-1">
          {user.helps?.length && (
            <section className="container">
              <div className="py-2">
                <h1 className="font-bold">Pedidos de ajuda</h1>
                <p className="text-sm text-muted-foreground">Lista dos seus pedidos de ajuda</p>
              </div>
              <div className="flex w-full">
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
                      user.helps?.map((help) => (
                        <tr key={help.id} className="flex w-full">
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{help.name}</td>
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{help.description}</td>
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                            {/*
                            <div className="flex flex-col">
                              <span>{ kind.created_by_name }</span>
                              <span>{ new Date(kind.created_at).toLocaleDateString('pt-br') }</span>
                            </div>
                            */}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {user.volunteers?.length && (
            <section className="container">
              <div className="py-2">
                <h1 className="font-bold">Voluntariados</h1>
                <p className="text-sm text-muted-foreground">Listas dos voluntariados que você ofereceu</p>
              </div>
              <div className="flex w-full">
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
                      user.volunteers?.map((volunteer) => (
                        <tr key={volunteer.id} className="flex w-full">
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{volunteer.name}</td>
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{volunteer.description}</td>
                          <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                            {/*
                            <div className="flex flex-col">
                              <span>{ kind.created_by_name }</span>
                              <span>{ new Date(kind.created_at).toLocaleDateString('pt-br') }</span>
                            </div>
                            */}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>

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
