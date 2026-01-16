const ServiceProviderForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Become a Service Provider
        </h2>
        <p className="text-gray-500 mb-6">
          Submit your details for verification. Our team will review and approve your account.
        </p>

        <form className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Type of Service
            </label>
            <select className="w-full border rounded-lg px-4 py-2">
              <option>Select service</option>
              <option>Product Seller</option>
              <option>Repair & Maintenance</option>
              <option>Home Services</option>
              <option>Other</option>
            </select>
          </div>

          {/* Aadhar Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Aadhaar Card
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full"
            />
          </div>

          {/* PAN Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload PAN Card
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              className="w-full"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Address
            </label>
            <textarea
              rows={3}
              placeholder="Enter complete address"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <p className="text-sm text-gray-600">
              I confirm that the information provided is correct and valid.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderForm;
