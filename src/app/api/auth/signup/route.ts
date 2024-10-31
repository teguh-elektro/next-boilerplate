// src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Ensure this path is correct
import Users from '@/models/Users'; // Ensure this path is correct
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    await dbConnect(); // Connect to MongoDB
    const { name, email, password } = await req.json(); // Get email and password from the request body

    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 }); // Conflict status
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Users({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
    });
    const result = await newUser.save();
    console.log(result);

    await newUser.save(); // Save the new user to the database
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 }); // Created status
}
