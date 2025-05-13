const mongoose = require('mongoose');
const mongo_delete = require('mongoose-delete');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone_number: {type: String, required: true, unique: true},
    role:{type: String, enum:['admin', 'user'], default:'user'},
    is_active:{type:Boolean, default:true},
    is_deleted:{type:Boolean, default:false}
},{timestamps: true});

UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, username: this.username, role: this.role }, '2FxXT1NTf2K1Mo4i6AOvtdI', { expiresIn: '1h' });
}

UserSchema.plugin(mongo_delete, { overrideMethods: 'all' }, { deletedAt : true });
const User = mongoose.model('User', UserSchema);
module.exports = User;