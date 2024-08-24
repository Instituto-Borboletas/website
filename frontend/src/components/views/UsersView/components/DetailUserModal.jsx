import { useState, useRef, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react"
import { useInternalData } from "../../../../contexts/internal";

export function DetailUserModal({ userId, isOpen, onClose, errorMessage }) {
  const { users } = useInternalData();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const userData = users.data.find(user => user.id === userId);

    if (userData) {
      setUser(userData);
      setIsLoading(false);
      return;
    }
  }, [userId])

  if (isLoading) {
    return (
      <Modal
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >

        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhe de usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex justify-center">
              <Spinner />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhe de usuário</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {
            errorMessage && (
              <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                {errorMessage}
              </div>
            )
          }

          {

            !user
              ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )
              : (

                <>
                  <FormControl mt={4}>
                    <FormLabel>Tipo de usuário</FormLabel>
                    <Input
                      value={user.userType}
                      disabled
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Nome completo</FormLabel>
                    <Input
                      value={user.name}
                      disabled
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </FormControl>
                </>
              )
          }


        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
