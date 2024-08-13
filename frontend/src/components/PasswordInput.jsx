import { useState } from "react";
import {
  InputGroup, Input, InputRightElement, Button, Icon
} from "@chakra-ui/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Digite sua senha"
        value={value}
        onChange={onChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {
            show ? <Icon as={FaRegEyeSlash} /> : <Icon as={FaRegEye} />
          }
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
