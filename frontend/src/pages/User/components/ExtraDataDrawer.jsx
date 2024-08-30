import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Input,
  Drawer,
  Select,
  Stack,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  useToast
} from "@chakra-ui/react"
import InputMask from "react-input-mask"

import { useDebounce } from "../../../hooks/debounce";
import axios from "axios";

const PHONE_MASK = "(99) 9 9999-9999"
const DEFAULT_DATA_VALUE = { extra: { address: { cep: "" } } }

// TODO: move this cache to local storage or something like that
const cepCache = {};
async function cepFetchWithCache(cep) {
  const currentCepCache = cepCache[cep]
  if (currentCepCache)
    return currentCepCache

  const { data: result } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  cepCache[cep] = result;

  return result
}
export function ExtraDataDrawer({ isEditing = true, currentUserData, isOpen, onClose, onConfirm }) {
  const toast = useToast();

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm({
    defaultValues: DEFAULT_DATA_VALUE,
  });
  const hasAdultChildren = watch("extra.hasAdultChildren", false);
  const hasKidChildren = watch("extra.hasKidChildren", false);

  // TODO: use alert modal to display error message on this call
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCityWarn, setShowWarnMessage] = useState(false);

  async function fetchCep(cep) {
    const result = await cepFetchWithCache(cep)

    if (result.erro) {
      toast({
        title: "Nao indentificamos esse CEP",
        description: "Nao consiguimos preencher os dados de endereco",
        status: "warning",
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });

      return
    }

    setValue("extra.address.city", result.localidade);
    setValue("extra.address.street", result.logradouro);
    setValue("extra.address.neighborhood", result.bairro);

    if (result.localidade !== "Jaraguá do Sul") {
      setShowWarnMessage(true);
      return
    }

    setShowWarnMessage(false);
  }

  const debouncedCepFetch = useDebounce(fetchCep, 500);

  async function onSubmit(data) {
    console.log('data', data)
    const error = await onConfirm(data);
    if (error) {
      if ("key" in error) {
        const { key } = error
        // TODO handle key error
      } else if ("message" in error) {
        setErrorMessage(error.messagek)
      } else {
        // TODO: generic message here
        setErrorMessage("Ocorreu um erro ao tentar cadastrar seus novos dados cadastrais, tente novamente mais tarde");
      }

      return
    }

    onClose();
  }

  useEffect(() => {
    if (currentUserData) {
      for (const key in currentUserData) {
        setValue(key, currentUserData[key]);
      }
    }
  }, [currentUserData, setValue]);

  useEffect(() => {
    const cep = watch('extra.address.cep', "").replace("-", "").replace("_", "")
    if (cep.length === 8) {
      debouncedCepFetch(cep);
    }
  }, [watch('extra.address.cep'), debouncedCepFetch, watch]);

  return (
    <>
      <Drawer
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
        size="xl"
        className="max-h-[50vh]"
      >

        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Dados cadastrais</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            {
              errorMessage && (
                <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                  {errorMessage}
                </div>
              )
            }
            <FormControl mt={4}>
              <FormLabel>Nome completo</FormLabel>
              <Input {...register('name')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input {...register('email')} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Telefone para contato</FormLabel>
              <InputMask
                mask={PHONE_MASK}
                {...register('extra.phone')}
              >
                {(inputProps) => <Input {...inputProps} type="text" />}
              </InputMask>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>CPF</FormLabel>
              <InputMask
                mask="999.999.999-99"
                {...register('extra.cpf')}
              >
                {(inputProps) => <Input {...inputProps} type="text" />}
              </InputMask>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Possui filhos</FormLabel>
              <Checkbox {...register('extra.hasAdultChildren')}>Maiores de 18 anos</Checkbox>
              <Checkbox {...register('extra.hasKidChildren')} className="ml-10">Menores de 18 anos</Checkbox>
            </FormControl>

            {hasAdultChildren && (
              <FormControl mt={4}>
                <FormLabel>Quantidade de filhos maiores de 18 anos</FormLabel>
                <Input {...register('extra.adultChildren')} type="number" />
              </FormControl>
            )}

            {hasKidChildren && (
              <FormControl mt={4}>
                <FormLabel>Quantidade de filhos menores de 18 anos</FormLabel>
                <Input {...register('extra.kidChildren')} type="number" />
              </FormControl>
            )}

            <FormControl mt={4}>
              <FormLabel>Tipo de trabalho</FormLabel>
              <Select {...register('extra.work')} placeholder="Selecione um tipo">
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
                <option value="unemployed">Desempregada</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Renda</FormLabel>
              <Select {...register('extra.income')} placeholder="Selecione um tipo">
                <option value="-1000">Até R$ 1000</option>
                <option value="1001-2000">De R$ 1001 até R$ 2000</option>
                <option value="2001-3000">De R$ 2001 até R$ 5000</option>
                <option value="5000-">De R$ 2001 até R$ 5000</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de moradia</FormLabel>
              <Select {...register('extra.housing')} placeholder="Selecione um tipo">
                <option value="rent">Aluguel</option>
                <option value="own">Própria</option>
                <option value="minhacasaminhavida">Própria pelo Minha casa minha vida</option>
                <option value="given">Cedida</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tipo de relacionamento</FormLabel>
              <Select {...register('extra.relation')} placeholder="Selecione um tipo">
                <option value="stable">União estável</option>
                <option value="maried">Casamento</option>
                <option value="namoro">Namoro</option>
                <option value="ex">Ex namorado/companheiro</option>
              </Select>
            </FormControl>

            <Stack mt={8}>
              <h1>Endereco</h1>

              {
                showCityWarn && (
                  <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
                    <h2>
                      Infelizmente nao atendemos sua cidade. Mas faremos o possivel para lhe ajudar!
                    </h2>
                  </div>
                )
              }

              <Stack display="flex" flexDir="row">
                <FormControl isRequired className="w-1/2">
                  <FormLabel>CEP</FormLabel>
                  <Controller
                    name="extra.address.cep"
                    control={control}
                    render={({ field }) => (
                      <InputMask
                        mask="99999-999"
                        {...field}
                        type="text"
                      >
                        {(inputProps) => <Input {...inputProps} />}
                      </InputMask>
                    )}
                  />
                </FormControl>
                <FormControl isRequired className="w-1/2">
                  <FormLabel>Cidade</FormLabel>
                  <Input {...register('extra.address.city')} type="text" />
                </FormControl>
              </Stack>

              <Stack display="flex" flexDir="row">
                <FormControl isRequired className="w-1/2">
                  <FormLabel>Rua</FormLabel>
                  <Input {...register('extra.address.street')} type="text" />
                </FormControl>

                <FormControl isRequired className="w-1/2">
                  <FormLabel>Bairro</FormLabel>
                  <Input {...register('extra.address.neighborhood')} type="text" />
                </FormControl>
              </Stack>

              <Stack display="flex" flexDir="row">
                <FormControl w="85%" isRequired>
                  <FormLabel>Complemento</FormLabel>
                  <Input {...register('extra.address.complement')} type="text" />
                </FormControl>

                <FormControl w="15%" isRequired>
                  <FormLabel>Nº</FormLabel>
                  <Input {...register('extra.address.number')} type="number" />
                </FormControl>
              </Stack>
            </Stack>

            <Stack mt={8}>
              <h1>Contato de confiaca</h1>
              <Stack display="flex" flexDir="row">
                <FormControl className="w-1/2">
                  <FormLabel>Nome</FormLabel>
                  <Input {...register('extra.trustedName')} type="text" />
                </FormControl>

                <FormControl className="w-1/2">
                  <FormLabel>Numero</FormLabel>
                  <InputMask
                    mask={PHONE_MASK}
                    {...register('extra.trustedPhone')}
                  >
                    {(inputProps) => <Input {...inputProps} type="text" />}
                  </InputMask>
                </FormControl>
              </Stack>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              colorScheme="blue"
              variant="solid"
              onClick={handleSubmit(onSubmit)}
            >
              Salvar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
