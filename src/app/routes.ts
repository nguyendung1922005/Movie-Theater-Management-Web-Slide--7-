import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { MovieDetail } from "./pages/MovieDetail";
import { SeatSelection } from "./pages/SeatSelection";
import { Checkout } from "@/app/pages/Checkout";
import { Showtimes } from "./pages/Showtimes";
import { Movies } from "./pages/Movies";
import { Promotions } from "./pages/Promotions";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { BookingConfirmed } from "./pages/BookingConfirmed";
import { SearchResults } from "./pages/SearchResults";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ETicket } from "./pages/ETicket";
import { ComingSoon } from "./pages/ComingSoon";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminMovies } from "./pages/AdminMovies";
import { AdminShowtimes } from "./pages/AdminShowtimes";
import { AdminRooms } from "./pages/AdminRooms";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminMobile } from "./pages/AdminMobile";
import { AdminTablet } from "./pages/AdminTablet";
import { CineMobileHome } from "./pages/CineMobileHome";
import { CineMobileSeats } from "./pages/CineMobileSeats";
import { CineMobileCheckout } from "./pages/CineMobileCheckout";
import { CineTabletHome } from "./pages/CineTabletHome";
import { CineTabletMovie } from "./pages/CineTabletMovie";
import { CineTabletCheckout } from "./pages/CineTabletCheckout";
import { StaffPortalLayout } from "./components/StaffLayout";
import { StaffIndexRedirect } from "./pages/StaffIndexRedirect";
import { StaffShowtimes } from "./pages/StaffShowtimes";
import { StaffMovies } from "./pages/StaffMovies";
import { StaffCombos } from "./pages/StaffCombos";
import { StaffPOS } from "./pages/StaffPOS";
import { StaffScanner } from "./pages/StaffScanner";
import { StaffMembers } from "./pages/StaffMembers";
import { StaffVouchers } from "./pages/StaffVouchers";
import { StaffRefunds } from "./pages/StaffRefunds";
import { StaffShift } from "./pages/StaffShift";
import { StaffProfileSettings } from "./pages/StaffProfileSettings";
import { FinanceDashboard }    from "./pages/FinanceDashboard";
import { FinanceReports }      from "./pages/FinanceReports";
import { FinanceTransactions } from "./pages/FinanceTransactions";
import { FinanceShiftAudit } from "./pages/FinanceShiftAudit";
import { AdminRevenue } from "./pages/AdminRevenue";
import { AdminSettings } from "./pages/AdminSettings";
import { AdminPromotions } from "./pages/AdminPromotions";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminFeedback } from "./pages/AdminFeedback";
import { UserProfile } from "./pages/UserProfile";
import { MyTickets } from "./pages/MyTickets";

export const router = createBrowserRouter([
  { path: "/",                    Component: Home },
  { path: "/movies",              Component: Movies },
  { path: "/showtimes",           Component: Showtimes },
  { path: "/movie/:id",           Component: MovieDetail },
  { path: "/movie/:id/seats",     Component: SeatSelection },
  { path: "/movie/:id/checkout",  Component: Checkout },
  { path: "/checkout",            Component: Checkout },
  { path: "/promotions",          Component: Promotions },
  { path: "/login",               Component: Auth },
  { path: "/signup",              Component: Auth },
  { path: "/dashboard",           Component: Dashboard },
  { path: "/booking-confirmed",   Component: BookingConfirmed },
  { path: "/search",              Component: SearchResults },
  { path: "/forgot-password",     Component: ForgotPassword },
  { path: "/eticket",             Component: ETicket },
  { path: "/coming-soon",         Component: ComingSoon },
  { path: "/admin",               Component: AdminDashboard },
  { path: "/admin/movies",        Component: AdminMovies },
  { path: "/admin/showtimes",     Component: AdminShowtimes },
  { path: "/admin/rooms",         Component: AdminRooms },
  { path: "/admin/users",         Component: AdminUsers },
  { path: "/admin/mobile",        Component: AdminMobile },
  { path: "/admin/tablet",        Component: AdminTablet },
  { path: "/cine/mobile/home",    Component: CineMobileHome },
  { path: "/cine/mobile/seats",   Component: CineMobileSeats },
  { path: "/cine/mobile/checkout",Component: CineMobileCheckout },
  { path: "/cine/tablet/home",    Component: CineTabletHome },
  { path: "/cine/tablet/movie",   Component: CineTabletMovie },
  { path: "/cine/tablet/checkout",Component: CineTabletCheckout },
  {
    path: "/staff",
    Component: StaffPortalLayout,
    children: [
      { index: true, Component: StaffIndexRedirect },
      { path: "pos", Component: StaffPOS },
      { path: "members", Component: StaffMembers },
      { path: "vouchers", Component: StaffVouchers },
      { path: "refunds", Component: StaffRefunds },
      { path: "scanner", Component: StaffScanner },
      { path: "shift", Component: StaffShift },
      { path: "profile", Component: StaffProfileSettings },
      { path: "showtimes", Component: StaffShowtimes },
      { path: "movies", Component: StaffMovies },
      { path: "combos", Component: StaffCombos },
    ],
  },
  { path: "/finance/dashboard",    Component: FinanceDashboard    },
  { path: "/finance/reports",      Component: FinanceReports      },
  { path: "/finance/transactions", Component: FinanceTransactions },
  { path: "/finance/shift-audit", Component: FinanceShiftAudit },
  { path: "/admin/revenue",        Component: AdminRevenue        },
  { path: "/admin/settings",       Component: AdminSettings       },
  { path: "/admin/promotions",     Component: AdminPromotions     },
  { path: "/admin/inventory",      Component: AdminInventory      },
  { path: "/admin/feedback",       Component: AdminFeedback       },
  { path: "/profile",              Component: UserProfile         },
  { path: "/my-tickets",           Component: MyTickets           },
]);