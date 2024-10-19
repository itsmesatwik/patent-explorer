import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PatentTable from '../components/PatentTable';

const prisma = new PrismaClient();

export default async function Dashboard() {
    const session = await getServerSession();

    if (!session) {
        redirect('/login');
    }

    const patents = await prisma.patents.findMany({ take: 10 });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Patent Dashboard</h1>
            <PatentTable patents={patents} />
        </div>
    );
}