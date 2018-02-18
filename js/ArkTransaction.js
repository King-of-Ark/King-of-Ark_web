//https://api.arkcoin.net/api/transactions?recipientId=AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR

class ArkTransaction {

	constructor(jsonResponse) {
		this.transaction = jsonResponse;
	}

	/*
		Returns the transaction as json
	*/
	getTransaction() {
		return this.transaction;
	}

	getId() {
		return this.transaction.id;
	}

	getBlockID() {
		return this.transaction.blockid;
	}

	getType() {
		return this.transaction.type;
	}

	getTimestamp() {
		return this.transaction.timestamp;
	}

	getAmount() {
		return this.transaction.amount;
	}

	getFee() {
		return this.transaction.fee;
	}

	getVendorField() {
		return this.transaction.vendorField;
	}

	getSenderId() {
		return this.transaction.senderId;
	}

	getRecipientId() {
		return this.transaction.recipientId;
	}

	getSenderPublicKey() {
		return this.transaction.senderPublicKey;
	}

	getSignature() {
		return this.transaction.signature;
	}

	getAsset() {
		return this.transaction.asset;
	}

	getConfirmations() {
		return this.transaction.confirmations;
	}
}