const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`

type MiniProgramOps {
  "Định danh tài khoản"
  GetUserToken(input: MiniProgramGetUserTokenInput!): MiniProgramGetUserTokenResponsed
  "kiểm tra token KYC"
  GetOrderInformation(input: MiniProgramGetOrderInformationInput!): MiniProgramGetOrderInformationResponsed
  "Tạo KYC Token"
  Pay(input: MiniProgramPayInput!): MiniProgramPayResponsed
  "Yêu cầu cấp quyền"
  RequestPermission(input: MiniProgramRequestPermissionInput!): MiniProgramRequestPermissionResponsed
  "Danh sách Mini Program"
  GetList(input: MiniProgramGetListInput): MiniProgramGetListResponsed
}

type MiniProgramGetUserTokenResponsed {
  "Token chứa Info và quyền của user"
  userToken: String
  message: String
  succeeded: Boolean
  state: MiniProgramGetUserTokenStateEnum
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

type MiniProgramRequestPermissionResponsed {
  succeeded: Boolean
  message: String
}

type MiniProgramGetListResponsed {
  succeeded: Boolean
  message: String
  miniProgram: [MiniProgramInfo]
}

type MiniProgramInfo {
  id: BigInt
  miniProgramId: BigInt
  state: MiniProgramStateEnum
  name: String
  logo: String
  url: String
}
`;
