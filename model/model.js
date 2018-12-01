const db = require('../db')
const uuidv4 = require('uuid/v4')
const classes = {}

function check(obj, schema) {
    for(let key in schema) {
        if(typeof obj[key] == 'undefined') {
            throw new TypeError(`Object does not have key "${key}"`)
        }
        else if(typeof schema[key] == 'object' && typeof obj[key] == 'object') {
            if(schema[key] !== obj[key] && schema[key] != null && obj[key] != null) {
                check(obj[key], schema[key])
            }
        }
        else if(obj[key].constructor != schema[key]) {
            throw new TypeError(`The type of ${key} is not ${!schema[key].name ? typeof schema[key] : schema[key].name}. The invalid data is ${obj[key]}, type ${typeof obj[key]}`)
        }
    }
    return true
}

async function Model(name, schema) {
    let _col = await db.getCollection(name)
    if(classes[name]) {
        return classes[name]
    }
    let tmp = class {
        constructor(props, validation=true) {
            this.name = name
            this.props = props
            if(validation == true)
                check(props, schema)
        }

        static async getAll(options) {
            return await tmp.collection.find({}, options).toArray()
        }
    
        static async getById(id) {
            if(typeof id == 'undefined') {
                throw new TypeError('missing id')
            }
            let result = await tmp.collection.findOne({'_id': id})
            return result == null ? null : new tmp(result, false)
        }

        static async getBy(fields, options) {
            if(!fields) {
                return []
            }

            let result = await tmp.collection.find(fields)
            return result.toArray()
        }

        async save() {
            check(this.props, tmp.schema)
            if(typeof this.props['_id'] == 'undefined') {
                this.props._id = uuidv4()
            }
            return await tmp.collection.insertOne(this.props)
        }

        async updateAll() {
            check(this.props, tmp.schema)
            if(typeof this.props['_id'] == 'undefined') {
                throw new TypeError('can\'t update without _id')
            }
            return await tmp.collection.updateOne(
                {
                    _id: this.props._id
                },
                {
                    $set: this.props
                }
            )
        }

        async update(field) {
            if(typeof field != 'object' ) {
                throw new TypeError('updated field must be an object')
            }
            let tmp_obj = {
                ...this.props
            }
            for(let key in field) {
                if(typeof tmp.schema[key] != 'undefined') {
                    tmp_obj[key] = field[key]
                }
            }
            check(tmp_obj, tmp.schema)
            let result = await tmp.collection.updateOne(
                {
                    _id: tmp_obj._id
                },
                {
                    $set: tmp_obj
                }
            )
            this.props = tmp_obj
            return result
        }

        async delete() {
            if(!this.props._id) {
                throw new TypeError('Cannot delete this document, because there is no _id')
            }
            return await tmp.collection.deleteOne(
                {
                    _id: this.props._id
                }
            )
        }
    }
    tmp.schema = schema
    tmp.collection = _col
    classes[name] = tmp
    return tmp
}

// module.exports = Model
module.exports = async (name, props) => {
    return Model(name, props)
}