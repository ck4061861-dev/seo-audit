import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* BRAND */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              SeoAuditor
            </h2>
            <p className="text-sm text-gray-500">
              AI-powered SEO, AEO & GEO analysis platform to grow your visibility across search & AI engines.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li onClick={() => navigate("/")} className="hover:text-red-600 cursor-pointer">Site Audit</li>
              <li onClick={() => navigate("/seo")} className="hover:text-red-600 cursor-pointer">SEO Check</li>
              <li onClick={() => navigate("/aeo")} className="hover:text-red-600 cursor-pointer">AEO Analysis</li>
              <li onClick={() => navigate("/geo")} className="hover:text-red-600 cursor-pointer">GEO Visibility</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li onClick={() => navigate("/features")} className="hover:text-red-600 cursor-pointer">Features</li>
              <li onClick={() => navigate("/pricing")} className="hover:text-red-600 cursor-pointer">Pricing</li>
              <li className="hover:text-red-600 cursor-pointer">About</li>
              <li className="hover:text-red-600 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="hover:text-red-600 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-red-600 cursor-pointer">Terms of Service</li>
              <li className="hover:text-red-600 cursor-pointer">Refund Policy</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SeoAuditor. All rights reserved.
          </p>

          <div className="flex gap-4 text-gray-400 text-sm">
            <span className="hover:text-red-600 cursor-pointer">Twitter</span>
            <span className="hover:text-red-600 cursor-pointer">LinkedIn</span>
            <span className="hover:text-red-600 cursor-pointer">Facebook</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;