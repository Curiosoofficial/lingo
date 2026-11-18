import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from 'react';

const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image
            src="/mascot.svg"
            alt="mascot"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">Lingo</h1>
        </div>

        <ClerkLoading>
          <Loader className="size-5 text-muted-foreground animate-spin" />
        </ClerkLoading>

        <ClerkLoaded>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="redirect" forceRedirectUrl="/learn">
              <Button size="lg" variant="ghost">Sign in</Button>
            </SignInButton>
          </Show>
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
