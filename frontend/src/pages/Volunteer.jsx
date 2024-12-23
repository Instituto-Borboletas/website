import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
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

export default function Volunteer() {
  const toast = useToast();
  const navigate = useNavigate();

  const { user, isLoading: isUserLoading } = useAuth();

  const { data: options, isLoading: isLoadingKinds } = useQuery({
    queryKey: ["volunteerKindOptions"],
    queryFn: () => crudApi.get("/volunteers/kinds/options"),
  });

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // TODO: add phone validation
  const [phone, setPhone] = useState("");
  const [kind, setKind] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login", {
        state: {
          from: "/seja-voluntario",
          message: "Você precisa estar logado para acessar essa página!"
        }
      });
    }
  }, [user, isUserLoading, navigate]);

  if (isUserLoading) {
    return <main className="flex flex-1 items-center justify-center">
      <Spinner />
    </main>
  }

  async function registerVolunteer() {
    setIsLoading(true);
    try {
      await crudApi.post("/volunteers", {
        name,
        email,
        phone,
        kind,
      });

      toast({
        title: "Voluntariado registrado",
        description: "Seu voluntariado foi registrado com sucesso",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao registrar voluntariado",
        description: "Ocorreu um erro ao registrar seu voluntariado, tente novamente mais tarde",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="md:w-1/2 py-10 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Seja voluntario</h1>

          <FormControl isRequired>
            <FormLabel>Nome da sua instituicao ou local</FormLabel>
            <InputGroup className="flex flex-col">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Salão da Fernanda"
                isRequired={true}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired className="mt-5">
            <FormLabel>Telefone para contato</FormLabel>
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
          </FormControl>

          <FormControl className="mt-5">
            <FormLabel>Email para contato (opcional)</FormLabel>
            <InputGroup>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email para contato"
              />
            </InputGroup>
            <FormHelperText>Caso não informe, usaremos o email presente em seu cadastro</FormHelperText>
          </FormControl>

          <FormControl className="mt-5">
            <FormLabel>Tipo voluntariado</FormLabel>
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              placeholder={isLoadingKinds ? "Carregando..." : "Selecione o tipo de voluntariado"}
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
              Entenda os tipos voluntariado
            </Button>
          </FormControl>

          <Button
            className="mt-5 w-full"
            isDisabled={!name || !phone || !kind || isLoading}
            isLoading={isLoading}
            loadingText="Registrando..."
            onClick={registerVolunteer}
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
