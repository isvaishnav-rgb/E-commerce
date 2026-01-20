import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const SUPPORT_LINKS = [
  { label: "FAQ", path: "/faq" },
  { label: "Returns", path: "/returns" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms & Conditions", path: "/terms" },
];

export const SOCIAL_LINKS = [
  {
    icon: FaFacebookF,
    color: "hover:text-blue-600",
    href: "#",
  },
  {
    icon: FaInstagram,
    color: "hover:text-pink-500",
    href: "#",
  },
  {
    icon: FaTwitter,
    color: "hover:text-sky-500",
    href: "#",
  },
  {
    icon: FaLinkedinIn,
    color: "hover:text-blue-700",
    href: "#",
  },
];