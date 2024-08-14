import {
  Button,
  Icon,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";

import { useDisclosure } from "../../hooks/disclosure";

export function VolunteersView () {
  // const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <section className="flex flex-col p-10 h-full">
      <h1 className="text-3xl font-bold">Voluntários</h1>

      <header className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-10">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-lg font-bold">Voluntários registrados</h2>
          <p className="text-3xl text-primary mt-2">5</p>
        </div>
      </header>

      <main className="w-full mt-10">
        <div className="overflow-x-auto">
          <table className="min-w-full rounded border border-1 border-zinc-200">
            <thead className="bg-zinc-200 text-primary block w-full">
              <tr className="flex w-full">
                <th className="border w-1/4 text-lg">Usuário</th>
                <th className="border w-1/4 text-lg">Contato</th>
                <th className="border w-1/4 text-lg">Tipo de voluntariado</th>
                <th className="border w-1/4 text-lg">Data de registro</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center max-h-[36rem] overflow-y-auto block w-full">
              {
                Array(20).fill().map(() => (
                  <tr key={Math.random()} className="flex w-full">
                    <td className="border p-2 w-1/3 text-lg flex items-center justify-center">Salao do Joao</td>
                    <td className="border p-2 w-1/3 text-lg flex items-center justify-center">
                      <div className="flex flex-col">
                        <span>(11) 99999-9999</span>
                        <span>joao@email.com</span>
                      </div>
                    </td>
                    <td className="border p-2 w-1/3 text-lg flex items-center justify-center">Metamorfose</td>
                    <td className="border p-2 w-1/3 text-lg flex items-center justify-center">{ new Date().toLocaleDateString('pt-br') }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>

      <footer className="mt-auto">
        { /*
        <Button
          colorScheme="green"
          className="w-1/3"
          onClick={onOpen}
        >
          <Icon as={BiPlus} />
          <span className="pl-2">Adicionar usuário</span>
        </Button>
        */ }
      </footer>
    </section>
  )
}
