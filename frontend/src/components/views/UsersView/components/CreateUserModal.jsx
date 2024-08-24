import { useState, useRef } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"

import { PasswordInput } from "../../../PasswordInput";

export function CreateUserModal({ isOpen, onCancel, onSubmit, onChange, errorMessage, isLoading }) {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const initialRef = useRef();

  async function submitForm (event) {
    event.preventDefault();

    const success = await onSubmit({ userType, name, email, password, confirmationPassword: passwordConfirmation });

    if (success) {
      setUserType("");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    }
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={onCancel}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {
            errorMessage && (
              <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )
          }

          <FormControl isRequired>
            <FormLabel>Tipo de usuário</FormLabel>
            <Select
              value={userType}
              onChange={({ target }) => setUserType(target.value)}
              placeholder="Selecione um tipo de usuário"
              required
            >
              <option value="internal">Interno</option>
              <option value="external">Externo</option>
            </Select>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Nome completo</FormLabel>
            <Input
              ref={initialRef}
              placeholder="O nome e sobrenome do novo usuário"
              required
              value={name}
              onChange={({ target }) => { setName(target.value); onChange() }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="email@email.com"
              required
              value={email}
              onChange={({ target }) => { setEmail(target.value); onChange(); }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Senha</FormLabel>
            <PasswordInput
              value={password}
              onChange={({ target }) => { setPassword(target.value); onChange(); }}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Repita a senha</FormLabel>
            <PasswordInput
              value={passwordConfirmation}
              onChange={({ target }) => { setPasswordConfirmation(target.value); onChange(); }}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={submitForm}
            isDisabled={errorMessage || isLoading}
          >
            { isLoading ? "Criando..." : "Criar" }
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
