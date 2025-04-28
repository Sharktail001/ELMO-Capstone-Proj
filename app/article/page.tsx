import { FaArrowLeft } from 'react-icons/fa';

export default function ArticlePage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Part */}
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">

        <h1 className="text-3xl font-bold text-center max-w-2xl mb-2">
          RFK Jr. is confirmed as Health and Human Services Secretary
        </h1>

        <p className="text-center text-gray-500 mb-6">Date: XYZ/XX/XXXX</p>

        {/* Placeholder for Image */}

        <div className="w-[28rem] h-[16rem] bg-black mb-6 rounded-md"></div>

        {/* Reading Modes */}

        <div className="flex flex-col gap-2 mb-6 w-64">
          <h2 className="text-md font-semibold text-center">Reading Modes</h2>
          <button className="w-full p-2 border rounded-md shadow-md bg-gray-200 text-gray-900 text-sm">
            Brief - Quick, easy-to-read summaries with key takeaways
          </button>
          <button className="w-full p-2 border rounded-md shadow-md bg-red-100 text-red-700 text-sm">
            Standard - Essential details
          </button>
          <button className="w-full p-2 border rounded-md shadow-md bg-gray-200 text-gray-900 text-sm">
            Deep Dive - In-depth reporting
          </button>
        </div>
      </main>
    </div>
  );
}