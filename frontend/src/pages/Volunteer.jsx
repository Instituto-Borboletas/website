import { useEffect, useState } from "react";
import { Button, Input, InputGroup, InputLeftAddon, Stack, Select, Text } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { crudApi } from "../utils/api";

const optionsMock = [
  { value: "1", label: "Apoio emocional" },
  { value: "2", label: "Apoio financeiro" },
  { value: "3", label: "Apoio logístico" },
  { value: "4", label: "Apoio técnico" },
  { value: "5", label: "Apoio voluntário" },
];

export default function Volunteer() {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [kind, setKind] = useState(null);

  const [options, setOptions] = useState([]);

  async function registerVolunteer () {
    setIsLoading(true);
    try {
      await crudApi.post("/volunteers", {
        name,
        email,
        phone,
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
        <h1 className="text-2xl font-bold">Seja voluntario</h1>

        <Stack spacing={6} className="mt-12">
          <Stack>
            <Text>Nome da sua instituicao ou local *</Text>
            <InputGroup className="flex flex-col">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Salão da Fernanda"
                isRequired={true}
              />
            </InputGroup>
          </Stack>

          <Stack>
            <Text>Telefone para contato *</Text>
            <InputGroup>
              <InputLeftAddon>+55</InputLeftAddon>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Numero para contato"
                isRequired={true}
              />
            </InputGroup>
          </Stack>

          <Stack>
            <Text>Email para contato (opcional)</Text>
            <InputGroup>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email para contato"
              />
            </InputGroup>
          </Stack>

          <Stack>
            <Text>Tipo voluntariado</Text>
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

          <Button
            isDisabled={!name || !phone || !kind || isLoading}
            isLoading={isLoading}
            loadingText="Registrando..."
            onClick={registerVolunteer}
          >
            Registrar
          </Button>
        </Stack>
      </main>

      <Footer />
    </>
  )
}
