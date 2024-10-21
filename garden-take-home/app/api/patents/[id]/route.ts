import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to handle GET requests to /api/patents/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Check if the patent ID exists in the mock data
    const patent = await prisma.patents.findFirst({
        where: {
            id: {
                equals: id,
                mode: 'insensitive',
            }
        }
    })

    if (!patent) {
        // If the patent is not found, return a 404 response
        return NextResponse.json({ error: 'Patent not found' }, { status: 404 });
    }

    // If the patent is found, return the patent data as a JSON response
    return NextResponse.json(patent);
}
