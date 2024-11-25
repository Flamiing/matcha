import { validateUser } from '../Schemas/userSchema.js';

export default class UserValidator {
    static async validate(user) {
        const result = validateUser(user);
        console.log('Validation Result: ', result);
    }
}