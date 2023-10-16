import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="text-green-500 text-xl">This a protected page</div>
      <Button>Click me</Button>
    </>
  );
}
