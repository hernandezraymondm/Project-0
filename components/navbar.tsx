import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with gradient text */}
        <Link
          href="/"
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 hover:from-pink-600 hover:to-purple-400 transition-all duration-300"
        >
          Space Shield
        </Link>

        {/* Navigation links with hover effects */}
        <div className="space-x-6 flex items-center">
          <Link
            href="/login"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group"
          >
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/register"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group"
          >
            Register
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/dashboard"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
