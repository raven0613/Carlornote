import { IBoardElement, ICard, boxType } from "@/type/card";
import { Metadata, ResolvingMetadata } from "next/types";
import ClientWrapper from "@/components/ClientWrapper";

export type StepType = { id: string, newIdx: number, oldIdx: number } | { newData: IBoardElement, oldData: IBoardElement } | { added: IBoardElement } | { deleted: IBoardElement, index: number };

export default function Home() {
    return (
        <main className="mainpage flex h-svh w-dvw flex-col items-center justify-between overflow-hidden">
            <ClientWrapper isHome={true} />
        </main>
    );
}

interface IMatadataProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: IMatadataProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        metadataBase: new URL("https://carlornote.vercel.app/"),
        title: "Home - Carlornote",
        description: "Create your decks, Note your cards",
        verification: { google: "T698cdzTe6isNHm_JUoM2fQDaN-RvxIU2SIMG5J4M8g" },
        openGraph: {
            type: "website",
            title: "Home - Carlornote",
            description: "Create your decks, Note your cards",
            images: ['/some-specific-page-image.jpg', ...previousImages]
        },
    }
}