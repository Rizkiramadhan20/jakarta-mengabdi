import {
  House,
  Users,
  LayoutDashboard,
  Building2,
  UserRoundPen,
  ArrowLeftRight,
  HandCoins,
  Gift,
} from "lucide-react";

export const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
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
    href: "/dashboard/volunteer",
    label: "Volunteer",
    icon: Users,
  },

  {
    href: "/dashboard/kakak-saku",
    label: "Kakak Saku",
    icon: HandCoins,
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
