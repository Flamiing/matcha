import UserModel from "../Models/UserModel.js";

class AuthController {
    static userModel = new UserModel();

    static testController(req, res) {
        return res.json({ test: "This is a test return" });
    }

    static async getAllUsers(req, res) {
        const users = await userModel.getAll();
        return res.json({ users: users });
    }
}

export default AuthController;
