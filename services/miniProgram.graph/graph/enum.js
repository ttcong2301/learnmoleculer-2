const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql` 
enum MiniProgramPayEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Mở web xác thực"
  REQUIRED_VERIFY
  "Số dư không đủ"
  BALANCE_NOT_ENOUGHT
  "Sai PT thanh toan"
  INVALID_PARAMS
}

enum MiniProgramOrderInfoEnum {
  "Đang chờ thanh toán"
  PENDING
  "đã thanh toán"
  SUCCEEDED
  "thanh toán thất bại"
  FAILED
  "thanh toán bị từ chối"
  REJECTED
}

enum PaymentBankCardStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Mở web xác thực"
  REQUIRED_VERIFY
  "Sai ma xac thuc"
  INVALID_OTP
}

enum PaymentCreditCardStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Mở web xác thực"
  REQUIRED_VERIFY
}

enum PaymentWalletStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Số dư không đủ"
  BALANCE_NOT_ENOUGHT
}


enum PaymentBasicStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Sai PT thanh toan"
  INVALID_PARAMS
}

enum PaymentLinkedStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Xác thực OTP"
  REQUIRED_OTP
  "Yêu cầu xác thực (WebView)"
  REQUIRED_VERIFY
  "Qua gioi han OTP"
  OTP_RETRY_TIMES_OVER
  "Sai OTP"
  INVALID_OTP
}

enum NapasEnvEnum {
  MobileApp
  WebApp
}

enum PaymentBankQRCodeStateEnum {
  "Thành công"
  SUCCEEDED
  "Lỗi thanh toán"
  FAILED
  "Yêu cầu chuyển tiền"
  REQUIRED_TRANSFER
}

enum PaymentBankTransferStateEnum {
  "Thành công"
  SUCCEEDED
  "Yêu cầu chuyển tiền"
  REQUIRED_TRANSFER
  "Lỗi thanh toán"
  FAILED
}

enum PaymentMethodEnum {
  "thanh toán bằng Ví"
  WALLET
  "thanh toán bằng thẻ ATM"
  BANK_CARD
  "thanh toán bằng tài khoản"
  BANK_ACCOUNT
  "thanh toán bằng tk ngân hàng"
  BANK_QR_CODE
  "thanh toán bằng chuyển khoản thủ công"
  BANK_TRANSFER
  "thanh toán bằng thẻ credit card"
  CREDIT_CARD
  "thanh toán bằng thẻ lk"
  LINKED
  "Thanh toán bằng payment credit"
  PAYME_CREDIT
"// Thhanh toan bankCard qua duong CTT(payment Gateway)"
  BANK_CARD_PG
  "Thanh toan MOMO qua duong CTT(Payment Gateway)"
  MOMO_PG
  "Thanh toan CREDIT_CARD"
  CREDIT_CARD_PG
  "Thanh toán BAnk_QR_Code"
  BANK_QR_CODE_PG
  "Thanbh toan ZaloPAy"
  ZALOPAY_PG
 "Thanbh toan CKNH(PG)"
  BANK_TRANSFER_PG
}

enum PaymentStateEnum {
  PENDING
  SUCCEEDED
  FAILED
  TIMEOUT
  REFUNDED
  REQUIRED_OTP
  REQUIRED_TRANSFER
  REQUIRED_VERIFY
  "Sai OTP( voi OTP ngan hang)"
  INVALID_OTP
  "Số tiền không đủ"
  BALANCE_NOT_ENOUGHT
}

enum PaymentMethodUITypeEnum {
  ATM_CARD
  BANK_ACCOUNT
  VNPAY
}

`;
