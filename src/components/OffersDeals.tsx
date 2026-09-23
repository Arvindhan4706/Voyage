"use client";

import { useState } from "react";

const offers = [
  { id: 1, title: "Domestic Flights", desc: "Up to Rs. 1500 OFF on Domestic Flights", code: "MMTSUPER", img: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=150&h=100&fit=crop" },
  { id: 2, title: "International Flights", desc: "Up to Rs. 5000 OFF on Intl Flights", code: "INTLOFFER", img: "https://images.unsplash.com/photo-1436491865332-7a61e109cc05?w=150&h=100&fit=crop" },
  { id: 3, title: "Hotels", desc: "Flat 20% OFF on Premium Hotels", code: "MMTHOTEL", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=100&fit=crop" },
  { id: 4, title: "Holidays", desc: "Grab AI-Curated Holiday Packages at 10% OFF", code: "HOLIDAYAI", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=150&h=100&fit=crop" },
];

export default function OffersDeals() {
  const [activeTab, setActiveTab] = useState("All Offers");

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 mt-20 relative z-20">
      <div className="bg-white rounded-xl mmt-shadow p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-black text-black">Offers</h2>
          
          <div className="flex gap-6">
            {['All Offers', 'Bank Offers', 'Flights', 'Hotels', 'Holidays', 'Cabs'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === tab ? 'text-[#008cff] border-[#008cff]' : 'text-gray-500 border-transparent hover:text-[#008cff]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map(offer => (
            <div key={offer.id} className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white">
              <img src={offer.img} alt={offer.title} className="w-[130px] h-[130px] object-cover rounded-md" />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">{offer.title}</p>
                  <h3 className="text-lg font-black text-black leading-tight">{offer.desc}</h3>
                  <div className="mt-2 w-8 h-1 bg-[#ea2330]"></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-dashed border-gray-300">
                    {offer.code}
                  </div>
                  <span className="text-sm font-bold text-[#008cff]">Book Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
