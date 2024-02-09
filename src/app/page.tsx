import Image from "next/image";
import Card from "@/app/components/Card";
import Board from "@/app/components/Board";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between">
      <section className="w-full h-full border border-slate-700 px-16 py-8 relative">
        <Board />
      </section>
      <section className="w-full h-auto my-5 flex items-center justify-center">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </section>
    </main>
  );
}
