import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  FormHelperText,
  useToast,
} from "@chakra-ui/react"

import { PasswordInput } from "../components/PasswordInput";
import { crudApi } from "../utils/api";
import { useAuth } from "../contexts/auth";

function isValidPhone(phone) {
  if (!phone) {
    return false;
  }

  if (!/^\d+$/.test(phone)) {
    return false;
  }

  if (phone.length === 9 && phone[0] !== "9") {
    return false;
  }

  if (phone.length === 11 && phone[2] !== "9") {
    return false;
  }

  return true;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: loginError } = useAuth();

  const [errorMessage, setErrorMessage] = useState(null);
  const [view, setView] = useState("login");
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneError, setPhoneError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const passwordLoginInputRef = useRef();

  function toggleView() {
    setView(view === "login" ? "register" : "login");

    if (view !== "register") {
      setEmail("");
    }
  }

  async function handleUserRegister (event) {
    event.preventDefault();

    setErrorMessage(null);
    setIsLoading(true);

    if (!name || !email || !password || !confirmationPassword) {
      setErrorMessage("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setErrorMessage("Insira um número válido");
      setPhoneError("Insira um número válido");
      setIsLoading(false);
      return;
    }

    if (password !== confirmationPassword) {
      setErrorMessage("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await crudApi.post("/users/external", {
        name,
        email,
        phone,
        password,
      });

      toast({
        title: "Usuário criado com suscesso!",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      if (error.response?.status === 409) {
        setErrorMessage("Esse email já está em uso");
      }
    } finally {
      setIsLoading(false);
      setView("login");
      setName("");
      setPhone("");
      setPassword("");
      setConfirmationPassword("");

      await new Promise(resolve => setTimeout(resolve, 500))
      passwordLoginInputRef.current?.focus();
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    setErrorMessage(null);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);

      toast({
        title: "Login efetuado com sucesso!",
        description: "Você será redirecionado para a página inicial...",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      })

      navigate("/");
    } catch (error) {
      if (error.response?.status === 401 || error.message === "Email ou senha inválidos") {
        setErrorMessage("Email ou senha inválidos");
      }
    }

    setIsLoading(false);
  }

  if (view === "login") {
    return (
      <main className="flex flex-row w-full">
        <div className="w-1/2 h-screen bg-zinc-100 flex items-center justify-center">
          <form className="w-3/4 bg-white px-4 py-8 rounded" onSubmit={handleLogin}>
            {
              errorMessage && (
                <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                  {errorMessage}
                </div>
              )
            }

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={({ target }) => { setEmail(target.value); }}
              />
              <FormErrorMessage>O campo email é obrigatório</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isRequired mt="4">
              <FormLabel>Senha</FormLabel>
              <PasswordInput
                compRef={passwordLoginInputRef}
                value={password}
                onChange={({ target }) => { setPassword(target.value); }}
              />
              <FormErrorMessage>O campo senha é obrigatório</FormErrorMessage>
            </FormControl>

            <div className="flex flex-row mt-4">
              <Button colorScheme="gray" size="md" w="full" onClick={toggleView} isDisabled={isLoading}>
                Cadastrar-se
              </Button>

              <Button type="submit" colorScheme="blue" size="md" w="full" ml="4" isDisabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>

            <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700">
              Voltar para a página inicial
            </Link>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-row-reverse w-full">
      <div className="w-1/2 h-screen bg-zinc-100 flex items-center justify-center">
        <form className="w-3/4 bg-white px-4 py-8 rounded" onSubmit={handleUserRegister}>
          {
            errorMessage && (
              <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )
          }

          <FormControl id="name" isRequired>
            <FormLabel>Nome</FormLabel>
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={({ target }) => { setName(target.value); }}
            />
            <FormErrorMessage>O campo nome é obrigatório</FormErrorMessage>
          </FormControl>

          <FormControl id="email" isRequired mt="4">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={({ target }) => { setEmail(target.value); }}
            />
            <FormErrorMessage>O campo email é obrigatório</FormErrorMessage>
          </FormControl>

          <FormControl id="phone" mt="4" isInvalid={phoneError}>
            <FormLabel>Número para contato (opcional)</FormLabel>
            <InputGroup>
              <InputLeftAddon>+55</InputLeftAddon>
              <Input
                type="tel"
                placeholder="Digite seu número"
                value={phone}
                minLength={8}
                maxLength={11}
                onChange={({ target }) => {
                  setPhone(target.value);

                  if (phoneError) {
                    setPhoneError(null);
                  }

                  if (!target.value) {
                    setPhoneError(null);
                    return
                  }

                  if (!isValidPhone(target.value)) {
                    setPhoneError("Insira um número válido");
                  }
                }}
              />
            </InputGroup>
            { phoneError
              ? <FormErrorMessage>Insira um número válido</FormErrorMessage>
              : <FormHelperText>Insira seu DDD junto ao número. Ignore o 0 antes do DDD</FormHelperText>
            }
          </FormControl>

          <FormControl id="password" isRequired mt="4" isInvalid={passwordError}>
            <FormLabel>Senha</FormLabel>
            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value); setErrorMessage(null); setPasswordError(null); }}
              isInvalid={passwordError}
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          </FormControl>

          <FormControl id="passwordConfirmation" isRequired mt="4" isInvalid={passwordError}>
            <FormLabel>Confirme a senha</FormLabel>
            <PasswordInput
              value={confirmationPassword}
              onChange={({ target }) => { setConfirmationPassword(target.value); setErrorMessage(null); setPasswordError(null); }}
            />
            <FormErrorMessage>As senhas não coincidem</FormErrorMessage>
          </FormControl>

          <div className="flex flex-row mt-4">
            <Button colorScheme="gray" size="md" w="full" onClick={toggleView} isDisabled={isLoading}>
              Entrar
            </Button>

            <Button type="submit" colorScheme="blue" size="md" w="full" ml="4" isDisabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar" }
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
