import { Link } from "react-router-dom";
import { QUICK_LINKS, SUPPORT_LINKS, SOCIAL_LINKS } from "./Footer.data";
import Logo from "../components/Logo";
const Footer = () => {
  const handleClick = () => {
      window.scrollTo({top: 0, behavior: "smooth"})
  }
  return (
    <footer className="bg-gray-200 text-grey-300">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Logo text={"text-2xl"}/>
            <p className="mt-3 text-sm text-gray-500">
              Your trusted multi-vendor e-commerce platform.
              Buy, sell, and manage products with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-indigo-600 font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="hover:text-indigo-400 transition"
                    onClick={handleClick}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-indigo-600 font-semibold mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2 text-sm">
              {SUPPORT_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="hover:text-indigo-400 transition"
                    onClick={handleClick}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-indigo-600 font-semibold mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(
                ({ icon: Icon, color, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="social link"
                  >
                    <Icon
                      className={`w-5 h-5 text-gray-800 ${color} transition cursor-pointer`}
                    />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <Logo text="text-sm"/>. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
