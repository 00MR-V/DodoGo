export default function Home() {
  return (
    <main className="min-h-[70vh] grid place-items-center">
      <section className="text-center max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Plan smarter trips with <span className="text-blue-600">DodoGO</span>
        </h1>
        <p className="text-gray-600">
          Tell our AI how you like to travel and get a personalized itinerary,
          bookings, and live updates — all in one place.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/trips"
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
          >
            Get started
          </a>
          <a
            href="/profile"
            className="inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50 transition"
          >
            Set preferences
          </a>
        </div>
      </section>
    </main>
  );
}
