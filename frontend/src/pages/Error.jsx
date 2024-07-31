import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage () {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <main className="w-full h-[100vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Ops!</h1>
        <p className="text-gray-500 mt-10">Aconteceu algum erro. Tente novamente mais tarde.</p>

        <button
          className="mt-10 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </main>
    </>
  )
}
