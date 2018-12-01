class BaseError extends Error {
    constructor(msg) {
        super(msg)
        this.errObj = {
            successs: false,
            msg
        }
    }
}

module.exports = BaseError