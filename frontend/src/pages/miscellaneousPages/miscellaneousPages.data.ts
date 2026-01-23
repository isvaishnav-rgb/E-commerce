import { Shield, Truck, Star, Users } from "lucide-react";
import { RotateCcw, CreditCard, Info } from "lucide-react";

export const features = [
    {
        icon: Star,
        title: "Trusted Sellers",
        desc: "Verified and reliable vendors.",
    },
    {
        icon: Shield,
        title: "Secure Payments",
        desc: "100% secure checkout process.",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        desc: "Quick and safe shipping.",
    },
    {
        icon: Users,
        title: "24/7 Support",
        desc: "We are here for you anytime.",
    },
];


// Array for mission / why choose us
export const infoCards = [
    {
        title: "Our Mission",
        desc: "To provide high-quality products at fair prices while ensuring complete customer satisfaction.",
    },
    {
        title: "Why Choose Us",
        descList: [
            "Trusted and verified sellers",
            "Secure and fast payments",
            "Quick delivery to your doorstep",
            "24/7 dedicated support team",
        ],
    },
];

export const faqs = [
    {
        q: "How do I place an order?",
        a: "Browse products, add items to your cart, and proceed to checkout."
    },
    {
        q: "What payment methods are accepted?",
        a: "We accept UPI, cards, net banking, and wallets."
    },
    {
        q: "Can I cancel my order?",
        a: "Yes, orders can be canceled before shipment."
    },
    {
        q: "How can I track my order?",
        a: "You’ll receive a tracking link once your order is shipped."
    }
];

export const policies = [
    "We collect basic information such as your name, email address, and delivery address.",
    "Your data is used solely for processing orders and providing customer support.",
    "We do not sell or share your personal information with third-party vendors.",
    "All payments are handled securely using trusted payment processors.",
];

// Array of return/refund policies
export const returns = [
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Returns accepted within 7 days of delivery.",
    },
    {
        icon: Truck,
        title: "Product Condition",
        description: "Items must be unused and in original packaging.",
    },
    {
        icon: CreditCard,
        title: "Refund Timeline",
        description: "Refunds processed within 5–7 business days.",
    },
    {
        icon: Info,
        title: "Shipping Charges",
        description: "Shipping fees are non-refundable.",
    },
];

// Array of terms
export const termsList = [
    "You must provide accurate and complete information when placing an order.",
    "Product prices, availability, and offers are subject to change without prior notice.",
    "We reserve the right to cancel or refuse any order at our discretion.",
    "Unauthorized use, copying, or distribution of website content is strictly prohibited."
];
