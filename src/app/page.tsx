import Image from "next/image";
import Card from "@/app/components/Card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full flex-1 border border-slate-700">

      </section>
      <section className="w-full h-60 flex items-center justify-center">
        <Card />
      </section>
    </main>
  );
}
