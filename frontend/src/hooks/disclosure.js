import { useState } from "react";

export function useDisclosure(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function onOpen () { setValue(true) }

  function onClose () { setValue(false) }

  return { isOpen: value, onOpen, onClose }
}
