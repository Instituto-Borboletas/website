import { useState, useEffect } from "react";
import {
  Stack,
  Text,
  Spinner,
  InputGroup,
  Input
} from "@chakra-ui/react"

// import { } from "@chakra-ui/icons"

import { crudApi } from "../utils/api";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function User() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.user) {
      setUser(window.user)
      setIsLoading(false);
    } else {
      setIsLoading(true);
      crudApi.get("/me")
        .then((response) => {
          setUser(response.data)
          window.user = response.data
        })
        .catch((error) => {
          console.error(error)
          // TODO: check if message is present on error
          setUser({
            fullname: "Gabriel Rocha",
            email: "rocha@gmail.com",
            phone: "1234567890",
            isInternal: true,
          })
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [])

  return (
    <>
      <Header />

      <main className="flex">
        <div className="flex flex-1 items-center justify-center">
          {user && !isLoading ? <UserForm user={user} /> : <Spinner />}
        </div>
      </main>

      <Footer />
    </>
  )
}

function UserForm({ user }) {
  return (
    <Stack spacing={6} w="full" maxW="md">
      <Stack>
        <Text>Nome completo</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.fullname}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      <Stack>
        <Text>Email</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.email}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      <Stack>
        <Text>Numero para contato</Text>
        <InputGroup className="flex flex-col">
          <Input
            value={user.phone}
            isDisabled={true}
          />
        </InputGroup>
      </Stack>

      {/*
        TODO: add here a check for user extra data
        if it is not present, show a button to add it, so user can register extra data
      */}
    </Stack>
  )
}
