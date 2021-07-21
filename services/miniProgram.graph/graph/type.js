const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`

type MiniProgramOps {
  "Định danh tài khoản"
  GetUserToken(input: MiniProgramGetUserTokenInput!): MiniProgramGetUserTokenResponsed
  "kiểm tra token KYC"
  GetOrderInformation(input: MiniProgramGetOrderInformationInput!): MiniProgramGetOrderInformationResponsed
  "Tạo KYC Token"
  Pay(input: MiniProgramPayInput!): MiniProgramPayResponsed
}

type MiniProgramGetUserTokenResponsed {
  "Token chứa Info và quyền của user"
  userToken: String
  message: String
  succeeded: Boolean
}

type MiniProgramGetOrderInformationResponsed {
  message: String
  succeeded: Boolean
  orderInfo: MiniProgramOrderInfo
}

type MiniProgramOrderInfo {
  name: String
  description: String
  amount: BigInt
  fee: BigInt
  total: BigInt
  partnerTransaction: String
  createdAt: DateTime
  state: MiniProgramOrderInfoEnum
}

type MiniProgramPayResponsed {
  succeeded: Boolean
  message: String
  orderInfo: MiniProgramOrderInfo
  redirectUrl: String
  failedUrl: String
}
`;
