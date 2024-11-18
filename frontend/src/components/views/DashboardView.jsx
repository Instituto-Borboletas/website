import { Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { crudApi } from "../../utils/api"

async function fetchDashboard () {
  const { data } = await crudApi("/users/dashboard")
  return data
}

export function DashboardView () {
  const { isPending, data } = useQuery({
    queryFn: () => fetchDashboard(),
    queryKey: ["dashboard-data"],
    refetchInterval: 10_000
  })

  if (isPending) {
    return (
      <Spinner />
    )
  }

  return (
    <section className="flex flex-col p-10">
      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
        <Link reloadDocument to="/interno?pagina=ajudas" className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Pedidos de ajuda</h2>
          <p className="text-3xl text-primary mt-2">{ data.helps }</p>
        </Link>

        <Link reloadDocument to="/interno?pagina=voluntarios" className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Voluntários</h2>
          <p className="text-3xl text-primary mt-2">{ data.volunteers }</p>
        </Link>

        <Link reloadDocument to="/interno?pagina=usuarios" className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Usuários registrados (Externos)</h2>
          <p className="text-3xl text-primary mt-2">{ data.users }</p>
        </Link>
      </header>

      <main className="w-full">
        {/*
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Últimos pedidos de ajuda</h2>
          </section>

          <section className="mt-80">
            <h2 className="text-2xl font-bold">Mapeamento dos pedidos de ajuda</h2>
          </section>
        */}
      </main>
    </section>
  )
}
