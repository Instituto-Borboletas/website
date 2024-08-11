import { useEffect, useState } from "react";
import { Button, Textarea, InputGroup, InputLeftAddon, Stack, Select, Text } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { crudApi } from "../utils/api";

const optionsMock = [
  { value: "1", label: "Metamorfose" },
  { value: "2", label: "Consulta psicologica" },
  { value: "3", label: "Apoio logístico" },
  { value: "4", label: "Apoio técnico" },
  { value: "5", label: "Apoio voluntário" },
];

export default function Helps () {
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState(null);
  const [kind, setKind] = useState(null);

  const [options, setOptions] = useState([]);

  async function registerHelpRequest () {
    setIsLoading(true);
    try {
      await crudApi.post("/helps", {
        description,
        kind,
      });
    } catch (err) {
      console.error(err);
      // TODO: handle if message is present on error
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    setOptions(optionsMock);
  }, [])

  return (
    <>
      <Header />

      <main className="py-10 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Pedir ajuda!</h1>

        <Stack spacing={6} className="mt-12">
          <Stack>
            <Text>Tipo ajuda *</Text>
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              placeholder="Selecione um tipo de voluntariado"
              isRequired={true}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Stack>

          <Stack>
            <Text>Detalhe o seu pedido de ajuda *</Text>
            <InputGroup className="flex flex-col">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cortar o cabelo..."
                isRequired={true}
              />
            </InputGroup>
          </Stack>

          <Button
            isDisabled={!name || !kind || isLoading}
            isLoading={isLoading}
            loadingText="Registrando..."
            onClick={registerHelpRequest}
          >
            Registrar
          </Button>
        </Stack>
      </main>

      <Footer />
    </>
  )
}
