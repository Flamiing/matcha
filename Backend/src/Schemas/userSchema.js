import z from 'zod';

const disallowedUsernames = [
    "admin",
    "root",
    "administrator",
    "system",
    "user",
    "guest",
    "support",
    "moderator",
    "superuser",
    "backup"
];

const userSchema = z.object({
    email: z.string({
        invalid_type_error: 'Invalid email.',
        required_error: 'Email is required.'
    }).email().trim().max(50, 'Email must be 50 characters or fewer.').min(3, 'Email must be at least 3 characters long'),
    username: z.string({
        invalid_type_error: 'Invalid username.',
        required_error: 'Username is required.'
    }).min(3, 'Username must be at least 3 characters long.')
    .max(30, 'Username must be 30 characters or fewer.')
    .regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, underscores, and periods.')
    .refine((name) => !/^[-._]/.test(name), {
      message: 'Username cannot start with a special character.',
    })
    .refine((name) => !disallowedUsernames.includes(username.toLowerCase()), {
        message: 'This username is not allowed.'
    }),
    first_name: z.string({
        invalid_type_error: 'Invalid first name.'
    })
    .min(3, 'First name must be at least 3 characters long.')
    .max(30, 'First name must be 30 characters or fewer.')
    .optional(),
    last_name: z.string({
        invalid_type_error: 'Invalid last name.'
    })
    .min(3, 'Last name must be at least 3 characters long.')
    .max(30, 'Last name must be 30 characters or fewer.')
    .optional(),
    password: z.string({

    }).min(8, 'Passoword must be at lest 8 characters long.')
    .max(16, 'Passoword must be 16 characters or fewer.')
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[+.\-_*$@!?%&])(?=.*\d)[A-Za-z\d+.\-_*$@!?%&]+$/, { message: 'Invalid password.' }),
    age: z.number({invalid_type_error: 'Invalid age.'}).int().min(18, 'Age must be at least 18.').max(99, 'Age must not be greater than 99.').optional(),
    biography: z.string({
        invalid_type_error: 'Invalid biography.'
    })
    .max(500, 'First name must be 500 characters or fewer.')
    .optional(),
    profile_picture: z.number({invalid_type_error: 'Invalid profile picture.'}).int().positive().nullable().optional(),
    location: z.string({invalid_type_error: 'Invalid location.'}).optional(),
    fame: z.number({invalid_type_error: 'Invalid fame rating.'}).optional(),
    last_online: z.string().optional(),
    is_online: z.string().optional(),
    gender: z.array(
        z.enum(['Male', 'Female'])
    ).optional(),
    sexual_preference: z.array(
        z.enum(['Male', 'Female', 'Bisexual'])
    ).optional(),
});

const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'Movie title must be a string.',
      required_error: 'Movie title is requiered.'
    }),
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    director: z.string(), 
    duration: z.number().int().positive(),
    poster: z.string().url({
      message: 'Poster must be a valid URL.'
    }),
    genre: z.array(
      z.enum(['Action', 'Drama', 'Comedy', 'Adventure', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi', 'Crime']),
      {
        required_error: 'Movie genre is required.',
        invalid_type_error: 'Movie genre must be an array of enum.'
      }
    ),
    rate: z.number().min(0).max(10).default(0)
  })
  
  export function validateUser(input) {
    return userSchema.safeParse(input)
  }
  
  export function validatePartialUser(input) {
    return userSchema.partial().safeParse(input)
  }