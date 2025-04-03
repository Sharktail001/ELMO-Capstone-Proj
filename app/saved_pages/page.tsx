import { FaHeart, FaPaintBrush, FaBasketballBall, FaBalanceScale } from 'react-icons/fa';

export default function SavedArticlesPage() {
    const collections = [
        { name: 'Favorites'},
        { name: 'Arts'},
        { name: 'Sports'},
        { name: 'Politics'},
      ];

  const recentArticles = [
    'Mikey Madison and Anora',
    'SAG Awards 2025',
    'The Rise of Spotify',
    'US War Plans Leaked',
  ];

  return (
    <div className="flex min-h-screen bg-white">

      {/* Side Nav Bar */}
      
      <aside className="w-64 bg-gray-100 p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-6">ELMO</h1>
        <nav className="space-y-4 text-gray-800 text-base font-medium">
          <div className="hover:text-red-500 cursor-pointer">Home</div>
          <div className="hover:text-red-500 cursor-pointer">Explore</div>
          <div className="hover:text-red-500 cursor-pointer">Ask ELMO</div>
          <div className="text-red-500 font-semibold">Saved</div>
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

      {/* Main Section */}

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <div className="self-start mb-2 text-2xl font-semibold text-gray-700">
          Welcome back, Christina 👋
        </div>

        <h1 className="text-3xl font-bold text-center mb-10">Saved Articles</h1>

        {/* Collections Grid */}

        <div className="grid grid-cols-2 gap-6 w-full max-w-xl mb-12">
          {collections.map(({ name, icon }) => (
            <button
              key={name}
              className="flex items-center justify-center py-5 rounded-lg border border-gray-300 text-lg font-semibold bg-red-100 text-gray-900 hover:bg-red-200 transition min-h-[4.5rem]"
            >
              {icon} {name}
            </button>
          ))}
        </div>

        {/* Add Collection Button */}

        <button className="mb-16 px-4 py-2 border rounded-full text-sm text-gray-700 hover:bg-gray-100 transition">
          Add Collection +
        </button>

        {/* Recently Saved Section */}

        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Recently Saved Articles</h2>
          <ul className="space-y-4">
            {recentArticles.map((title, i) => (
              <li
                key={i}
                className="border p-4 rounded-md hover:bg-gray-50 cursor-pointer transition"
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">
                  Blah blah blah ex.......
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}