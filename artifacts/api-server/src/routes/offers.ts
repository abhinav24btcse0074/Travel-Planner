import { Router, type IRouter } from "express";
import { GetOffersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const offersData = [
  {
    id: "OFF001",
    title: "Fly Smart, Pay Less",
    description: "Get flat 12% off on domestic flights. Valid on all routes. Book now and save big!",
    discount: "12% OFF",
    code: "FLYSMRT",
    validTill: "2026-04-30",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop",
    category: "flights",
  },
  {
    id: "OFF002",
    title: "Hotel Stay Bonanza",
    description: "Up to 40% off on premium hotels. Limited time offer. Use code at checkout.",
    discount: "40% OFF",
    code: "HOTBIG40",
    validTill: "2026-03-31",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop",
    category: "hotels",
  },
  {
    id: "OFF003",
    title: "International Travel Deal",
    description: "Save ₹3000 on international flights. Book tickets to any international destination.",
    discount: "₹3000 OFF",
    code: "INTL3K",
    validTill: "2026-05-15",
    imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=200&fit=crop",
    category: "flights",
  },
  {
    id: "OFF004",
    title: "Weekend Getaway Special",
    description: "Plan your weekend getaway with up to 25% off on hotel bookings.",
    discount: "25% OFF",
    code: "WKND25",
    validTill: "2026-04-15",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    category: "hotels",
  },
  {
    id: "OFF005",
    title: "Holiday Package Deal",
    description: "Book complete holiday packages and save up to ₹10,000. Includes flights + hotel.",
    discount: "₹10,000 OFF",
    code: "HLDAY10K",
    validTill: "2026-06-30",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=200&fit=crop",
    category: "packages",
  },
  {
    id: "OFF006",
    title: "First Booking Offer",
    description: "New user? Get ₹500 cashback on your first flight booking.",
    discount: "₹500 CASHBACK",
    code: "NEWUSER500",
    validTill: "2026-12-31",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=200&fit=crop",
    category: "flights",
  },
];

router.get("/", (_req, res) => {
  const data = GetOffersResponse.parse(offersData);
  res.json(data);
});

export default router;
