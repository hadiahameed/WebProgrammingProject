const Model = require('./model')

module.exports = async () => {
    const model = await Model('book', {
            // _id: String,
            name: String,
            author: String,
            reviews: Array
        }
    )
    return class extends model {
        constructor(props) {
            if(props instanceof model) {
                super(props.props)
            }
            else {
                super(props)
            }
        }
    
        static async getAll() {
            return await model.getAll({
                projection: {
                    _id: 1,
                    name: 1
                }
            })
        }
    }
}
