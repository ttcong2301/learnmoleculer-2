const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql` 
input MiniProgramGetUserTokenInput {
  miniProgramId: Int
}

input MiniProgramGetOrderInformationInput {
  transaction: String
}

input MiniProgramPayInput {
  transaction: String
  payment: PaymentInput! @listLength(min: 1, max: 1)
  clientId: String!
}

input MiniProgramRequestPermissionInput {
  userToken: String
  securityCode: String
}

input PaymentWalletInput {
  active: Boolean!
  securityCode: String
}

input PaymentBankCardInput {
  cardNumber: String!
  cardHolder: String
  issuedAt: DateTime
  redirectUrl: String
  isRemember: Boolean
  securityCode: String
}

input PaymentLinkedInput {
  linkedId: BigInt!
  otp: String
  "env môi trường để liên kết Napas (WebApp hay MobileApp)"
  envName: NapasEnvEnum
  "redirectUrl cho phần nạp Napas"
  redirectUrl: String
  securityCode: String,
  "Id auth card truoc đó"
  referenceId: String
}

input PaymentBankQRCodeInput {
  active: Boolean!
}

input PaymentBankTransferInput {
  active: Boolean!
  recheck: Boolean
}

input PaymentCreditCardInput {
  cardNumber: String!
  expiredAt: String!
  cvv: String!
  referenceId: String
  redirectUrl: String
}

input PaymentPaymeCreditInput {
  securityCode: String
  "gói mà user muốn dùng để thanh toán tín dụng"
  packageId: BigInt
}

input PaymentBankCardPGInput {
  cardNumber: String!
  cardHolder: String!
  issuedAt: DateTime!
  redirectUrl: String
}
input PaymentMoMoQRInput {
  active: Boolean!
}
input PaymentZaloPayInput {
  active: Boolean!
}


input PaymentInput {
  wallet: PaymentWalletInput
  bankCard: PaymentBankCardInput
  linked: PaymentLinkedInput
  bankQRCode: PaymentBankQRCodeInput
  bankTransfer: PaymentBankTransferInput
  creditCard: PaymentCreditCardInput
  paymeCredit: PaymentPaymeCreditInput
  momo: PaymentMoMoQRInput
  zaloPay: PaymentZaloPayInput
  # bankCardPG: PaymentBankCardPGInput
  # bankQRCodePG: PaymentBankQRCodeInput
  # creditCardPG: PaymentCreditCardInput
}
`;
