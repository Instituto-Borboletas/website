import type { Route } from "./+types/auth";

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Instituto borboleta" },
    {
      name: "description",
      content: "Site institucional para o Instituto borboleta de Jaragua do Sul. Pagina de Login e Cadastro"
    }, // FIX
  ];
}

export default function Auth() {
  return (
    <main className="flex flex-col items-center justify-center w-4/5 py-5">
      <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Entrar</TabsTrigger>
        <TabsTrigger value="register">Se registrar</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Entrar com sua conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Registre-se</CardTitle>
            <CardDescription>
              Crie uma conta para poder pedir ajuda ou ajudar vítimas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="fullname">Nome completo</Label>
              <Input id="fullname" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">N de contato</Label> {/* FIX */}
              <Input id="phone" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </main>
  )
}
