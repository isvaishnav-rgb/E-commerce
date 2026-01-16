import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
//import Logo from "../assets/images/apnaMartLogo.png"

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-indigo-600">
                        <span>ApnaMart</span>
                    </Link>

                    {/* Desktop Menu */}
                    {/* <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/shop" className="nav-link">
              Shop
            </NavLink>
            <NavLink to="/about" className="nav-link">
              About
            </NavLink>
          </div> */}

                    {/* Search */}
                    <div className="hidden md:block">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/become-provider"
                            className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                        >
                            Become a Service Provider
                        </Link>
                        <Link to="/cart" className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                2
                            </span>
                        </Link>
                        <div className="flex gap-2 mx-3">
                            <Link
                                to="/login"
                                className="hidden md:inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden md:inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
                    {/* <NavLink to="/" className="block nav-link">
            Home
          </NavLink>
          <NavLink to="/shop" className="block nav-link">
            Shop
          </NavLink>
          <NavLink to="/about" className="block nav-link">
            About
          </NavLink> */}
                    <Link
                        to="/become-provider"
                        className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                    >
                        Become a Service Provider
                    </Link>
                    <NavLink
                        to="/login"
                        className="block text-center bg-indigo-600 text-white py-2 rounded-lg"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/signup"
                        className="block text-center bg-indigo-600 text-white py-2 rounded-lg"
                    >
                        Sign Up
                    </NavLink>
                </div>
            )}
        </nav>
    );
};

export default Header;
