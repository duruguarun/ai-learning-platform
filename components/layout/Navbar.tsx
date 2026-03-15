"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Library,
  Home,
  Lightbulb,
  FileSearch,
  FileText,
  Calendar,
  HelpCircle,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/features", label: "Features", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: Library },
];

const featureItems = [
  { id: "concept", label: "Explain Concepts", icon: Lightbulb },
  { id: "pyq", label: "Analyze PYQ", icon: FileSearch },
  { id: "syllabus", label: "Upload Syllabus", icon: FileText },
  { id: "studyplan", label: "Study Plan", icon: Calendar },
  { id: "quiz", label: "Practice Quiz", icon: HelpCircle },
  { id: "simulation", label: "Simulation", icon: PlayCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    if (logout) logout();
    window.location.href = "/";
  };

  // Don't show navbar on landing, login, or onboarding pages
  const hideNavbar = ["/", "/login", "/signup", "/onboarding"].includes(pathname);
  if (hideNavbar) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo and Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                    <BookOpen className="h-4 w-4 text-background" />
                  </div>
                  <span className="font-bold">LearnFlow AI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <div className="space-y-1">
                  <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                    Navigation
                  </p>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="my-4 border-t border-border" />
                
                <div className="space-y-1">
                  <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">
                    AI Features
                  </p>
                  {featureItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/workspace?feature=${item.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/features" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <BookOpen className="h-4 w-4 text-background" />
            </div>
            <span className="hidden text-lg font-bold sm:inline-block">LearnFlow AI</span>
          </Link>
        </div>

        {/* Center - Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-foreground text-background text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-foreground text-background">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/library" className="cursor-pointer">
                    <Library className="mr-2 h-4 w-4" />
                    Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
