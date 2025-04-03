import { GalleryVerticalEnd } from "lucide-react";

{/* RegistrationPage component */}

export default function RegistrationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white"> 
      
      <div className="grid lg:grid-cols-2 w-full">
        
        {/* Left section with the registration and branding part */}

        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              ELMO Inc.
            </a>
          </div>

          {/* Slogan section */}

          <div className="text-center mt-2">
            <h2 className="text-3xl font-bold leading-tight">
              Big Stories.<br />
              Little Details.
            </h2>
          </div>

          {/* Registration heading and description */}

          <div className="text-center">
            <h3 className="text-2xl font-bold">Register</h3>
            <br />
            <p className="text-sm text-gray-600">Enter your information to create an account</p>
          </div>

          {/* Registration form section */}

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs space-y-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input type="password" className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium">Confirm Password</label>
                  <input type="password" className="w-full p-2 border rounded-md" required />
                </div>
                <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded">Sign Up</button>
              </form>
              <p className="text-center text-sm text-gray-600">
                Already have an account? <a href="/login" className="underline underline-offset-4">Login</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right section- currently a placeholder */}

        <div className="relative hidden lg:block bg-gray-200 min-h-[400px] w-full">
          {/* Placeholder for an image */}

        </div>
      </div>

      {/* Section below the registration box */}

      <div className="w-full flex flex-col items-center justify-center py-10 gap-10">  

        {/* Category selection section */}

        <div className="w-full flex justify-center">
          <div className="max-w-3xl text-center">
            <h2 className="text-xl font-bold mb-4">
              What kind of articles are you looking for today?
            </h2>
            <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">

              {/* Buttons for the categories */}

              {categories.map((category, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-center p-3 border rounded-md shadow-md bg-white hover:bg-gray-200 transition"
                >
                  {/* Name and matching emoji */}

                  {category.emoji} {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* About section */}
        
        <div className="w-full flex justify-center">
          <div className="max-w-3xl text-center">
            <h2 className="text-2xl font-bold mb-4">What is ELMO?</h2>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed">
              ELMO (Evolving Learning Media Outlet) is a personalized news platform that curates and consolidates news based on user preferences. 
              By aggregating content from trusted sources and eliminating redundancy, ELMO delivers a seamless and clutter-free reading experience, 
              ensuring users stay informed effortlessly.
            </p>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed mt-4">
              To cater to diverse audiences, we offer multiple levels of reading comprehension—allowing users to customize their news consumption 
              based on their preferences and time. 🚀
            </p>
          </div>
        </div>

      </div>
      
    </div>
  );
}

{/* Article genre categories */}
const categories = [
  { name: "Breaking News & Current Events", emoji: "🌟" },
  { name: "Technology & Innovation", emoji: "🎮" },
  { name: "Science & Health", emoji: "🧪" },
  { name: "Travel", emoji: "✈️" },
  { name: "Entertainment & Media", emoji: "🎭" },
  { name: "Arts & Culture", emoji: "🎨" },
  { name: "Opinions & Deep Dives", emoji: "☘️" },
  { name: "Food", emoji: "🍕" },
  { name: "Sports & Lifestyle", emoji: "🏈" },
];
