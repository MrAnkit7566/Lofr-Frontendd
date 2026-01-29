import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";
import {
  Layers,
  LayoutDashboard,
  Package,
  Tag,
  Users,
  House,
  BadgeCheck,
  CalendarArrowDown,
  MailOpen,
  BookOpenCheck,
  BadgeDollarSign,
  PartyPopper,
  TableOfContents,
  PanelTop,
  TruckElectric,
  Star,
} from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";

const items = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Sales", href: "/admin/dashboard/sales", icon: LuBadgeCheck },
  { title: "Blogs", href: "/admin/dashboard/blogs", icon: BookOpenCheck },
  { title: "Users", href: "/admin/dashboard/users", icon: Users },
  { title: "Products", href: "/admin/dashboard/products", icon: Package },
  { title: "Categories", href: "/admin/dashboard/categories", icon: Layers },
  // { title: "Brands", href: "/dashboard/brands", icon: Tag },
  { title: "Coupons", href: "/admin/dashboard/coupons", icon: BadgeDollarSign },
  { title: "Orders", href: "/admin/dashboard/orders", icon: CalendarArrowDown },
  { title: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
  { title: "Homepage Sections", href: "/admin/dashboard/homepage", icon: House },
  // { title: "Testimonials", href: "/dashboard/testimonials", icon: BadgeCheck },
  { title: "Announcement Bar", href: "/admin/dashboard/announcements", icon: PartyPopper },
//   { title: "Faqs", href: "/dashboard/faqs", icon: TableOfContents },
  { title: "Contact Us", href: "/admin/dashboard/contact", icon: PanelTop },
//   { title: "Emails", href: "/dashboard/emails", icon: MailOpen },
//   { title: "Shipping Page", href: "/dashboard/shipping", icon: TruckElectric },
];

export function Sidebar({ setOpen }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [ecom, setEcom] = useState(false);
  const [ui, setUI] = useState(false);
  const [others, setOthers] = useState(false);
  const navigate = useNavigate();

 const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");
    navigate("/login");
  };

  const linkClass = (href) =>
    `flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
    ${
      pathname === href
        ? "bg-[#fde4c9] text-black shadow-md"
        : "text-gray-700 hover:bg-[#fbf0e5] hover:text-black font-bold"
    }`;

  const dropdownHeaderClass = (open) =>
    `flex justify-between items-center rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer
     transition-all duration-200 hover:bg-[#fbf0e5] hover:text-black ${
       open ? "bg-[#fde4c9]" : "bg-transparent"
     }`;

  const dropdownItemClass = (href) =>
    `flex items-center rounded-lg px-4 py-2 text-sm font-medium ml-6 transition-all duration-200
    ${
      pathname === href
        ? "bg-[#fde4c9] text-black font-bold   shadow-inner"
        : "text-gray-700 hover:bg-[#fbf0e5] hover:text-black"
    }`;

  return (
    <nav className="bg-[#F9FAFB] w-64 h-full py-4  scrollbar-none  border-r-2">
      <div className="px-3 py-2 space-y-1">
        {/* Top-level links */}
        {items.slice(0, 2).map((item) => (
          <Link key={item.href} to={item.href} onClick={() => setOpen && setOpen(false)} className={linkClass(item.href)}>
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </Link>
        ))}

        {/* Ecom Section */}
        <div>
          <h1 className={dropdownHeaderClass(ecom)} onClick={() => setEcom(!ecom)}>
            <div className="flex items-center gap-2">
              <img src="/ecom.png" alt="Ecom Logo" className="h-5 w-5 object-contain " />
              Ecom
            </div>
            <RiArrowDropDownLine size={20} className={`transition-transform duration-200 ${ecom ? "rotate-180" : "rotate-0"}`} />
          </h1>
          {ecom &&
            items.slice(3, 9).map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setOpen && setOpen(false)} className={dropdownItemClass(item.href)}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </Link>
            ))}
        </div>

        {/* UI Section */}
        <div>
          <h1 className={dropdownHeaderClass(ui)} onClick={() => setUI(!ui)}>
            <div className="flex items-center gap-2">
              <img src="/ui.png" alt="UI Logo" className="h-5 w-5 object-contain" />
              UI
            </div>
            <RiArrowDropDownLine size={20} className={`transition-transform duration-200 ${ui ? "rotate-180" : "rotate-0"}`} />
          </h1>
          {ui &&
            items.slice(9, 11).map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setOpen && setOpen(false)} className={dropdownItemClass(item.href)}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.title}
              </Link>
            ))}
        </div>

        
        {/* Logout */}
        <div onClick={handleLogout} className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 cursor-pointer mt-4">
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </div>
      </div>
    </nav>
  );
}
