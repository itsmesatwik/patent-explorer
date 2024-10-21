// app/api/patents/[id]/selections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Get the session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const patentId = params.id;
    if (!patentId) {
        return NextResponse.json({ message: 'Invalid or missing patent ID' }, { status: 400 });
    }

    try {
        // Fetch the patent details
        const patent = await prisma.patents.findUnique({
            where: {
                id: patentId,
            },
        });

        if (!patent) {
            return NextResponse.json({ message: 'Patent not found' }, { status: 404 });
        }
        const user = await prisma.user.findFirst({
            where: { email: { contains: session.user.email, mode: 'insensitive' } },
        });

        // Fetch the claim selections for this user and patent
        const claimSelections = await prisma.claimSelection.findMany({
            where: {
                userId: user?.id,
                patentId: patentId,
            },
            select: {
                claimIds: true,
                createdAt: true,
            },
        });

        if (!claimSelections) {
            return NextResponse.json({ message: 'No selections found for this patent' }, { status: 404 });
        }

        // Respond with the patent and selection details
        return NextResponse.json({
            patent: patent,
            selections: claimSelections,
        });
    } catch (error) {
        console.error('Error fetching selections:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
