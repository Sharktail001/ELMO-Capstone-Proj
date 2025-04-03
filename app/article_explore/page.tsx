import { FaArrowLeft } from 'react-icons/fa';

export default function BreakingNewsPage() {
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

      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <FaArrowLeft className="text-3xl text-black hover:opacity-70 transition" />
          </button>
          <h1 className="text-3xl font-bold">Breaking News & Current Events</h1>
        </div>

        {/* News Placeholder */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-64 h-40 bg-black rounded-md mb-2"></div>
              <p className="text-center font-medium text-sm leading snug w-64">
                RFK is confirmed as Health and Human Services Secretary
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}