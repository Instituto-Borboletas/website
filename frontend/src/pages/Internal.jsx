import { Button, Icon } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";

import { useState } from "react";

export default function Internal () {
  const [selectedView, setSelectedView] = useState('dashboard');

  function changeSelectedView(view) {
    return () => {
      setSelectedView(view);
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.pushState({}, '', url);
    }
  }

  return (
    <>
      <main className="flex">
        <sidebar className="w-1/6 h-screen flex flex-col p-5">
          <nav className="flex-1">
            <ul>
              <li>
                <a onClick={changeSelectedView("dashboard")}>Dashboard</a>
              </li>

              <li>
                <a onClick={changeSelectedView("helps")}>Pedidos de Ajuda</a>
              </li>

              <li>
                <a onClick={changeSelectedView("volunteers")}>Voluntários</a>
              </li>


              <li>
                <a onClick={changeSelectedView("users")}>Usuários</a>
              </li>
            </ul>
          </nav>

          <div className="w-full mt-auto p-5">
            <nav className="pb-2">
              <ul className="underline">
                <li>
                  <a onClick={changeSelectedView("settings")}>Configurações</a>
                </li>
              </ul>
            </nav>

            <Button colorScheme="red" className="w-2/3">
              <Icon as={BiLogOut} />
              <span className="pl-2">
                Sair
              </span>
            </Button>
          </div>
        </sidebar>

        <section className="border-l-1 border-zinc-800 w-5/6">

        </section>
      </main>
    </>
  )
}
