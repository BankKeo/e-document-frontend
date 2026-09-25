"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  LogOut,
  Settings,
  UserRound,
  UserRoundCog,
} from "lucide-react";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Account" />}
      >
        <Avatar size="sm">
          <AvatarFallback>MP</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Malina Phetxomphou
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            malina@acme.gov
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserRound />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserRoundCog />
            Security
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground">
          <HelpCircle className="size-4" />
          Help & Documentation
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
