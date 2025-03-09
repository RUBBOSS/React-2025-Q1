import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found | Pokemon Explorer</title>
      </Head>
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

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Lost? Try searching for your favorite Pokemon on the home page.</p>
      </div>
    </>
  );
};

export default NotFoundPage;
