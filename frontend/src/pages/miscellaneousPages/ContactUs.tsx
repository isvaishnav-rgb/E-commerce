import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="bg-indigo-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Questions or support? Reach out and we’ll help you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="text-indigo-600 w-6 h-6" />, title: "Email", desc: "support@apnamart.com" },
              { icon: <Phone className="text-indigo-600 w-6 h-6" />, title: "Phone", desc: "+91 9XXXXXXXXX" },
              { icon: <MapPin className="text-indigo-600 w-6 h-6" />, title: "Location", desc: "India" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form className="space-y-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="relative">
              <input
                type="text"
                id="name"
                className="w-full border rounded-xl px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 peer"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-indigo-600 peer-focus:text-sm"
              >
                Your Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                className="w-full border rounded-xl px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 peer"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-indigo-600 peer-focus:text-sm"
              >
                Your Email
              </label>
            </div>

            <div className="relative">
              <textarea
                id="message"
                rows={4}
                className="w-full border rounded-xl px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 peer resize-none"
                required
              />
              <label
                htmlFor="message"
                className="absolute left-3 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-indigo-600 peer-focus:text-sm"
              >
                Your Message
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-3 rounded-xl font-semibold shadow hover:scale-105 transform transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
