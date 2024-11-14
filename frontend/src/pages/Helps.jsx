import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Spinner,
  useToast
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { crudApi } from "../utils/api";
import { useAuth } from "../contexts/auth";
import { useDisclosure } from "../hooks/disclosure";

export default function Helps() {
  const toast = useToast();
  const navigate = useNavigate();

  const { user, isLoading: isUserLoading } = useAuth();

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
      toast({
        title: "Pedido de ajuda registrado",
        description: "Seu pedido de ajuda foi registrado com sucesso",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao registrar pedido de ajuda",
        description: "Ocorreu um erro ao registrar seu pedido de ajuda, tente novamente mais tarde",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login", {
        state: {
          from: "/pedir-ajuda",
          message: "Você precisa estar logado para pedir ajuda!"
        }
      });
    }
  }, [user, isUserLoading, navigate]);

  if (isUserLoading) {
    return <main className="flex flex-1 items-center justify-center">
      <Spinner />
    </main>
  }

  return (
    <>
      <Header />

      <main className="md:w-1/2 py-10 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Pedir ajuda!</h1>

          <FormControl isRequired>
            <FormLabel>Tipo de ajuda</FormLabel>
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              placeholder={isLoadingKinds ? "Carregando..." : "Selecione o tipo"}
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

          <FormControl isRequired className="mt-5">
            <FormLabel>Detalhe o seu pedido de ajuda</FormLabel>
            <InputGroup className="flex flex-col">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cortar o cabelo..."
                isRequired={true}
                className="resize-none"
              />
            </InputGroup>
          </FormControl>

          <Button
            className="mt-5 w-full"
            isDisabled={!description || !kind || isLoading}
            isLoading={isLoading}
            loadingText="Registrando..."
            onClick={registerHelpRequest}
          >
            Registrar
          </Button>

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
