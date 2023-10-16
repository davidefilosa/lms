import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <div className="text-green-500 text-xl">This a protected page</div>
    </>
  );
}
