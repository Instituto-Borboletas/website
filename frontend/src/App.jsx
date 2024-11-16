import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { IoClose } from "react-icons/io5";

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { useAuth } from "./contexts/auth"

function App() {
  const { user, isLoading: isUserLoading } = useAuth();
  const [showExtradataWarn, setShowExtradataWarn] = useState(false);
  const [showEmailConfirmationWarn, setShowEmailConfirmationWarn] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.externalDataStatus !== "registered") {
        setShowExtradataWarn(true);
      }

      // TODO: uncomment this on email validation task is done
      // if (user.emailConfirmationStatus !== "confirmed") {
      //   setShowEmailConfirmationWarn(true);
      // }
    }
  }, [user, isUserLoading]);

  return (
    <>
      <Header />
      {
        showExtradataWarn && (
          <>
            <section className="bg-orange-300 p-4 text-center">
              <IoClose className="text-black text-2xl float-right cursor-pointer" onClick={() => setShowExtradataWarn(false)} />
              <p className="text-black">
                Você ainda não preencheu todos os seus dados. Preencha para ter acesso a todas as funcionalidades da plataforma.
              </p>
              <p className="text-black">
                Para preencher, clique <Link to="/meus-dados?preencher-dados-extra=1" className="underline">aqui</Link>
              </p>
            </section>
          </>
        )
      }

      {
        showEmailConfirmationWarn && (
          <>
            <section className="bg-orange-300 p-4 text-center">
              <IoClose className="text-black text-2xl float-right cursor-pointer" onClick={() => setShowEmailConfirmationWarn(false)} />
              <p className="text-black">
                Você ainda não confirmou seu email. Confirme seu email para ter acesso a todas as funcionalidades da plataforma.
              </p>
              <p className="text-black">
                Não recebeu o email de confirmação? Clique <Link to="/meus-dados?reenviar-email=1" className="underline">aqui</Link>
              </p>
            </section>
          </>
        )
      }

      <main className="py-20">
        <section className="container w-full sm:w-5/6 mx-auto">
          <section id="quem-somos" className="flex flex-col items-center text-center">
            <h1 className="font-bold text-md lg:text-xl xl:text-2xl">Sobre Nós</h1>
            <p className="w-full sm:w-3/5 text-sm sm:text-md lg:text-lg xl:text-xl">
              O Instituto Borboletas é uma organização sem fins lucrativos que tem como objetivo ajudar pessoas vitimas de violência domestica.
            </p>
          </section>

          <section id="preciso-de-ajuda" className="flex sm:w-4/5 mx-auto py-10 xl:py-4">
            <div className="w-1/2 flex justify-center">
              <img src="/volunteer.svg" alt="Imagem de uma pessoa pedindo ajuda" className="w-[250px] h-[200px] xl:h-[350px] xl:w-[320px]" />
            </div>

            <div className="w-1/2 lg:w-2/5 flex flex-col text-center justify-center">
              <h2 className="font-bold text-md lg:text-xl xl:text-2xl">Preciso de ajuda</h2>
              <p className="text-sm sm:text-md lg:text-lg xl:text-xl">Se você é uma vitima de violência domestica, entre em contato conosco para que possamos te ajudar.</p>

              <Link to="/pedir-ajuda" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg xl:text-xl mx-auto">Saiba mais</Link>
            </div>
          </section>

          <section id="seja-voluntario" className="flex flex-row-reverse sm:w-4/5 mx-auto py-10 xl:py-4">
            <div className="w-1/2 flex justify-center">
              <img src="/help.svg" alt="Imagem de uma pessoa pedindo ajuda" className="w-[250px] h-[200px] xl:h-[350px] xl:w-[320px]" />
            </div>

            <div className="w-1/2 xl:w-2/5 flex flex-col text-center justify-center">
              <h2 className="font-bold text-md lg:text-xl xl:text-2xl">Seja voluntário</h2>
              <p className="text-sm sm:text-md lg:text-lg xl:text-xl">Se você deseja ajudar as pessoas vitimas de violência domestica, torne-se um voluntario do Instituto Borboletas. </p>

              <Link to="/seja-voluntario" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg xl:text-xl mx-auto">Saiba mais</Link>
            </div>
          </section>

        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
