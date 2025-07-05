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
    subItems: [
      {
        href: "/dashboard/products/products",
        label: "Products",
      },

      {
        href: "/dashboard/products/category",
        label: "Category",
      },
    ],
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
    href: "/dashboard/kakasakutransaction",
    label: "Kaka Saku Transaction",
    icon: HandCoins,
    subItems: [
      {
        href: "/dashboard/kakasakutransaction/kakasakutransaction",
        label: "Kaka Saku Transaction",
      },

      {
        href: "/dashboard/kakasakutransaction/pending",
        label: "Pending",
      },

      {
        href: "/dashboard/kakasakutransaction/completed",
        label: "Completed",
      },
    ],
  },

  {
    href: "/dashboard/donasitransaction",
    label: "Donasi Transaction",
    icon: Gift,
    subItems: [
      {
        href: "/dashboard/donasitransaction/donasitransaction",
        label: "Donasi Transaction",
      },

      {
        href: "/dashboard/donasitransaction/pending",
        label: "Pending",
      },

      {
        href: "/dashboard/donasitransaction/completed",
        label: "Completed",
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
