
import React from "react";
import ClientWrapper from "@/components/ClientWrapper";
import { Metadata, ResolvingMetadata } from "next/types";
import { handleGetCard } from "@/api/card";
import { ICard } from "@/type/card";

export default function CardPage() {
    return (
        <main className="flex w-dvw h-svh flex-col items-center justify-between overflow-hidden">
            <ClientWrapper />
        </main>
    )
}

interface IMatadataProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: IMatadataProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // console.log("params", params)
    // console.log("searchParams", searchParams)

    // fetch data
    const response = await handleGetCard(`card_${params.id}`);
    // console.log("response", response)

    let title = "Carlornote";
    if (response.status === "SUCCESS") {
        const data = JSON.parse(response.data) as ICard;
        title = `${data.name} - Carlornote`;
    }
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []

    return {
        metadataBase: new URL("https://carlornote.vercel.app/"),
        title,
        description: "Create your decks, Note your cards",
        verification: { google: "T698cdzTe6isNHm_JUoM2fQDaN-RvxIU2SIMG5J4M8g" },
        openGraph: {
            type: "website",
            title,
            description: "Create your decks, Note your cards",
            images: ['/some-specific-page-image.jpg', ...previousImages]
        },
    }
}


