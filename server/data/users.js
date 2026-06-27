import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'admin',
        address: {
            street: '123 Admin St',
            city: 'Admin City',
            state: 'AdminState',
            zip: '12345',
            country: 'AdminLand',
        },
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'user',
        address: {
            street: '456 User Lane',
            city: 'User City',
            state: 'UserState',
            zip: '67890',
            country: 'UserLand',
        },
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'user',
        address: {
            street: '789 Guest Rd',
            city: 'Guest City',
            state: 'GuestState',
            zip: '11223',
            country: 'GuestLand',
        },
    },
];

export default users;
