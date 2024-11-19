import { Link, useLocation } from "react-router-dom"

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Portal
} from '@chakra-ui/react'
import { FaBars } from "react-icons/fa"

export function Header() {
  const { pathname } = useLocation()

  function goToTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }

  return (
    <header className="bg-primary flex flex-row items-center justify-between p-4 md:py-6 relative md:sticky md:top-0 md:z-50">
      {
        pathname === "/"
        ? (
          <a onClick={goToTop} className="text-2xl font-bold text-white">
            <span className="block md:hidden">Borboleta</span>
            <span className="hidden md:block">Instituto Borboleta</span>
          </a>
        )
        : (
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="block md:hidden">Borboleta</span>
            <span className="hidden md:block">Instituto Borboleta</span>
          </Link>
        )
      }

      <div className="lg:hidden">
        <Menu
          closeOnSelect={true}
          autoSelect={false}
          placement="bottom-end"
          popperProps={{ strategy: "fixed" }}
        >
          <MenuButton
            color="white"
            variant="transparent"
            as={Button}
          >
            <FaBars />
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuItem><Link to="/pedir-ajuda">Pedir ajuda</Link></MenuItem>
              <MenuItem><Link to="/seja-voluntario">Seja voluntário</Link></MenuItem>
              <MenuItem><Link to="/meus-dados">Meus dados</Link></MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </div>

      <nav className="hidden lg:block md:w-1/5 text-white font-bold text-md">
        <ul className="list-none flex flex-row justify-around gap-4 text-center">
          <li><Link to="/pedir-ajuda">Pedir ajuda</Link></li>
          <li><Link to="/seja-voluntario">Seja voluntário</Link></li>
          <li><Link to="/meus-dados">Meus dados</Link></li>
        </ul>
      </nav>
    </header>
  )
}
