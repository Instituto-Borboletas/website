import { Link, useLocation } from "react-router-dom"

function NavBar ({ isHomeLocation }) {
  if (isHomeLocation) {
    return (
      <nav className="font-bold">
        <ul className="flex space-x-4">
          <li> <a href="#quem-somos">Quem somos</a> </li>

          <li> <a href="#preciso-de-ajuda">Preciso de ajuda</a> </li>

          <li> <a href="#seja-voluntario">Seja voluntário</a> </li>

          <li>
            <Link to="/meus-dados">Meus dados</Link>
          </li>
        </ul>
      </nav>
    )
  }

  return (
    <nav className="font-bold">
      <ul className="flex space-x-4">
        <li>
          <Link to="/pedir-ajuda">Preciso de ajuda</Link>
        </li>

        <li>
          <Link to="/seja-voluntario">Seja voluntário</Link>
        </li>

        <li>
          <Link to="/meus-dados">Meus dados</Link>
        </li>
      </ul>
    </nav>
  )
}


export function Header () {
  const { pathname } = useLocation();

  return (
    <header className="bg-primary text-gray-100">
      <div className="flex justify-between w-5/6 mx-auto py-6">
        <h1 className="text-2xl font-bold">
          <Link to="/">Intituto Borboletas</Link>
        </h1>
        <NavBar isHomeLocation={pathname === "/"} />
      </div>
    </header>
  )
}
