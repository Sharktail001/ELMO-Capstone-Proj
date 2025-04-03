import { FaArrowLeft } from 'react-icons/fa';

export default function ArticlePage() {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Side Nav Bar */}

      <aside className="w-64 bg-gray-100 p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-6">ELMO</h1>
        <nav className="space-y-4 text-gray-800 text-base font-medium">
          <div className="hover:text-red-500 cursor-pointer">Home</div>
          <div className="text-red-500 font-semibold">Explore</div>
          <div className="hover:text-red-500 cursor-pointer">Ask ELMO</div>
          <div className="hover:text-red-500 cursor-pointer">Saved</div>
          <div className="hover:text-red-500 cursor-pointer">Settings</div>
          <div className="hover:text-red-500 cursor-pointer">Logout</div>
        </nav>

        <div className="mt-10 text-base text-gray-800">
          <h2 className="font-semibold mb-2">Recent Reads</h2>
          <ul className="space-y-2 font-normal">
            <li className="hover:text-red-500 cursor-pointer">Israel-Gaza Conflict</li>
            <li className="hover:text-red-500 cursor-pointer">Ukraine-Russia Conflict</li>
            <li className="hover:text-red-500 cursor-pointer">World’s 50 Best Restaurants</li>
            <li className="hover:text-red-500 cursor-pointer">SAG Awards 2025</li>
            <li className="hover:text-red-500 cursor-pointer">Sotheby’s Auction</li>
            <li className="hover:text-red-500 cursor-pointer">Super Bowl 2025</li>
          </ul>
        </div>
      </aside>

      {/* Main Part */}

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <button className="self-start mb-6">
          <FaArrowLeft className="text-3xl text-black hover:opacity-70 transition" />
        </button>

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

        {/* Article Sample */}

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[40rem] text-sm text-gray-800 text-left leading-relaxed">
            <p>
              RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. RFK Jr. has officially been confirmed as the new Secretary of Health and Human Services. There was significant debate regarding this decision. RFK Jr.'s supporters believe he will change the face of public health. On the other hand, his critics are concerned about his past views and actions. Etc. etc. blah blah
            </p>
          </div>
        </div>

        {/* Sources */}

        <div className="mt-6 text-left w-full max-w-[40rem] text-sm">
          <h3 className="font-semibold mb-2">Sources</h3>
          <p>Article Source XYZ</p>
          <p>Article Source XYZ</p>
        </div>
      </main>
    </div>
  );
}