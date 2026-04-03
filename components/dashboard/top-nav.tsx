"use client";

import { motion } from "framer-motion";
import { Bell, Search, Moon, Sun, ChevronDown, Shield, Eye } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setRole, selectRole } from "@/lib/store/uiSlice";
import type { ActiveTab } from "@/lib/store/types";
import { setActiveTab, selectActiveTab } from "@/lib/store/uiSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAV_TABS: { id: ActiveTab; label: string }[] = [
  { id: "overview",     label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "analytics",   label: "Analytics" },
  { id: "insights",    label: "Insights" },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="size-9" />;

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Icon className="size-4" />
    </Button>
  );
}

export function TopNav() {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectRole);
  const activeTab = useAppSelector(selectActiveTab);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex size-8 items-center justify-center rounded-xl bg-brand shadow-sm shadow-brand/30">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="2"  y="12" width="3" height="4" rx="1" fill="white" opacity="0.55"/>
                <rect x="6.5" y="8"  width="3" height="8" rx="1" fill="white" opacity="0.75"/>
                <rect x="11" y="4"  width="3" height="12" rx="1" fill="white" opacity="0.9"/>
                <line x1="3.5" y1="12" x2="12.5" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">Zorvyn</span>
          </div>

          <div className="hidden sm:flex flex-1 max-w-xs">
            <div className="flex w-full items-center gap-2 rounded-xl bg-secondary px-3 py-1.5 text-sm text-muted-foreground">
              <Search className="size-3.5 shrink-0" />
              <span className="text-xs">Search transactions…</span>
              <kbd className="ml-auto hidden text-[10px] font-mono md:inline-flex h-4 items-center gap-0.5 rounded border border-border bg-background px-1">
                ⌘F
              </kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-8 gap-1.5 rounded-xl px-3 text-xs font-medium"
                >
                  {role === "admin" ? (
                    <Shield className="size-3.5 text-brand" />
                  ) : (
                    <Eye className="size-3.5 text-muted-foreground" />
                  )}
                  <span className="capitalize">{role}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem
                  className="gap-2 rounded-lg text-xs"
                  onClick={() => dispatch(setRole("viewer"))}
                >
                  <Eye className="size-3.5" />
                  Viewer
                  {role === "viewer" && <span className="ml-auto text-brand">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 rounded-lg text-xs"
                  onClick={() => dispatch(setRole("admin"))}
                >
                  <Shield className="size-3.5" />
                  Admin
                  {role === "admin" && <span className="ml-auto text-brand">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
                  Admin can add & edit transactions
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-negative" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-9 items-center gap-2 rounded-xl px-2"
                >
                  <Avatar className="size-7">
                    <AvatarImage src="https://api.dicebear.com/9.x/notionists/svg?seed=zorvyn" />
                    <AvatarFallback className="bg-brand text-white text-xs font-semibold">
                      AB
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-xs font-semibold leading-none">Abhishek</span>
                    <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                      @abhishekbiradar
                    </span>
                  </div>
                  <ChevronDown className="size-3 opacity-50 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold">Abhishek Biradar</p>
                  <p className="text-[10px] text-muted-foreground">abhishek@zorvyn.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg text-xs">Settings</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg text-xs text-negative">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={cn(
                "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
