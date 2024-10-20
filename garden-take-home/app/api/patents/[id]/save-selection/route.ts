import { NextRequest, NextResponse, userAgent } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { email, claimIds } = await req.json();
    const patentId = req.nextUrl.pathname.split('/').at(3);

    if (!email || !claimIds || !patentId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    const patentExists = await prisma.patents.findFirst({
        where: { id: { contains: patentId, mode: 'insensitive' } },
    });

    if (!patentExists) {
        return NextResponse.json({ message: 'Patent not found' }, { status: 404 });
    }


    try {
        // Find the user by email
        const user = await prisma.user.findFirst({
            where: { email: { contains: email, mode: 'insensitive' } },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Save the claim selection using Prisma
        await prisma.claimSelection.create({
            data: {
                userId: user.id,
                patentId,
                claimIds,
            },
        });

        return NextResponse.json({ message: 'Selection saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving selection:', error);
        return NextResponse.json({ message: 'Failed to save selection' }, { status: 500 });
    }
}
