import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { log } from 'console';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        log(error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}