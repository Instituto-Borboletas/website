export function Footer () {
  return (
    <footer className="bg-primary text-white">
      <div className="flex flex-col items-center justify-between md:w-5/6 mx-auto py-6">
        <h2 className="text-xl md:text-2xl font-bold">Contatos</h2>

        <ul className="flex space-x-4 py-4">
          <li> <a target="_blank" href="https://www.instagram.com/instituto.borboleta/" className="underline">Instagram</a> </li>
          <li> <a target="_blank" href="mailto:" className="underline">Email</a> </li>
          <li> <a target="_blank" href="tel:" className="underline">Telefone</a> </li>
        </ul>

        <p className="text-sm md:text-md">&copy; 2024 Instituto Borboleta. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
