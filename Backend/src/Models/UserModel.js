import Model from '../Core/Model.js';

class UserModel extends Model {
    constructor() {
        super('users');
    }
}

const userModel = new UserModel();
export default userModel;
