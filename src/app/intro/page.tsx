import Image from "next/image";
import { Suspense } from "react";
import 'dompurify';
import BoardGroup from "@/components/BoardGroup";
import { IntroHeaderButton, IntroTopButton, IntroTryButton } from "@/components/IntroButton";
import Loading from "@/components/loading";

// https://fonts.google.com/selection/embed

export default function Intro() {
    // const boardSectionRef = useRef<HTMLDivElement>(null);

    return (
        <main className="flex flex-col w-full">
            <header className={`fixed top-0 w-full left-0 h-16 bg-white/50 backdrop-blur z-20 flex justify-between px-5 items-center`}>
                <div className="w-28 madimi-one-regular text-2xl cursor-default">
                    <span className="text-seagull-900">Carlor</span>
                    <span className="madimi-one-regular text-2xl text-seagull-500">note</span>
                </div>
                <div className="flex items-center h-full">
                    <IntroHeaderButton />
                    {/* <button className="bg-seagull-500 px-3 py-2 text-white rounded-sm hover:bg-seagull-600 duration-150">Sign up for free</button> */}
                </div>
            </header>

            <IntroTopButton />

            <section className={`flex h-svh w-full items-center bg-gradient-to-tr from-orange-50 to-cyan-50 relative`}>
                <div className="absolute left-24 bottom-10 h-[40%] w-[30rem]  text-5xl font-signika flex flex-col items-center z-10">
                    <p className="text-seagull-950">Create your decks</p>
                    <p className="ml-16 pt-0.5 whitespace-nowrap text-seagull-950">Note your cards</p>
                    <span className="text-sm pt-5 pb-6 font-normal text-slate-500">隨時掌握手中知識，創建、紀錄並分享</span>
                    <button className="bg-transparent w-[14rem] h-[3rem]  rounded-sm overflow-hidden text-base font-semibold relative border-2 border-seagull-500
                    
                    before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:z-0 before:rounded-full before:opacity-0 before:w-5 before:h-5 hover:before:w-[14rem] hover:before:h-[14rem] before:bg-seagull-500 hover:before:rounded-none hover:before:opacity-100 before:duration-150">
                        <span className="duration-150 text-seagull-500 hover:text-white absolute inset-0 z-10 leading-[3rem] backdrop-blur-lg">Start a free trial</span>
                    </button>
                </div>
                <div className="w-[50rem] h-[28rem] absolute right-16">
                    <div className="w-[34rem] h-[22rem] bg-seagull-400 absolute top-20 right-28 rounded-md shadow-md skew-y-6 " />

                    <div className="w-[20rem] h-[5rem] bg-seagull-600 absolute top-40 left-16 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[10rem] h-[5rem] bg-seagull-500 absolute top-24 left-4 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[5rem] h-[7rem] bg-seagull-800 absolute -bottom-10 right-48 rounded-md shadow-md skew-y-6 hover:-rotate-1 hover:skew-y-3 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-seagull-950/40 z-0 hover:z-10" />
                    <div className="w-[20rem] h-[12rem] bg-seagull-700 absolute -bottom-5 left-30 rounded-md shadow-md skew-y-6 hover:skew-y-3 hover:-rotate-1 hover:scale-105 origin-[90%_10%] duration-150 ease-out hover:shadow-lg hover:shadow-seagull-950/40 z-0 hover:z-10" />
                </div>
                <IntroTryButton />
            </section>

            {/* 三個特色 */}
            <section className={`flex h-80 w-full items-center bg-seagull-200 p-10`}>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">Creation</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">快速創建，隨時紀錄</p>
                </div>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">No limitation</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">小至瓢蟲、大至宇宙，都可以是一張卡片</p>
                </div>
                <div className="w-1/3 h-full ">
                    <p className="w-full text-center text-3xl font-signika">Connection</p>
                    <p className="w-full text-center text-sm font-normal text-slate-600">將碎片化的知識累積、歸納與連結</p>
                </div>
            </section>
            <section className={`flex flex-col h-svh w-full items-center bg-white pt-16`}>
                <div className="w-[80%] 2xl:w-[70%] lg:h-40 lg:mb-10 lg:pt-16 xl:h-32 xl:mb-8 xl:pt-12 2xl:h-20 2xl:pt-2 2xl:mb-2">
                    <p className="font-extrabold text-3xl text-seagull-800 pb-1">Keep your notes in any topic</p>
                    <span className="text-sm text-slate-600 mt">每一張卡片都是一個可大可小的主題，越小的主題越能夠詳盡記錄，較大的主題可以透過卡片連結來歸納知識。</span>
                </div>
                <div className="w-[80%] 2xl:w-[70%]">
                    <Image
                        className={`rounded-md`} width={1600} height={1600} src={"https://i.imgur.com/UCX6ZT5.png"}
                        priority={true}
                        alt={"react example"}
                        style={{
                            objectFit: 'cover', // cover, contain, none
                            width: '100%', height: '',
                            boxShadow: "2px 5px 20px rgba(0, 0, 0, 0.3)"
                        }}
                    />
                </div>
            </section>

            {/* <section className={`flex h-svh w-full items-center bg-seagull-500`}>
                能做到的服務：
            </section>
            <section className={`flex h-80 w-full items-center bg-seagull-700`}>
                完成的卡片範例
            </section> */}

            <section className={`hidden sm:flex flex-col gap-2 pt-5 h-svh w-full items-center justify-center bg-seagull-200 relative`}
                style={{
                    backgroundImage: "radial-gradient(rgb(100 100 120) 1px, transparent 0)",
                    backgroundSize: "15px 15px",
                    backgroundPosition: "-19px -19px"
                }}
            >
                <Suspense fallback={<Loading></Loading>}>
                    <BoardGroup />
                </Suspense>
            </section>
            <footer className={`flex h-20 w-full items-center bg-seagull-900 justify-center gap-96`}>
                <div className="w-28 madimi-one-regular text-2xl cursor-default">
                    <span className="text-seagull-400">Carlor</span>
                    <span className="madimi-one-regular text-2xl text-seagull-600">note</span>
                </div>
                <span className="text-seagull-300 font-extralight">Copyright © 2024 Carlornote. All rights reserved.</span>
            </footer>
        </main>
    );
}