import { Router, type IRouter } from "express";
import {
  CreateBookingBody,
  GetBookingsResponse,
  GetBookingDetailResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const bookingsStore: any[] = [
  {
    id: "BK001",
    bookingRef: "MMT2026031801",
    hotelId: "HTL001",
    hotelName: "The Taj Mahal Palace",
    hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    city: "Mumbai",
    roomTypeId: "HTL001_DLXL",
    roomTypeName: "Deluxe Room",
    checkIn: "2026-04-10",
    checkOut: "2026-04-13",
    guests: 2,
    rooms: 1,
    pricePerNight: 25200,
    totalPrice: 75600,
    guestName: "Rajesh Kumar",
    guestEmail: "rajesh.kumar@email.com",
    guestPhone: "+91 98765 43210",
    specialRequests: "Late check-in requested",
    status: "confirmed",
    createdAt: new Date("2026-03-10").toISOString(),
    nights: 3,
  },
  {
    id: "BK002",
    bookingRef: "MMT2026031802",
    hotelId: "HTL003",
    hotelName: "ITC Grand",
    hotelImage: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop",
    city: "Delhi",
    roomTypeId: "HTL003_SUTL",
    roomTypeName: "Junior Suite",
    checkIn: "2026-05-15",
    checkOut: "2026-05-18",
    guests: 2,
    rooms: 1,
    pricePerNight: 37800,
    totalPrice: 113400,
    guestName: "Priya Sharma",
    guestEmail: "priya.sharma@email.com",
    guestPhone: "+91 98765 12345",
    specialRequests: "",
    status: "pending",
    createdAt: new Date("2026-03-12").toISOString(),
    nights: 3,
  },
  {
    id: "BK003",
    bookingRef: "MMT2026031803",
    hotelId: "HTL006",
    hotelName: "Radisson Blu",
    hotelImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop",
    city: "Bangalore",
    roomTypeId: "HTL006_STDL",
    roomTypeName: "Standard Room",
    checkIn: "2026-02-20",
    checkOut: "2026-02-22",
    guests: 1,
    rooms: 1,
    pricePerNight: 6500,
    totalPrice: 13000,
    guestName: "Vikram Singh",
    guestEmail: "vikram.singh@email.com",
    guestPhone: "+91 91234 56789",
    specialRequests: "Non-smoking room",
    status: "completed",
    createdAt: new Date("2026-02-05").toISOString(),
    nights: 2,
  },
];

let bookingCounter = bookingsStore.length + 1;

// GET /bookings
router.get("/", (_req, res) => {
  const data = GetBookingsResponse.parse(bookingsStore);
  res.json(data);
});

// POST /bookings
router.post("/", (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data", details: parsed.error.issues });
    return;
  }

  const body = parsed.data;
  const checkInDate = new Date(body.checkIn);
  const checkOutDate = new Date(body.checkOut);
  const nights = Math.max(
    1,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const booking = {
    id: `BK${String(bookingCounter).padStart(3, "0")}`,
    bookingRef: `MMT${Date.now()}`,
    hotelId: body.hotelId,
    hotelName: body.hotelName,
    hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    city: "India",
    roomTypeId: body.roomTypeId,
    roomTypeName: body.roomTypeName,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: body.guests,
    rooms: body.rooms,
    pricePerNight: body.pricePerNight,
    totalPrice: body.totalPrice,
    guestName: body.guestName,
    guestEmail: body.guestEmail,
    guestPhone: body.guestPhone,
    specialRequests: body.specialRequests || "",
    status: "confirmed" as const,
    createdAt: new Date().toISOString(),
    nights,
  };

  bookingCounter++;
  bookingsStore.push(booking);

  const data = GetBookingDetailResponse.parse(booking);
  res.status(201).json(data);
});

// GET /bookings/:bookingId
router.get("/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const booking = bookingsStore.find((b) => b.id === bookingId || b.bookingRef === bookingId);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const data = GetBookingDetailResponse.parse(booking);
  res.json(data);
});

export default router;
