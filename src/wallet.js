class Wallet{

    constructor(amount=0) {
        this.amount = amount;
    }

    creditAmount(amount){
        if (!isNaN(amount))
            this.amount += amount

    }

    debitAmount(amount){
        if(!isNaN(amount) && this.amount >= Number(amount))
            this.amount -= amount;
    }

    getAmount(){
        return this.amount;
    }
}

module.exports ={Wallet};
