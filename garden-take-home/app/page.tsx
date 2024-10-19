import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Patent Database
        </h1>
        <div className="flex mt-6">
          <Link href="/signup" className="mx-4 px-6 py-2 rounded-md bg-blue-600 text-white">
            Sign Up
          </Link>
          <Link href="/login" className="mx-4 px-6 py-2 rounded-md bg-green-600 text-white">
            Log In
          </Link>
        </div>
      </main>
    </div>
  );
}
