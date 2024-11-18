import userModel from "../Models/UserModel.js";
import ErrorMessages from "../Utils/ErrorMessages.js";

export default class UsersController {
    static testController(req, res) {
        return res.json({ test: "This is a test return" });
    }

    static async getAllUsers(req, res) {
        const users = await userModel.getAll();
        if (users) return res.json({ users: users });
        return res.status(500).json({ error: ErrorMessages.QUERY_ERROR });
    }

    static async getUserById(req, res) {
        const { id } = req.params;

        const user = await userModel.getById({ id });
        if (user) {
            if (user.length === 0) return res.status(404).json({ error: ErrorMessages.NOT_FOUND_BY_ID });
            return res.json({ user: user });
        }
        return res.status(500).json({ error: ErrorMessages.QUERY_ERROR });
    }

    static async createUser(req, res) {
        const {
            email, username, first_name, last_name,
            password, age, biography, profile_picture,
            location, fame, last_online, is_online,
            gender, sexual_preference } = req.body;
        
        let input = {
            email: email,
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
            age: age, 
            biography: biography,
            profile_picture: profile_picture,
            location: location,
            fame: fame,
            last_online: last_online,
            is_online: is_online,
            gender: gender, 
            sexual_preference: sexual_preference
        }

        input = Object.keys(input).reduce((acc, key) => {
            if (input[key] !== undefined) {
                acc[key] = input[key];
            }
            return acc;
        }, {});

        const user = await userModel.create({ input });
        if (user) {
            if (user.length === 0) return res.status(404).json({ error: ErrorMessages.NOT_FOUND_BY_ID }); // TODO: Change error msg
            return res.json({ user: user });
        }
        return res.status(500).json({ error: ErrorMessages.QUERY_ERROR });
    }

    static async updateUser(req, res) {
        const {
            email, username, first_name, last_name,
            password, age, biography, profile_picture,
            location, fame, last_online, is_online,
            gender, sexual_preference } = req.body;

        const { id } = req.params;
        
        let input = {
            email: email,
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
            age: age, 
            biography: biography,
            profile_picture: profile_picture,
            location: location,
            fame: fame,
            last_online: last_online,
            is_online: is_online,
            gender: gender, 
            sexual_preference: sexual_preference
        }

        input = Object.keys(input).reduce((acc, key) => {
            if (input[key] !== undefined) {
                acc[key] = input[key];
            }
            return acc;
        }, {});

        const user = await userModel.update({ input, id });
        if (user) {
            if (user.length === 0) return res.status(404).json({ error: ErrorMessages.NOT_FOUND_BY_ID }); // TODO: Change error msg
            return res.json({ user: user });
        }
        return res.status(500).json({ error: ErrorMessages.QUERY_ERROR });
    }

    static async deleteUser(req, res) {
        const { id } = req.params;

        const user = await userModel.delete({ id });
        if (user !== null) {
            if (user === false) return res.status(404).json({ error: ErrorMessages.NOT_FOUND_BY_ID });
            return res.json({ user: user });
        }
        return res.status(500).json({ error: ErrorMessages.QUERY_ERROR });
    }
}
