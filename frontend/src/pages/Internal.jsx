import { useState, useEffect } from "react";
import { Button, Icon } from "@chakra-ui/react";
import { BiLogOut } from "react-icons/bi";

import { DashboardView } from "../components/views/DashboardView";
import { UsersView } from "../components/views/UsersView";
import { HelpsView } from "../components/views/HelpsView";
import { VolunteersView } from "../components/views/VolunteersView";
import { SettingsView } from "../components/views/SettingsView";

const VIEWS = {
  dashboard: DashboardView,
  usuarios: UsersView,
  ajudas: HelpsView,
  voluntarios: VolunteersView,
  configuracoes: SettingsView,
}

const VIEWS_LABLES = {
  dashboard: "Dashboard",
  usuarios: "Usuários",
  ajudas: "Ajudas",
  voluntarios: "Voluntários",
}

export default function Internal () {
  const [selectedView, setSelectedView] = useState("dashboard");

  function changeSelectedView(view) {
    return () => {
      setSelectedView(view);
      const url = new URL(window.location.href);
      url.searchParams.set("pagina", view);
      window.history.pushState({}, "", url);
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const view = url.searchParams.get("pagina");
    if (view) {
      setSelectedView(view);
    }
  }, []);

  return (
    <>
      <main className="flex flex-row">
        <aside className="w-1/6 h-screen flex flex-col p-5 pt-10 border-r-zinc-300 border-r-2">
          <nav className="flex-1">
            <ul>
              {
                Object.keys(VIEWS_LABLES).map(view => (
                  <li key={view} className="text-xl py-1">
                    <a
                      onClick={changeSelectedView(view)}
                      className={view === selectedView ? "text-primary underline bg-zinc-200 p-2 px-4 rounded" : "p-2 px-4 rounded hover:bg-zinc-200 hover:text-primary"}
                    >
                      {VIEWS_LABLES[view]}
                    </a>
                  </li>
                ))
              }
            </ul>
          </nav>

          <div className="w-full mt-auto p-5">
            <nav className="pb-2">
              <ul className="underline">
                <li className="text-lg">
                  <a
                    onClick={changeSelectedView("settings")}
                    className="text-lg"
                  >
                    Configurações
                  </a>
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
        </aside>

        <section className="border-l-1 border-zinc-800 w-5/6 text-black">
          <ViewWrapper view={selectedView} />
        </section>
      </main>
    </>
  )
}

function ViewWrapper ({ view }) {
  const View = VIEWS[view];
  return <View />
}
