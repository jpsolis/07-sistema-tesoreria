import * as bcrypt from 'bcrypt';


interface SeedData {
    users: SeedUser[];
}

interface SeedUser{
    email: string;
    fullName: string,
    password: string;
    roles: string[];
}

export const initialData: SeedData  = {

    users: [
        {
            email: '123@456.com',
            fullName: 'Test Uno',
            password: bcrypt.hashSync( 'Abc123', 10),
            roles: ['admin']
        },
        {
            email: '345@678.com',
            fullName: 'Test Dos',
            password: bcrypt.hashSync( 'Abc123', 10),
            roles: ['user','super']
        },
    ],

}