import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Link } from "react-router-dom"

function App() {
  return (
    <>
      <Header />

      <main className="py-6">

        <section className="container w-2/3 mx-auto">

          <section id="quem-somos" className="flex flex-col items-center text-center">
            <h1 className="font-bold">Sobre Nós</h1>
            <p className="w-1/3 text-md">
              O Instituto Borboletas é uma organização sem fins lucrativos que tem como objetivo ajudar pessoas vitimas de violência domestica.
            </p>
          </section>

          <section id="preciso-de-ajuda" className="flex w-4/5 mx-auto py-10">
            <div className="w-1/2 flex justify-center">
              <img src="https://via.placeholder.com/250" alt="Imagem de uma pessoa pedindo ajuda" />
            </div>

            <div className="w-1/2 flex flex-col text-center justify-center">
              <h2 className="font-bold">Preciso de ajuda</h2>

              <p>Se você é uma vitima de violência domestica, entre em contato conosco para que possamos te ajudar.</p>

              <Link to="/pedir-ajuda" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg w-1/3 mx-auto">Saiba mais</Link>
            </div>
          </section>

          <section id="seja-voluntario" className="flex flex-row-reverse w-4/5 mx-auto py-10">
            <div className="w-1/2 flex justify-center">
              <img src="https://via.placeholder.com/250" alt="Imagem de uma pessoa pedindo ajuda" />
            </div>

            <div className="w-1/2 flex flex-col text-center justify-center">
              <h2 className="font-bold">Seja voluntário</h2>

              <p>Se você deseja ajudar as pessoas vitimas de violência domestica, torne-se um voluntario do Instituto Borboletas. </p>

              <Link to="/seja-voluntario" className="bg-primary text-white py-2 px-4 mt-4 rounded-lg w-1/3 mx-auto">Saiba mais</Link>
            </div>
          </section>

        </section>
      </main>

      <Footer />
    </>
  )
}

export default App
