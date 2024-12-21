import { useState } from "react"
import { redirect } from "react-router"
import type { Route } from "./+types/auth"
import { eq } from "drizzle-orm"
import { db } from "../../db"
import { usersTable } from "../../db/schemas"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

export function meta() {
  return [
    { title: "Instituto borboleta" },
    {
      name: "description",
      content: "Site institucional para o Instituto borboleta de Jaragua do Sul. Pagina de Login e Cadastro"
    }, // FIX
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const postData = await request.json()
  console.info("eu", postData)
  const [user] = await db.query.usersTable.findMany({
    where: ((users, { eq }) => eq(users.email, postData.email))
  })

  console.info(user)

  return redirect("/")
}

export default function Auth() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center w-4/5 mx-auto py-5">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Se registrar</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm />
        </TabsContent>

        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}

const loginFormSchema = z.object({
  email: z.string().email("Preencha um email valido, por favor"), // FIX
  password: z.string().nonempty("Preencha a senha, por favor")
})

function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  const [showPassword, setShowPassword] = useState(false)

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    console.info("submited login", values)
    fetch("/entrar", {
      method: "POST",
      body: JSON.stringify(values)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar com sua conta.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <section className="flex">
                      <Input type={showPassword ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </section>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="bg-primary disabled:bg-secondary w-full">Entrar</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button variant="link" className="underline">Esqueci minha senha</Button>
      </CardFooter>
    </Card>
  )
}


const registerFormSchema = z.object({
  fullname: z.string().nonempty("Insira um nome"),
  email: z.string().email("Insira um email valido"), // FIX
  password: z.string().min(8, "Use uma senha com ao menos 8 digitos para maior seguranca"), // FIX
  passwordRepeat: z.string().nonempty("Repita a sua senha")
})
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Senhas devem ser as mesmas",
    path: ["passwordRepeat"],
  });

function RegisterForm() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      passwordRepeat: ""
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    console.info("submited", values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registre-se</CardTitle>
        <CardDescription>
          Crie uma conta para poder pedir ajuda ou ajudar vítimas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <section className="flex">
                      <Input type={showPassword ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </section>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordRepeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a senha</FormLabel>
                  <FormControl>
                    <section className="flex">
                      <Input type={showRepeatPassword ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" onClick={() => setShowRepeatPassword(prev => !prev)}>
                        {showRepeatPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </section>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="bg-primary disabled:bg-secondary w-full">Registrar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
// const steps: Array<{ title: string, icon: LucideIcon, description?: string, isOptional: boolean }> = [
//   {
//     title: "Dados basicos", // FIX
//     icon: User,
//     isOptional: false
//   },
//   {
//     title: "Dados de entrada",
//     icon: Key,
//     description: "Use uma senha segura que sera usada para acessar os sistema", // FIX
//     isOptional: false
//   },
//   {
//     title: "Dados pessoais",
//     icon: FileUser,
//     description: "Alguns tipos de ajuda precisam de mais dados sobre voce. Para agilizar os processos deixe essas informacoes preenchidas desde ja", // FIX
//     isOptional: true
//   },
//   {
//     title: "Endereco", // FIX
//     icon: MapPinHouse,
//     description: "Preencha os dados do seu endereço para podermos atender um caso de emergência",
//     isOptional: true
//   },
// ]
