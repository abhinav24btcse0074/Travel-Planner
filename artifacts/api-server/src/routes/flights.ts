import { Router, type IRouter } from "express";
import { SearchFlightsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const airlines = [
  { name: "IndiGo", code: "6E" },
  { name: "Air India", code: "AI" },
  { name: "SpiceJet", code: "SG" },
  { name: "Vistara", code: "UK" },
  { name: "GoAir", code: "G8" },
  { name: "AirAsia India", code: "I5" },
  { name: "Blue Dart", code: "BZ" },
];

const cityPairs = [
  { from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM" },
  { from: "Mumbai", fromCode: "BOM", to: "Delhi", toCode: "DEL" },
  { from: "Delhi", fromCode: "DEL", to: "Bangalore", toCode: "BLR" },
  { from: "Bangalore", fromCode: "BLR", to: "Delhi", toCode: "DEL" },
  { from: "Mumbai", fromCode: "BOM", to: "Chennai", toCode: "MAA" },
  { from: "Chennai", fromCode: "MAA", to: "Mumbai", toCode: "BOM" },
  { from: "Hyderabad", fromCode: "HYD", to: "Delhi", toCode: "DEL" },
  { from: "Kolkata", fromCode: "CCU", to: "Mumbai", toCode: "BOM" },
];

function generateFlights(from: string, to: string, date: string) {
  const results = [];
  const numFlights = Math.floor(Math.random() * 5) + 6;

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const depHour = Math.floor(Math.random() * 22) + 1;
    const depMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const durationMin = Math.floor(Math.random() * 90) + 90;
    const arrMin = depHour * 60 + depMin + durationMin;
    const arrHour = Math.floor(arrMin / 60) % 24;
    const arrMinutes = arrMin % 60;

    const pair = cityPairs.find(
      (p) => p.from.toLowerCase() === from.toLowerCase() && p.to.toLowerCase() === to.toLowerCase()
    );

    const basePrice = Math.floor(Math.random() * 5000) + 2500;
    const stops = Math.random() > 0.6 ? 0 : 1;

    results.push({
      id: `FL${Date.now()}${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
      from: pair?.from || from,
      fromCode: pair?.fromCode || from.substring(0, 3).toUpperCase(),
      to: pair?.to || to,
      toCode: pair?.toCode || to.substring(0, 3).toUpperCase(),
      departureTime: `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}`,
      arrivalTime: `${String(arrHour).padStart(2, "0")}:${String(arrMinutes).padStart(2, "0")}`,
      duration: `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`,
      stops,
      price: basePrice,
      class: "economy",
      seatsAvailable: Math.floor(Math.random() * 20) + 1,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    });
  }
  return results.sort((a, b) => a.price - b.price);
}

router.get("/search", (req, res) => {
  const { from, to, date, passengers = "1", class: flightClass = "economy" } = req.query as {
    from: string; to: string; date: string; passengers?: string; class?: string;
  };

  if (!from || !to || !date) {
    res.status(400).json({ error: "from, to, and date are required" });
    return;
  }

  const flights = generateFlights(from, to, date);
  const multiplier = flightClass === "business" ? 3 : flightClass === "first" ? 5 : 1;
  const adjustedFlights = flights.map((f) => ({
    ...f,
    class: flightClass as string,
    price: Math.round(f.price * multiplier),
  }));

  const data = SearchFlightsResponse.parse(adjustedFlights);
  res.json(data);
});

export default router;
