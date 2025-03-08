'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-4xl font-bold text-red-500">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>

        <Image
          src="/54.png"
          alt="Confused Psyduck"
          className="mx-auto"
          width={160}
          height={160}
          unoptimized
        />
        <p className="mt-4 text-lg text-gray-600">
          Psyduck is confused!
          <br />
          The page you're looking for doesn't exist.
        </p>
      </div>

      <div className="mt-6 flex flex-col space-y-3">
        <button
          onClick={() => router.push('/')}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Home Page
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Lost? Try searching for your favorite Pokemon on the home page.</p>
      </div>
    </div>
  );
}
