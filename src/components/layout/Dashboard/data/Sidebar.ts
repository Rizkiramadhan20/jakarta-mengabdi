import {
  House,
  Users,
  LayoutDashboard,
  Building2,
  UserRoundPen,
  HandCoins,
  CircleUser,
  Gift,
  ChartNoAxesCombined,
} from "lucide-react";

export const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/dashboard/jmerch",
    label: "JMerch",
    icon: Building2,
    subItems: [
      {
        href: "/dashboard/jmerch/jmerch",
        label: "JMerch",
      },

      {
        href: "/dashboard/jmerch/online-store",
        label: "Online Store",
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
    href: "/dashboard/rekaputasi",
    label: "Rekaputasi",
    icon: ChartNoAxesCombined,
  },

  {
    href: "/dashboard/accounts",
    label: "Accounts",
    icon: CircleUser,
  },

  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: UserRoundPen,
  },

  {
    href: "/donasi",
    label: "Back Home",
    icon: House,
  },
];
