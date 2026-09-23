import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Globe3D from "@/components/Globe3D";
import TripMap from "@/components/TripMap";

const prisma = new PrismaClient();

export default async function SharedTripPage({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id }
  });

  if (!trip) {
    return notFound();
  }

  const itinerary = JSON.parse(trip.itineraryData);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Shared Trip: {trip.destination}
          </h1>
          <p className="text-gray-400 text-lg">Curated by Voyage AI</p>
        </div>

        <div className="glass-panel p-6 bg-white/5 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-sm font-bold text-gray-400 uppercase">Estimated Budget</span>
              <div className="text-2xl font-black">${trip.budget}</div>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-400 uppercase">Duration</span>
              <div className="text-2xl font-black">{trip.days} Days</div>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-400 uppercase">Rating</span>
              <div className="text-2xl font-black text-amber-500">★ {itinerary.predicted_rating || 4.5}</div>
            </div>
          </div>

          {itinerary.coordinates && (
            <div className="mb-8">
              <TripMap lat={itinerary.coordinates.lat} lon={itinerary.coordinates.lon} destination={trip.destination} />
            </div>
          )}

          <div className="space-y-6 mt-8">
            {itinerary.days?.map((day: any, idx: number) => (
              <div key={idx} className="bg-black/20 p-6 rounded-2xl border-l-4 border-cyan-500">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Day {day.day}: {day.title}</h3>
                <div className="space-y-3">
                  {day.morning && <p><span className="text-gray-400 font-bold w-24 inline-block">Morning:</span> {day.morning}</p>}
                  {day.afternoon && <p><span className="text-gray-400 font-bold w-24 inline-block">Afternoon:</span> {day.afternoon}</p>}
                  {day.evening && <p><span className="text-gray-400 font-bold w-24 inline-block">Evening:</span> {day.evening}</p>}
                  {day.full_day && <p><span className="text-gray-400 font-bold w-24 inline-block">Full Day:</span> {day.full_day}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
