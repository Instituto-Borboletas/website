import { useState } from "react"
import { NavLink } from "react-router";
import { Menu } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"

export function Header() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <header className="bg-primary flex flex-rol items-center, justify-between p-4 md:py-6 relative md:stick md:top-0 md:z-50">
      <NavLink to="/">
        <span className="text-2xl font-bold text-white">
          <span className="block md:hidden">Borboleta</span>
          <span className="hidden md:block">Instituto Borboleta</span>
        </span>
      </NavLink>

      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <NavLink to="/pedir-ajuda">Pedir ajuda</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NavLink to="/seja-voluntario">Seja voluntario</NavLink> {/* FIX */}
              </DropdownMenuItem>

              {
                showLogin
                  ? (
                    <DropdownMenuItem>
                      <NavLink to="/meus-dados">Meus dados</NavLink>
                    </DropdownMenuItem>
                  )
                  : (
                    <DropdownMenuItem>
                      <NavLink to="/entrar">Entrar</NavLink>
                    </DropdownMenuItem>
                  )
              }
            </DropdownMenuGroup>
            {
              showLogin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="text-red-500">Sair</span>
                  </DropdownMenuItem>
                </>
              )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="hidden lg:block md:w-1/5 text-white font-bold text-md">
        <ul className="list-none flex flex-row justify-around gap-4 text-center">
          <li><NavLink to="/pedir-ajuda">Pedir ajuda</NavLink></li>
          <li><NavLink to="/seja-voluntario">Seja voluntario</NavLink></li>
          {
            showLogin
              ? (<li><NavLink to="/meus-dados">Meus dados</NavLink></li>)
              : (<li><NavLink to="/entrar">Entrar</NavLink></li>)
          }
        </ul>
      </nav>
    </header>
  )
}

