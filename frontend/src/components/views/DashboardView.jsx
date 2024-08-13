export function DashboardView () {
  return (
    <section className="flex flex-col p-10">
      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Pedidos de ajuda</h2>
          <p className="text-3xl text-primary mt-2">5</p>
        </div>

        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Voluntários</h2>
          <p className="text-3xl text-primary mt-2">3</p>
        </div>

        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Usuários registrados</h2>
          <p className="text-3xl text-primary mt-2">10</p>
        </div>
      </header>

      <main className="w-full">
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Últimos pedidos de ajuda</h2>
        </section>

        <section className="mt-80">
          <h2 className="text-2xl font-bold">Mapeamento dos pedidos de ajuda</h2>
        </section>
      </main>
    </section>
  )
}
