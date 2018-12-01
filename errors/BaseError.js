class BaseError extends Error {
    constructor(msg, status=200) {
        super(msg)
        this.errObj = {
            successs: false,
            msg
        }
        this.status = status
    }
}

module.exports = BaseError