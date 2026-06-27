import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js'; // We will need to create this temporary data file or define it here
import products from './data/products.js'; // Same here
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        // Create Admin and Users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // Create Categories
        const categoriesData = [
            { name: 'Electronics', description: 'Gadgets and devices' },
            { name: 'Clothing', description: 'Apparel for men and women' },
            { name: 'Home', description: 'Furniture and home decor' },
        ];
        const createdCategories = await Category.insertMany(categoriesData);

        // Map sample products to categories and admin user
        const sampleProducts = products.map((product) => {
            let categoryId;
            if (product.category === 'Electronics') categoryId = createdCategories[0]._id;
            else if (product.category === 'Clothing') categoryId = createdCategories[1]._id;
            else categoryId = createdCategories[2]._id;

            return { ...product, user: adminUser, category: categoryId };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
