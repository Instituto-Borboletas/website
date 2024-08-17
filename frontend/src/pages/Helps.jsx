import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"
import {
  Button,
  Textarea,
  InputGroup,
  Stack,
  Select,
  FormControl,
  FormLabel,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { crudApi } from "../utils/api";
import { useDisclosure } from "../hooks/disclosure";

export default function Helps() {
  const { data: options, isLoading: isLoadingKinds } = useQuery({
    queryKey: ["helpKindOptions"],
    queryFn: () => crudApi.get("/helps/kinds/options"),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  const [kind, setKind] = useState(null);
  const [description, setDescription] = useState(null);

  async function registerHelpRequest() {
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

  return (
    <>
      <Header />

      <main className="py-10 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Pedir ajuda!</h1>

        <Stack spacing={6} w="50%" className="mt-12">
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              placeholder={isLoadingKinds ? "Carregando..." : "Selecione o tipo de ajuda"}
              isRequired={true}
            >
              {options?.data.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </Select>
            <Button
              onClick={onOpen}
              className="text-sm mt-2 text-primary"
              variant="link"
            >
              Entenda os tipos de ajuda
            </Button>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Detalhe o seu pedido de ajuda</FormLabel>
            <InputGroup className="flex flex-col">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cortar o cabelo..."
                isRequired={true}
              />
            </InputGroup>
          </FormControl>

          <Button
            isDisabled={!description || !kind || isLoading}
            isLoading={isLoading}
            loadingText="Registrando..."
            onClick={registerHelpRequest}
          >
            Registrar
          </Button>
        </Stack>

        <Drawer onClose={onClose} isOpen={isOpen} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Tipos de ajuda</DrawerHeader>
            <DrawerBody>
              <ul>
                {options?.data.map((option) => (
                  <li key={option.value} className="mt-4">
                    <strong>{option.name}</strong>
                    <p>{option.description}</p>
                  </li>
                ))}
              </ul>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </main>

      <Footer />
    </>
  )
}
