import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 flex flex-col lg:flex-row w-full items-center justify-center p-4 gap-2">
      <div className="relative size-[240px] lg:size-[424px] mb-8 lg:mb-0">
        <Image src="/hero.svg" fill alt="hero" />
      </div>

      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, Practice and Master new languages with Lingo
        </h1>
        <div>
          <ClerkLoading>
            <Loader className="size-5 text-muted-foreground animate-spin" />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="redirect" forceRedirectUrl="/learn">
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>

              <SignInButton mode="redirect" forceRedirectUrl="/learn">
                <Button size="lg" variant="primaryOutline" className="w-full mt-4">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn"> 
                Continue Learning
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
