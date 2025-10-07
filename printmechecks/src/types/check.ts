export interface CheckData {
  accountHolderName: string
  accountHolderAddress: string
  accountHolderCity: string
  accountHolderState: string
  accountHolderZip: string
  checkNumber: string
  date: string
  bankName: string
  amount: string
  payTo: string
  memo: string
  signature: string
  signatureSvg: string | null
  routingNumber: string
  bankAccountNumber: string
  lineLength?: number
}
