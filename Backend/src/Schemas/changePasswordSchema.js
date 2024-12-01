// Third-Party Imports:
import z from 'zod';

const changePasswordSchema = z.object({
    old_password: z.string({
        required_error: 'Old password is required.',
    }),
    new_password: z
        .string({
            required_error: 'New password is required.',
        })
        .min(8, 'New password must be at lest 8 characters long.')
        .max(16, 'New password must be 16 characters or fewer.')
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[+.\-_*$@!?%&])(?=.*\d)[A-Za-z\d+.\-_*$@!?%&]+$/,
            { message: 'Invalid password.' }
        ),
});

export function validatePasswords(input) {
    return changePasswordSchema.safeParse(input);
}

export function validatePartialPasswords(input) {
    return changePasswordSchema.partial().safeParse(input);
}
