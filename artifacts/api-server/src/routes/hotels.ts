import { Router, type IRouter } from "express";
import {
  SearchHotelsResponse,
  GetHotelDetailResponse,
  GetHotelRoomsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const hotelTemplates = [
  {
    name: "The Taj Mahal Palace",
    category: "5 Star Luxury",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "Gym", "WiFi", "Room Service", "Concierge", "Valet Parking", "Business Center"],
    basePrice: 18000,
    description: "An iconic landmark of luxury and elegance, The Taj Mahal Palace offers world-class hospitality with breathtaking views. Each room is meticulously designed with fine furnishings, and the hotel offers exceptional dining experiences from the finest local and international cuisines.",
  },
  {
    name: "Oberoi Grand",
    category: "5 Star Luxury",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "WiFi", "Concierge", "24h Front Desk", "Airport Shuttle"],
    basePrice: 15000,
    description: "Standing tall as a heritage landmark, Oberoi Grand is synonymous with understated luxury. The hotel features elegantly appointed rooms, an outdoor pool, and award-winning restaurants that showcase the best of Indian and continental cuisine.",
  },
  {
    name: "ITC Grand",
    category: "5 Star",
    amenities: ["Restaurant", "Bar", "WiFi", "Gym", "Business Center", "Conference Rooms", "Swimming Pool"],
    basePrice: 12000,
    description: "ITC Grand combines responsible luxury with world-class hospitality. Featuring spacious rooms designed with sustainable practices, the hotel offers multiple dining options and state-of-the-art conference facilities for business travelers.",
  },
  {
    name: "Marriott Executive Apartments",
    category: "5 Star",
    amenities: ["Swimming Pool", "Gym", "Restaurant", "WiFi", "Parking", "Kitchenette", "Laundry Service"],
    basePrice: 10000,
    description: "Perfect for extended stays or families, Marriott Executive Apartments offer spacious, apartment-style accommodations with all the amenities of a luxury hotel. Fully equipped kitchenettes and separate living areas ensure a home-away-from-home experience.",
  },
  {
    name: "Hyatt Regency",
    category: "5 Star",
    amenities: ["Swimming Pool", "Spa", "Restaurant", "Bar", "WiFi", "Gym", "Tennis Court", "Kids Club"],
    basePrice: 9500,
    description: "Hyatt Regency offers a premium blend of leisure and business facilities. Its stunning pool complex, award-winning spa, and diverse dining options make it a preferred choice for both leisure and corporate travelers seeking modern luxury.",
  },
  {
    name: "Radisson Blu",
    category: "4 Star",
    amenities: ["Restaurant", "Bar", "WiFi", "Gym", "Conference Room", "Business Center", "Parking"],
    basePrice: 6500,
    description: "Radisson Blu combines contemporary design with comfort and convenience. Its centrally located property features stylish rooms, multiple food and beverage outlets, and comprehensive business facilities making it ideal for corporate travelers.",
  },
  {
    name: "Novotel",
    category: "4 Star",
    amenities: ["Restaurant", "WiFi", "Gym", "Swimming Pool", "Bar", "24h Room Service"],
    basePrice: 5500,
    description: "Novotel offers a perfect balance of comfort and value. The hotel's contemporary rooms are designed for relaxation, while its recreational facilities including a pool and fitness center ensure guests can unwind after a long day.",
  },
  {
    name: "Holiday Inn",
    category: "4 Star",
    amenities: ["Restaurant", "WiFi", "Parking", "Gym", "Meeting Rooms", "24h Front Desk"],
    basePrice: 4500,
    description: "A reliable choice for both leisure and business travelers, Holiday Inn offers comfortable rooms and essential amenities at competitive prices. Its central location and consistent service standards make it a trusted hospitality brand.",
  },
  {
    name: "Lemon Tree Hotels",
    category: "3 Star",
    amenities: ["Restaurant", "WiFi", "Parking", "Air Conditioning", "Bar", "Gym"],
    basePrice: 3000,
    description: "Lemon Tree Hotels bring a refreshing spirit to mid-market hospitality. Known for their vibrant design, friendly service, and value-for-money proposition, they are the perfect choice for budget-conscious travelers who don't want to compromise on comfort.",
  },
  {
    name: "FabHotels",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "24/7 Helpdesk", "Free Breakfast", "Daily Housekeeping"],
    basePrice: 1800,
    description: "FabHotels offer smart, comfortable stays at wallet-friendly prices. Each property is quality-certified with standardized amenities including complimentary breakfast, ensuring you get the best value for your money at every destination.",
  },
  {
    name: "OYO Rooms",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "TV", "24h Check-in", "Clean Linen"],
    basePrice: 1200,
    description: "OYO Rooms revolutionized budget hospitality with its technology-driven approach to affordable stays. Offering standardized amenities across thousands of properties, OYO ensures a consistent and comfortable experience wherever you travel.",
  },
  {
    name: "Treebo Hotels",
    category: "Budget",
    amenities: ["WiFi", "Air Conditioning", "Free Breakfast", "TV", "Daily Housekeeping", "Toiletries"],
    basePrice: 2200,
    description: "Treebo Hotels redefines budget travel with a focus on quality and transparency. With complimentary breakfast, clean and comfortable rooms, and consistent service standards, Treebo makes budget travel a truly pleasant experience.",
  },
];

const imageUrls = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
];

const galleryImages = [
  [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop",
  ],
  [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
  ],
];

const streets = [
  "Connaught Place", "MG Road", "Park Street", "Marine Drive", "Banjara Hills",
  "Koregaon Park", "Indiranagar", "T Nagar", "Sector 17", "Civil Lines",
];

const reviews = [
  { author: "Priya Sharma", avatar: "PS", rating: 5, title: "Absolutely stunning!", comment: "The service was impeccable and the rooms were beautifully designed. Would definitely visit again!", helpful: 24 },
  { author: "Rahul Verma", avatar: "RV", rating: 4, title: "Great value for money", comment: "Clean rooms, friendly staff, and excellent breakfast. The pool area was a highlight of our stay.", helpful: 18 },
  { author: "Anita Patel", avatar: "AP", rating: 5, title: "Perfect weekend getaway", comment: "Everything was perfect - the location, the food, the service. Our family loved every moment.", helpful: 31 },
  { author: "Vikram Singh", avatar: "VS", rating: 3, title: "Good but could be better", comment: "The location is convenient and rooms are comfortable. Service was a bit slow during peak hours.", helpful: 7 },
  { author: "Meera Nair", avatar: "MN", rating: 5, title: "Luxury at its finest", comment: "The spa services were exceptional and the dining options were world-class. A truly indulgent experience.", helpful: 42 },
  { author: "Arjun Khanna", avatar: "AK", rating: 4, title: "Business traveler approved", comment: "Great WiFi, comfortable work desk, and the conference facilities are top-notch. Will book again for business trips.", helpful: 15 },
];

function createHotelFromTemplate(template: typeof hotelTemplates[0], index: number, city: string) {
  const variance = (Math.random() * 0.3 - 0.15);
  const price = Math.round(template.basePrice * (1 + variance));
  const discount = Math.floor(Math.random() * 30);
  const id = `HTL${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    name: template.name,
    city,
    address: `${Math.floor(Math.random() * 100) + 1}, ${streets[index % streets.length]}, ${city}`,
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 3000) + 100,
    pricePerNight: price,
    amenities: template.amenities,
    imageUrl: imageUrls[index % imageUrls.length],
    category: template.category,
    discount,
  };
}

// GET /hotels/search
router.get("/search", (req, res) => {
  const { city, checkIn, checkOut, guests = "1", rooms = "1" } = req.query as {
    city: string; checkIn: string; checkOut: string; guests?: string; rooms?: string;
  };

  if (!city || !checkIn || !checkOut) {
    res.status(400).json({ error: "city, checkIn, and checkOut are required" });
    return;
  }

  const hotels = hotelTemplates.map((h, i) => createHotelFromTemplate(h, i, city));
  const data = SearchHotelsResponse.parse(hotels);
  res.json(data);
});

// GET /hotels/:hotelId
router.get("/:hotelId", (req, res) => {
  const { hotelId } = req.params;
  const index = parseInt(hotelId.replace("HTL", "")) - 1;

  if (isNaN(index) || index < 0 || index >= hotelTemplates.length) {
    res.status(404).json({ error: "Hotel not found" });
    return;
  }

  const template = hotelTemplates[index];
  const base = createHotelFromTemplate(template, index, "Mumbai");
  const gallery = galleryImages[index % galleryImages.length];

  const detail = {
    ...base,
    images: gallery,
    description: template.description,
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      pets: "Pets not allowed",
    },
    reviews: reviews.slice(0, 4).map((r, i) => ({
      id: `REV${i + 1}`,
      author: r.author,
      avatar: r.avatar,
      rating: r.rating,
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      title: r.title,
      comment: r.comment,
      helpful: r.helpful,
    })),
    latitude: 19.076 + (Math.random() - 0.5) * 0.1,
    longitude: 72.877 + (Math.random() - 0.5) * 0.1,
  };

  const data = GetHotelDetailResponse.parse(detail);
  res.json(data);
});

// GET /hotels/:hotelId/rooms
router.get("/:hotelId/rooms", (req, res) => {
  const { hotelId } = req.params;
  const index = parseInt(hotelId.replace("HTL", "")) - 1;

  if (isNaN(index) || index < 0 || index >= hotelTemplates.length) {
    res.status(404).json({ error: "Hotel not found" });
    return;
  }

  const basePrice = hotelTemplates[index].basePrice;

  const roomTypes = [
    {
      id: `${hotelId}_STDL`,
      name: "Standard Room",
      description: "A comfortable room with all essential amenities for a pleasant stay. Features a plush king/twin bed configuration.",
      maxGuests: 2,
      size: "25 sqm",
      bedType: "King Bed",
      pricePerNight: basePrice,
      originalPrice: Math.round(basePrice * 1.3),
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
      ],
      amenities: ["King Bed", "AC", "WiFi", "TV", "Safe", "Toiletries"],
      available: Math.floor(Math.random() * 5) + 2,
      refundable: true,
      mealIncluded: "Room Only",
    },
    {
      id: `${hotelId}_DLXL`,
      name: "Deluxe Room",
      description: "Spacious and elegantly furnished, our Deluxe Rooms offer enhanced comfort with premium bedding and a dedicated work area.",
      maxGuests: 2,
      size: "35 sqm",
      bedType: "King Bed",
      pricePerNight: Math.round(basePrice * 1.4),
      originalPrice: Math.round(basePrice * 1.8),
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
      ],
      amenities: ["King Bed", "AC", "WiFi", "Smart TV", "Minibar", "City View", "Bathtub"],
      available: Math.floor(Math.random() * 4) + 1,
      refundable: true,
      mealIncluded: "Breakfast Included",
    },
    {
      id: `${hotelId}_SUTL`,
      name: "Junior Suite",
      description: "Experience elevated luxury in our Junior Suite with a separate living area, premium bath amenities, and panoramic city views.",
      maxGuests: 3,
      size: "55 sqm",
      bedType: "King Bed + Sofa",
      pricePerNight: Math.round(basePrice * 2.1),
      originalPrice: Math.round(basePrice * 2.7),
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&h=500&fit=crop",
      ],
      amenities: ["King Bed", "Sofa Bed", "Living Area", "AC", "WiFi", "Smart TV", "Minibar", "Jacuzzi", "Butler Service"],
      available: Math.floor(Math.random() * 3) + 1,
      refundable: true,
      mealIncluded: "Breakfast + Dinner",
    },
    {
      id: `${hotelId}_TWNL`,
      name: "Twin Room",
      description: "Ideal for friends or colleagues traveling together, our Twin Rooms feature two comfortable single beds and modern amenities.",
      maxGuests: 2,
      size: "28 sqm",
      bedType: "2 Twin Beds",
      pricePerNight: Math.round(basePrice * 0.9),
      originalPrice: Math.round(basePrice * 1.2),
      images: [
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop",
      ],
      amenities: ["2 Twin Beds", "AC", "WiFi", "TV", "Wardrobe", "Desk"],
      available: Math.floor(Math.random() * 6) + 2,
      refundable: false,
      mealIncluded: "Room Only",
    },
  ];

  const data = GetHotelRoomsResponse.parse(roomTypes);
  res.json(data);
});

export default router;
