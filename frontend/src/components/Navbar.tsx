"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Button } from "./ui/button"
import {
  Briefcase,
  Home,
  Info,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"
import { ModeToggle } from "./mode-toggle"
import { useAppData } from "@/context/AppContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, user, setIsAuth, setUser, loading, logoutUser } = useAppData();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const logOutHandler = () => {
    logoutUser();
    toggleMenu();
  }
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Hire
              </span>
              <span className="text-red-500">Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <Home size={16} /> Home
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2">
                <Briefcase size={16} /> Jobs
              </Button>
            </Link>

            <Link href="/about">
              <Button variant="ghost" className="gap-2">
                <Info size={16} /> About
              </Button>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {
              loading ? "" : <>
                {isAuth ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button>
                        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition">
                          <AvatarImage src={user?.profile_pic || ""} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-48">
                      <div className="mb-2 border-b pb-2">
                        <p className="text-sm font-semibold">{user && user.name}</p>
                        <p className="text-xs opacity-60 truncate">
                          {user && user.email}
                        </p>
                      </div>

                      <Link href="/account">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                          <User size={16} /> Profile
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 mt-1"
                        onClick={logOutHandler}
                      >
                        <LogOut size={16} /> Logout
                      </Button>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Link href="/login">
                    <Button className="gap-2">
                      <User size={16} /> Sign In
                    </Button>
                  </Link>
                )}</>
            }
            <ModeToggle />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">

            <ModeToggle />
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-3 space-y-2 bg-background border-t">

          <Link href="/" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home size={18} /> Home
            </Button>
          </Link>

          <Link href="/jobs" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Briefcase size={18} /> Jobs
            </Button>
          </Link>

          <Link href="/account" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User size={18} /> Account
            </Button>
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Info size={18} /> About
            </Button>
          </Link>

          {isAuth ? (
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={logOutHandler}
            >
              <LogOut size={18} /> Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="w-full gap-2">
                <User size={18} /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar