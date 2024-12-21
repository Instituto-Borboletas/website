import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Instituto borboleta" },
    { name: "description", content: "Site institucional para o Instituto borboleta de Jaragua do Sul" }, // FIX
  ];
}

export default function Home() {
  return (
    <main className="py-20 container w-5/6 mx-auto flex-1">
      <section className="mx-auto">
        <img
          src="/logo.jpeg"
          className="max-h-[500px] mx-auto py-12"
        />
      </section>

      <section id="quem-somos" className="flex flex-col items-center text-center">
        <h1 className="font-bold text-md lg:text-xl xl:text-2xl">Sobre</h1>
        <p className="w-full sm:w-3/5 text-sm sm:text-md lg:text-lg xl:text-xl">
          O Instituto Borboleta é uma organização sem fins lucrativos que tem como objetivo ajudar pessoas vítimas de violência doméstica.
        </p>
      </section>

      <section id="preciso-de-ajuda" className="flex flex-col items-center text-center sm:w-4/5 mx-auto py-10 xl:py-4">
        <img
          src="/help.svg"
          alt=""
          className="w-[250px] h-[200px] xl:h-[350px] xl:w-[320px]"
        />
        <h1 className="font-bold text-md lg:text-xl xl:text-2xl">Pedir ajuda</h1>
        <p className="text-sm sm:text-md lg:text-lg xl:text-xl">
          Se você é uma vítima de violência doméstica, entre em contato conosco para que possamos te ajudar.
        </p>
        <Link to="/pedir-ajuda" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg xl:text-xl mx-auto">Solicitar</Link>
      </section>

      <section id="seja-voluntario" className="flex flex-col items-center text-center sm:w-4/5 mx-auto py-10 xl:py-4">
        <img
          src="/volunteer.svg"
          alt=""
          className="w-[250px] h-[200px] xl:h-[350px] xl:w-[320px]"
        />
        <h1 className="font-bold text-md lg:text-xl xl:text-2xl">Seja voluntario</h1> {/* FIX */}
        <p className="text-sm sm:text-md lg:text-lg xl:text-xl">
          Se você deseja ajudar as pessoas vítimas de violência doméstica, torne-se um voluntário do Instituto Borboleta.
        </p>
        <Link to="/seja-voluntario" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg xl:text-xl mx-auto">
          Se voluntariar
        </Link>
      </section>
    </main>
  )
}

