import { Router, type IRouter } from "express";
import { SearchHotelsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const hotelData = [
  {
    name: "The Taj Mahal Palace",
    category: "5 Star Luxury",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "Gym", "WiFi", "Room Service"],
    basePrice: 18000,
  },
  {
    name: "Oberoi Grand",
    category: "5 Star Luxury",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "WiFi", "Concierge"],
    basePrice: 15000,
  },
  {
    name: "ITC Hotels",
    category: "5 Star",
    amenities: ["Restaurant", "Bar", "WiFi", "Gym", "Business Center"],
    basePrice: 12000,
  },
  {
    name: "Marriott Executive Apartments",
    category: "5 Star",
    amenities: ["Swimming Pool", "Gym", "Restaurant", "WiFi", "Parking"],
    basePrice: 10000,
  },
  {
    name: "Hyatt Regency",
    category: "5 Star",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "WiFi", "Gym"],
    basePrice: 9500,
  },
  {
    name: "Radisson Blu",
    category: "4 Star",
    amenities: ["Restaurant", "Bar", "WiFi", "Gym", "Conference Room"],
    basePrice: 6500,
  },
  {
    name: "Novotel",
    category: "4 Star",
    amenities: ["Restaurant", "WiFi", "Gym", "Swimming Pool"],
    basePrice: 5500,
  },
  {
    name: "Holiday Inn",
    category: "4 Star",
    amenities: ["Restaurant", "WiFi", "Parking", "Gym"],
    basePrice: 4500,
  },
  {
    name: "Lemon Tree Hotels",
    category: "3 Star",
    amenities: ["Restaurant", "WiFi", "Parking", "Air Conditioning"],
    basePrice: 3000,
  },
  {
    name: "FabHotels",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "24/7 Helpdesk"],
    basePrice: 1800,
  },
  {
    name: "OYO Rooms",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "TV"],
    basePrice: 1200,
  },
  {
    name: "Treebo Hotels",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "Free Breakfast"],
    basePrice: 2200,
  },
];

const imageUrls = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=250&fit=crop",
];

const streets = [
  "Connaught Place", "MG Road", "Park Street", "Marine Drive", "Banjara Hills",
  "Koregaon Park", "Indiranagar", "T Nagar", "Sector 17", "Civil Lines",
];

router.get("/search", (req, res) => {
  const { city, checkIn, checkOut, guests = "1", rooms = "1" } = req.query as {
    city: string; checkIn: string; checkOut: string; guests?: string; rooms?: string;
  };

  if (!city || !checkIn || !checkOut) {
    res.status(400).json({ error: "city, checkIn, and checkOut are required" });
    return;
  }

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  );

  const hotels = hotelData.map((hotel, i) => {
    const variance = (Math.random() * 0.4 - 0.2);
    const price = Math.round(hotel.basePrice * (1 + variance));
    const discount = Math.floor(Math.random() * 30);
    return {
      id: `HTL${i + 1}${Date.now()}`,
      name: hotel.name,
      city,
      address: `${Math.floor(Math.random() * 100) + 1}, ${streets[i % streets.length]}, ${city}`,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 3000) + 100,
      pricePerNight: price,
      amenities: hotel.amenities,
      imageUrl: imageUrls[i % imageUrls.length],
      category: hotel.category,
      discount,
    };
  });

  const data = SearchHotelsResponse.parse(hotels);
  res.json(data);
});

export default router;
