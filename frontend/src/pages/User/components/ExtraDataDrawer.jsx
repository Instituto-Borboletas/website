import { useState, useEffect } from "react";
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
  Textarea,
  useToast
} from "@chakra-ui/react"
import InputMask from "react-input-mask"
import axios from "axios";

import { useDebounce } from "../../../hooks/debounce";
import { LocalStorageCache } from "../../../utils/local-storage-cache";

const PHONE_MASK = "(99) 9 9999-9999"
const DEFAULT_DATA_VALUE = { extra: { address: { zip: "" } } }

export function ExtraDataDrawer({ isEditing = true, currentUserData, isOpen, onClose, onConfirm }) {
  const toast = useToast();
  const cepCache = new LocalStorageCache("cepCache");

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm({
    defaultValues: DEFAULT_DATA_VALUE,
  });
  const hasAdultChildren = watch("extra.hasAdultChildren", false);
  const hasKidChildren = watch("extra.hasKidChildren", false);

  // TODO: use alert modal to display error message on this call
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCityWarn, setShowWarnMessage] = useState(false);

  function handleHasAdultChildrenChange(event) {
    const { checked: value } = event.target
    setValue("extra.hasAdultChildren", value)
    setValue("extra.adultChildren", value ? value : 0)
  }

  function handleHasKidChildrenChange(event) {
    const { checked: value } = event.target
    setValue("extra.hasKidChildren", value)
    setValue("extra.kidChildren", value ? value : 0)
  }

  async function fetchCep(cep) {
    let existingCache = cepCache.get(cep)

    if (!existingCache) {
      const { data: result } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (result.erro) {
        if (toast.isActive("cep-error")) {
          toast.close("cep-error")
        }

        toast({
          id: "cep-error",
          title: "CEP inválido",
          description: "O CEP informado não é válido, por favor, verifique o CEP informado",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        return
      }

      existingCache = result;
      cepCache.set(cep, existingCache);
    }

    setValue("extra.address.city", existingCache.localidade);
    setValue("extra.address.street", existingCache.logradouro);
    setValue("extra.address.neighborhood", existingCache.bairro);
    setValue("extra.address.state", existingCache.uf);

    if (existingCache.localidade !== "Jaraguá do Sul") {
      setShowWarnMessage(true);
      return
    }

    setShowWarnMessage(false);
  }

  const debouncedCepFetch = useDebounce(fetchCep, 700);

  async function onSubmit(data) {
    // TODO: validate required fields

    const error = await onConfirm(data);
    if (error) {
      if ("key" in error) {
        const { key } = error
        if (key in errors) {
          errors[key].message = error.message
        } else {
          setErrorMessage(error.message)
        }
      } else if ("message" in error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Ocorreu um erro ao tentar cadastrar seus novos dados cadastrais, tente novamente mais tarde");
      }

      return
    }

    onClose();
  }

  useEffect(() => {
    for (const key in currentUserData) {
      if (typeof currentUserData[key] === 'object') {
        for (const nestedKey in currentUserData[key]) {
          setValue(`${key}.${nestedKey}`, currentUserData[key][nestedKey]);
          if (nestedKey === 'birthDate')
            setValue(`${key}.${nestedKey}`, new Date(currentUserData[key][nestedKey]).toISOString().split('T')[0]);

          if (nestedKey === 'adultChildren' || nestedKey === 'kidChildren') {
            setValue(
              `${key}.${nestedKey === 'adultChildren' ? 'hasAdultChildren' : 'hasKidChildren'}`,
              Boolean(currentUserData[key][nestedKey])
            );
          }
        }

        continue
      }

      setValue(key, currentUserData[key]);
    }
  }, [currentUserData, setValue]);

  useEffect(() => {
    const cep = watch('extra.address.zip', "").replace("-", "").replace("_", "")
    if (cep.length === 8) {
      debouncedCepFetch(cep);
    }
  }, [watch('extra.address.zip'), debouncedCepFetch, watch]);

  useEffect(() => {
    cepCache.load();

    return () => {
      cepCache.store();
    }
  }, [cepCache]);

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
              <Input {...register('name')} disabled />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input {...register('email')} disabled />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Telefone para contato</FormLabel>
              <Controller
                name="extra.phone"
                control={control}
                render={({ field }) => (
                  <InputMask
                    mask={PHONE_MASK}
                    {...field}
                    value={field.value || ""}
                  >
                    {(inputProps) => <Input {...inputProps} type="text" />}
                  </InputMask>
                )}
              />
            </FormControl>

            <Stack mt={4} display="flex" flexDir="row">
              <FormControl isRequired>
                <FormLabel>CPF</FormLabel>

                <Controller
                  name="extra.cpf"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      mask="999.999.999-99"
                      {...field}
                      value={field.value || ""}
                    >
                      {(inputProps) => <Input {...inputProps} type="text" />}
                    </InputMask>
                  )}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Data de nascimento</FormLabel>
                <Controller
                  name="extra.birthDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                />
              </FormControl>
            </Stack>

            <FormControl mt={4}>
              <FormLabel>Possui filhos</FormLabel>
              { /* FIX: on false select, change values of kidChildren and adultChildren to undefined */}
              <Checkbox
                {...register('extra.hasAdultChildren')}
                onChange={handleHasAdultChildrenChange}
              >
                Maiores de 18 anos
              </Checkbox>

              <Checkbox
                {...register('extra.hasKidChildren')}
                onChange={handleHasKidChildrenChange}
                className="ml-10"
              >
                Menores de 18 anos
              </Checkbox>
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

            <FormControl mt={4} isRequired>
              <FormLabel>Tipo de trabalho</FormLabel>
              <Select {...register('extra.work')} placeholder="Selecione um tipo">
                <option value="formal">Formal</option>
                <option value="informal">Informal</option>
                <option value="unemployed">Desempregada</option>
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Renda</FormLabel>
              <Select {...register('extra.income')} placeholder="Selecione um tipo">
                <option value="-1000">Até R$ 1000</option>
                <option value="1001-2000">De R$ 1001 até R$ 2000</option>
                <option value="2001-3000">De R$ 2001 até R$ 5000</option>
                <option value="5000-">Mais R$ 5000</option>
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Tipo de moradia</FormLabel>
              <Select {...register('extra.housing')} placeholder="Selecione um tipo">
                <option value="rent">Aluguel</option>
                <option value="own">Própria</option>
                <option value="minhacasaminhavida">Própria pelo Minha casa minha vida</option>
                <option value="given">Cedida</option>
              </Select>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Tipo de relacionamento</FormLabel>
              <Select {...register('extra.relation')} placeholder="Selecione um tipo">
                <option value="maried">Casamento</option>
                <option value="stable_union">União estável</option>
                <option value="affair">Namoro</option>
                <option value="ex">Ex namorado/companheiro</option>
                <option value="not_apply">Não se aplica</option>
              </Select>
            </FormControl>

            <Stack mt={8}>
              <h1>Endereço</h1>

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
                    name="extra.address.zip"
                    control={control}
                    render={({ field }) => (
                      <InputMask
                        mask="99999-999"
                        {...field}
                        value={field.value || ""}
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

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  {...register('extra.address.description')}
                  type="text"
                  resize="none"
                />
              </FormControl>
            </Stack>

            <Stack mt={8}>
              <h1>Contato de confiança</h1>
              <Stack display="flex" flexDir="row">
                <FormControl className="w-1/2">
                  <FormLabel>Nome</FormLabel>
                  <Input {...register('extra.trustedName')} type="text" />
                </FormControl>

                <FormControl className="w-1/2">
                  <FormLabel>Número</FormLabel>
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
              Fechar
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
