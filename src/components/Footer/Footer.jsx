import { BsHouse, BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import LogoIcon from "../../assets/images/logo.png"
import { Link } from "react-router-dom";

const accentColor = "#1D4ED8";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 border-t border-white/10">
      {/* Gradient Brand Line */}
      <div className="w-full h-1" style={{backgroundColor:accentColor}}></div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding */}
        <div className="space-y-4 flex flex-col items-center">
          <img src={LogoIcon} className="size-16 opacity-90 hover:opacity-100 transition" />

          <p className="text-gray-400 text-sm leading-relaxed text-center">
            Nexify — Connect, share, and inspire. Built for speed, designed for people.
          </p>
        </div>

        {/* About */}
        <div className="space-y-4 text-center">
          <h3 className="text-white font-semibold text-lg">Nexify</h3>
          <ul className="space-y-3 text-gray-400">
            <li>About Nexify</li>
            <li>Community Guidelines</li>
            <li>Safety & Support</li>
          </ul>
        </div>

        {/* Social / Quick Links */}
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <div className="flex items-center gap-4 text-gray-300 justify-center">
            <Link to="/home" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
              <BsHouse className="h-6 w-6" />
            </Link>
            <Link to="/profile" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
              <CgProfile className="h-6 w-6" />
            </Link>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition">
              <BsChatDots className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Nexify. All rights reserved.
      </div>
    </footer>
  );
}