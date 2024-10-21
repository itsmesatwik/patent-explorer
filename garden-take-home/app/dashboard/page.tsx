import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import PatentTable from '../components/PatentTable';
import Navbar from '../components/Navbar';

const prisma = new PrismaClient();
const ITEMS_PER_PAGE = 10;

export default async function Dashboard({ searchParams }) {
    const session = await getServerSession();

    if (!session) {
        redirect('/login');
    }

    const page = parseInt(searchParams.page) || 1;
    const searchQuery = searchParams.search || '';

    const patents = await prisma.patents.findMany({
        where: {
            title: {
                contains: searchQuery,
                mode: 'insensitive',
            },
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    });

    const totalPatents = await prisma.patents.count({
        where: {
            title: {
                contains: searchQuery,
                mode: 'insensitive',
            },
        },
    });

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Patent Dashboard</h1>
                <PatentTable patents={patents} totalPatents={totalPatents} currentPage={page} itemsPerPage={ITEMS_PER_PAGE} searchQuery={searchQuery} />
            </div>
        </>
    );
}

