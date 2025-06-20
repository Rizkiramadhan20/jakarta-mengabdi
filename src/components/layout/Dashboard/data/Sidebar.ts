import {
  House,
  Users,
  FileText,
  LayoutDashboard,
  Building2,
  Newspaper,
  Images,
  UserRoundPen,
  CircleUserRound,
  ArrowLeftRight,
  Gift,
} from "lucide-react";

export const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/dashboard/pages",
    label: "Pages",
    icon: FileText,
    subItems: [
      {
        href: "/dashboard/pages/home",
        label: "Home",
      },

      {
        href: "/dashboard/pages/about",
        label: "About",
      },

      {
        href: "/dashboard/pages/services",
        label: "Services",
      },

      {
        href: "/dashboard/pages/daily",
        label: "Daily",
      },

      {
        href: "/dashboard/pages/apps",
        label: "Apps",
      },

      {
        href: "/dashboard/pages/ongkir",
        label: "Ongkir",
      },
    ],
  },

  {
    href: "/dashboard/products",
    label: "Products",
    icon: Building2,
  },

  {
    href: "/dashboard/donasi",
    label: "Donasi",
    icon: Gift,
  },

  {
    href: "/dashboard/gallery",
    label: "Gallery",
    icon: Images,
  },

  {
    href: "/dashboard/transaction",
    label: "Transaksi",
    icon: ArrowLeftRight,
    subItems: [
      {
        href: "/dashboard/transaction/transaction",
        label: "Transaksi",
      },

      {
        href: "/dashboard/transaction/pending",
        label: "Tertunda",
      },

      {
        href: "/dashboard/transaction/delivery",
        label: "Pengiriman",
      },

      {
        href: "/dashboard/transaction/completed",
        label: "Selesai",
      },
    ],
  },

  {
    href: "/dashboard/testimonials",
    label: "Testimonials",
    icon: Users,
  },

  {
    href: "/dashboard/users",
    label: "Users",
    icon: CircleUserRound,
  },

  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: UserRoundPen,
  },

  {
    href: "/",
    label: "Back Home",
    icon: House,
  },
];
