const CPF_UF_MAP = {
  0: "RS",
  1: "DF, GO, MS, TO",
  2: "AC, AM, AP, PA, RO, RR",
  3: "CE, MA, PI",
  4: "AL, PB, PE, RN",
  5: "BA, SE",
  6: "MG",
  7: "ES, RJ",
  8: "SP",
  9: "PR, SC"
};

export function validateCPF(cpf?: string): string | false {
  if (!cpf)
    return false;

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf))
    return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;

  if (firstDigit !== parseInt(cpf.charAt(9)))
    return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;

  if (secondDigit !== parseInt(cpf.charAt(10)))
    return false;

  // @ts-expect-error ts is crazy bro
  const uf = CPF_UF_MAP[cpf.charAt(8)];

  return uf ?? false;
}

export function validatePhone(phone?: string): boolean {
  if (!phone) return false;

  const size = phone.length;

  if (size > 11 || size < 8)
    return false;

  if (!/^\d+$/.test(phone))
    return false;

  if (phone.length === 9 && phone[0] !== "9")
    return false;

  if (phone.length === 11 && phone[2] !== "9")
    return false;

  return true;
}
