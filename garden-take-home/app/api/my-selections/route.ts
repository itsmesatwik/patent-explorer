import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Invalid email parameter.' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { email: { contains: session.user.email, mode: 'insensitive' } },
        });
        const selections = await prisma.claimSelection.findMany({
            where: {
                userId: user?.id,
            },
            include: {
                patent: {
                    select: { title: true },
                },
            },
        });

        const formattedSelections = selections.map((selection) => ({
            id: selection.id,
            patentTitle: selection.patent.title,
            patentId: selection.patentId,
            claimIds: selection.claimIds,
            createdAt: selection.createdAt,
        }));

        return NextResponse.json(formattedSelections);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to fetch selections.' }, { status: 500 });
    }
}
