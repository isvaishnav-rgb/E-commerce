import Logo from "../../components/Logo";
import { features, infoCards } from "./miscellaneousPages.data";

const AboutUs = () => {
    // Array for feature cards
    return (
        <div className="relative bg-gradient-to-b from-indigo-50 via-white to-white min-h-screen py-20 px-4 overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-3">
                        About <Logo text="text-5xl md:text-6xl" />
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                        Making online shopping fast, secure, and enjoyable for everyone.
                    </p>
                </div>

                {/* Intro Text */}
                <div className="space-y-6 mb-16 text-center max-w-3xl mx-auto">
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        ApnaMart is a modern e-commerce platform that connects customers
                        with quality products while supporting trusted sellers.
                    </p>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                        Our goal is to provide a smooth shopping experience — from product
                        discovery to secure checkout and doorstep delivery.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {features.map((item, idx) => {
                        const Icon = item.icon; // assign component
                        return (
                            <div
                                key={idx}
                                className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition transform border border-gray-100 flex flex-col items-center text-center"
                            >
                                <div className="mb-3">
                                    <Icon className="w-6 h-6 text-indigo-600" /> {/* Render icon */}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Mission + Why Choose Us */}
                <div className="grid md:grid-cols-2 gap-10 mt-20">
                    {infoCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border hover:shadow-2xl hover:-translate-y-1 transition transform"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                {card.title}
                            </h3>

                            {/* If descList exists, render list */}
                            {card.descList ? (
                                <ul className="list-disc ml-5 space-y-1 text-gray-700 text-sm">
                                    {card.descList.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-700 text-sm">{card.desc}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
