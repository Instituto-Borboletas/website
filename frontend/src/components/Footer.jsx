export function Footer () {
  return (
    <footer className="bg-primary text-white">
      <div className="flex flex-col items-center justify-between w-5/6 mx-auto py-6">
        <h2 className="text-2xl font-bold">Contatos</h2>

        <ul className="flex space-x-4 py-4">
          { /* TODO: adicionar email e telefone de contato */}
          <li> <a target="_blank" href="mailto:" className="underline">Email</a> </li>
          <li> <a target="_blank" href="tel:" className="underline">Telefone</a> </li>
          <li> <a target="_blank" href="https://www.instagram.com/instituto.borboleta/" className="underline">Instagram</a> </li>
        </ul>

        <p>&copy; 2024 Instituto Borboletas. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
