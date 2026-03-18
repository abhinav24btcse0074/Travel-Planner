import { Router, type IRouter } from "express";
import { GetPopularDestinationsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const destinationsData = [
  {
    id: "DEST001",
    name: "Goa",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
    startingPrice: 4999,
    description: "Sun, sand and sea - the perfect beach destination with vibrant nightlife",
    tags: ["Beach", "Nightlife", "Water Sports", "Heritage"],
  },
  {
    id: "DEST002",
    name: "Manali",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop",
    startingPrice: 6999,
    description: "Snow-capped mountains, adventure sports and serene valleys await you",
    tags: ["Mountains", "Adventure", "Snow", "Trekking"],
  },
  {
    id: "DEST003",
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
    startingPrice: 29999,
    description: "Experience the magic of Bali with its temples, rice terraces and beaches",
    tags: ["International", "Beach", "Culture", "Temples"],
  },
  {
    id: "DEST004",
    name: "Kerala",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
    startingPrice: 7999,
    description: "God's own country - backwaters, spices, and lush greenery",
    tags: ["Backwaters", "Nature", "Beaches", "Ayurveda"],
  },
  {
    id: "DEST005",
    name: "Dubai",
    country: "UAE",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
    startingPrice: 39999,
    description: "The city of gold - luxury shopping, stunning skyline and desert adventures",
    tags: ["International", "Luxury", "Shopping", "Desert Safari"],
  },
  {
    id: "DEST006",
    name: "Rajasthan",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop",
    startingPrice: 8999,
    description: "Explore the land of kings with magnificent forts, palaces and vibrant culture",
    tags: ["Heritage", "Culture", "Desert", "Palaces"],
  },
  {
    id: "DEST007",
    name: "Singapore",
    country: "Singapore",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
    startingPrice: 35999,
    description: "A modern city-state blending cultures, cuisines and futuristic attractions",
    tags: ["International", "Luxury", "Shopping", "Family"],
  },
  {
    id: "DEST008",
    name: "Andaman Islands",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    startingPrice: 12999,
    description: "Crystal clear waters, coral reefs and pristine beaches in the Bay of Bengal",
    tags: ["Beach", "Snorkeling", "Island", "Nature"],
  },
];

router.get("/popular", (_req, res) => {
  const data = GetPopularDestinationsResponse.parse(destinationsData);
  res.json(data);
});

export default router;
