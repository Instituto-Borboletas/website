import { useState, useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { crudApi } from "../../../../utils/api";

async function fetchUserDetail (userId) {
  const { data } = await crudApi.get(`/users/detail/${userId}`)
  return data
}
export function DetailUserModal({ userId, isOpen, onClose, errorMessage }) {
  const { isLoading, data: user, isError } = useQuery({
    queryFn: () => fetchUserDetail(userId),
    queryKey: ["detail", userId],
  })

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

                  { JSON.stringify(user, null, 2) }
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
