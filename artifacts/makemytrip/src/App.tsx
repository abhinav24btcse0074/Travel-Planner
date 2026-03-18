import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Flights from "@/pages/Flights";
import Hotels from "@/pages/Hotels";
import HotelDetail from "@/pages/HotelDetail";
import BookingPage from "@/pages/BookingPage";
import BookingConfirmation from "@/pages/BookingConfirmation";
import MyBookings from "@/pages/MyBookings";
import OffersPage from "@/pages/OffersPage";
import HolidayPackages from "@/pages/HolidayPackages";
import CabsPage from "@/pages/CabsPage";
import TrainsPage from "@/pages/TrainsPage";
import FlightBooking from "@/pages/FlightBooking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flights/:flightId/book" component={FlightBooking} />
      <Route path="/flights" component={Flights} />
      <Route path="/hotels/:id/book" component={BookingPage} />
      <Route path="/hotels/:id" component={HotelDetail} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/booking/confirmation/:id" component={BookingConfirmation} />
      <Route path="/my-bookings" component={MyBookings} />
      <Route path="/offers" component={OffersPage} />
      <Route path="/holidays" component={HolidayPackages} />
      <Route path="/cabs" component={CabsPage} />
      <Route path="/trains" component={TrainsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
