import { useState, useRef, useEffect } from "react";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Stack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react"

export function ExtraDataModal({ isEditing = true, currentUserData, isOpen, onClose, onConfirm }) {
  const [userData, setUserData] = useState({ extra: {} });
  const [errorMessage, setErrorMessage] = useState(null);

  const [hasAdultChildren, setHasAdultChildren] = useState(false)
  const [hasKidChildren, setHasKidChildren] = useState(false)

  async function onSubmit() {
    const error = await onConfirm()
    if (error) {
      // TODO: handle error
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUserData)
      setUserData(currentUserData)

    // TODO: change values for children selects
  }, [currentUserData]);

  return (
    <>
      <Modal
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        size="2xl"
      >

        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Dados cadastrais</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              errorMessage && (
                <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                  {errorMessage}
                </div>
              )
            }

            <FormControl mt={4}>
              <FormLabel>Nome completo</FormLabel>
              <Input
                value={userData.name}
                disabled
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={userData.email}
                disabled
              />
            </FormControl>

            <FormControl mt={4}>
              {/* TODO use mask component for phone input */}
              <FormLabel>Telefone para contato</FormLabel>
              <Input
                value={userData.phone}
                disabled
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Telefone para contato</FormLabel>
              <Input
                value={userData.phone}
                disabled
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel></FormLabel>
              <Input
                value={userData.phone}
                type="number"
                disabled
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Possui filhos:</FormLabel>
              <Checkbox
                isChecked={hasAdultChildren}
                onChange={(event) => setHasAdultChildren(event.target.checked)}

              >
                Maiores de 18 anos
              </Checkbox>

              <Checkbox
                isChecked={hasKidChildren}
                onChange={(event) => setHasKidChildren(event.target.checked)}
              >
                Menos de 18 anos
              </Checkbox>
            </FormControl>

            {
              hasAdultChildren && (
                <FormControl mt={4}>
                  <FormLabel>Quantidade de filhos maiores de 18 anos</FormLabel>
                  <Input
                    value={userData.extra.adultChildren}
                    type="number"
                  />
                </FormControl>
              )
            }

            {
              hasKidChildren && (
                <FormControl mt={4}>
                  <FormLabel>Quantidade de filhos menores de 18 anos</FormLabel>
                  <Input
                    value={userData.extra.kidChildren}
                    type="number"
                  />
                </FormControl>
              )
            }

            <FormControl mt={4}>
              <FormLabel>CPF</FormLabel>
              {/* TODO: use input with mask for cpf | move this to top of input list this is important*/}
              <Input
                value={userData.extra.cpf}
                type="number"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de trabalho</FormLabel>
              <Select
                placeholder="Selecione um tipo"
              >
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Renda</FormLabel>
              <Select
                placeholder="Selecione um tipo"
              >
                <option value="-1000">Até R$ 1000</option>
                <option value="1001-2000">De R$ 1001 até R$ 2000</option>
                <option value="2001-3000">De R$ 2001 até R$ 5000</option>
                <option value="5000-">De R$ 2001 até R$ 5000</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de moradia</FormLabel>
              <Select
                placeholder="Selecione um tipo"
              >
                <option value="rent">Aluguel</option>
                <option value="own">Própria</option>
                <option value="minhacasaminhavida">Própria pelo Minha casa minha vida</option>
                <option value="given">Cedida</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de relacionamento</FormLabel>
              <Select
                placeholder="Selecione um tipo"
              >
                <option value="stable">União estável</option>
                <option value="maried">Casamento</option>
                <option value="namoro">Namoro</option>
                <option value="ex">Ex namorado/companheiro</option>
              </Select>
            </FormControl>

            <Stack mt={4}>
              <h1>Endereco</h1>

              <FormControl>
                <FormLabel>Rua</FormLabel>
                <Input
                  type="text"
                />
              </FormControl>
            </Stack>

            <Stack mt={4}>
              <h1>Contato de confiaca</h1>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={userData.extra.trustedName}
                  type="text"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Numero</FormLabel>
                <Input
                  value={userData.extra.trustedPhone}
                  type="number"
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              colorScheme="blue"
              variant="solid"
              onClick={onSubmit}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
