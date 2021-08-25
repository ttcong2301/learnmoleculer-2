module.exports = {
	// day danh cho methodData
	RESOLVE_TYPE: {
		WALLET: 'PaymentWalletObject',
		BANK_CARD: 'PaymentBankCardObject',
		BANK_QR_CODE: 'PaymentBankQRCode',
		BANK_TRANSFER: 'PaymentBankAccountObject ',
		LINKED: 'PaymentLinkedObject',
		CREDIT_CARD: 'PaymentCreditCardResponsed',
		PAYME_CREDIT: 'PaymeCreditPaymentObject',
		BANK_CARD_PG: 'PaymentBankCardPGObject',
		CREDIT_CARD_PG: 'PaymentCreditCardObject',
		MOMO_PG: 'PaymentMoMoPGObject',
		ZALOPAY_PG: 'PaymentZaloPayPGObject',
	},

	SERVICE_CODE: {
		DEPOSIT: 'DEPOSIT',
	},
	METHOD_CODE: {
		WALLET: 'WALLET',
		BANK_CARD: 'BANK_CARD',
		BANK_QR_CODE: 'BANK_QR_CODE',
		BANK_TRANSFER: 'BANK_TRANSFER',
		LINKED: 'LINKED',
		CREDIT_CARD: 'CREDIT_CARD',
		PAYME_CREDIT: 'PAYME_CREDIT',
		// PAYME_PG: 'PAYME_PG', // Pttt la PayME ben CTT
		BANK_CARD_PG: 'BANK_CARD_PG', // Thhanh toan bankCard qua duong CTT(payment Gateway)
		MOMO_PG: 'MOMO_PG', // Thanh toan MOMO qua duong CTT(Payment Gateway)
		CREDIT_CARD_PG: 'CREDIT_CARD_PG', // Thanh toan Credit Card qua duong CTT(Payment Gateway)
		BANK_QR_CODE_PG: 'BANK_QR_CODE_PG',
		ZALOPAY_PG: 'ZALOPAY_PG',
		BANK_TRANSFER_PG: 'BANK_TRANSFER_PG',
	},
	STATE: {
		SUCCEEDED: 'SUCCEEDED',
		FAILED: 'FAILED',
		PENDING: 'PENDING',
		REFUNDED: 'REFUNDED',
		REQUIRED_OTP: 'REQUIRED_OTP',
		REQUIRED_VERIFY: 'REQUIRED_VERIFY',
		BALANCE_NOT_ENOUGHT: 'BALANCE_NOT_ENOUGHT',
		REQUIRED_TRANSFER: 'REQUIRED_TRANSFER',
		INVALID_PARAMS: 'INVALID_PARAMS',
		OTP_RETRY_TIMES_OVER: 'OTP_RETRY_TIMES_OVER',
		INVALID_OTP: 'INVALID_OTP',
		INVALID_SECURITY_CODE: 'INVALID_SECURITY_CODE', // invalid security code
	},
	SUPPLIER: {
		NAPAS_GATEWAY: 'NAPAS_GATEWAY',
		PVCOMBANK: 'PVCOMBANK',
		OCBBANK: 'OCBBANK',
		BIDVBANK: 'BIDVBANK',
		PG: 'PG',
		VIETINBANK: 'VIETINBANK',
	},
	PAYMENT_TYPE: {
		WALLET: 'WALLET',
		BANK_CARD: 'BANK_CARD',
		BANK_ACCOUNT: 'BANK_ACCOUNT',
		BANK_QR_CODE: 'BANK_QR_CODE',
		BANK_TRANSFER: 'BANK_TRANSFER',
		LINKED: 'LINKED',
		CREDIT_CARD: 'CREDIT_CARD',
		PAYME_CREDIT: 'PAYME_CREDIT',
		PAYME_PG: 'PAYME_PG', // Pttt la PayME ben CTT,
		OPEN_EWALLET_PG: 'OPEN_EWALLET_PG', // OpenEWalletPaymentGateWay
		BANK_CARD_PG: 'BANK_CARD_PG', // Thhanh toan bankCard qua duong CTT(payment Gateway)
		MOMO_PG: 'MOMO_PG', // Thanh toan MOMO qua duong CTT(Payment Gateway)
		CREDIT_CARD_PG: 'CREDIT_CARD_PG', // Thanh toan Credit Card qua duong CTT(Payment Gateway),
		BANK_QR_CODE_PG: 'BANK_QR_CODE_PG',
		ZALOPAY_PG: 'ZALOPAY_PG',
	},
	PAYCODE: {
		PAYME: 'PAYME',
		ATM: 'ATM',
		MANUAL_BANK: 'MANUAL_BANK',
		VN_PAY: 'VN_PAY',
		CREDIT: 'CREDIT',
		MOMO: 'MOMO',
		ZALO_PAY: 'ZALO_PAY',
	},
};
