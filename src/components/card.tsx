"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { usePlayerStore } from "@/store/playerStore";
import { SpiderChart } from "./spiderChart";

export const VipedCard = () => {
    const { player } = usePlayerStore();
    const { steamid, personaname, avatarfull } = player;

    return (
        <CardContainer className="inter-var">
            <CardBody className=" text-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-gradient-to-tr from-teal-900 border-slate-200 shadow-2xl shadow-cyan-400 to-teal-400 from-15%  w-full h-auto rounded-xl p-6 border  ">
                <CardItem
                    translateZ="50"
                    className="capitalize text-xl font-bold "
                >
                    {personaname}
                </CardItem>
                <CardItem
                    as="p"
                    translateZ="40"
                    className="text-sm max-w-sm mt-2 "
                >
                    {steamid}
                </CardItem>
                <div className="flex w-full justify-between items-center mt-4">
                    <CardItem translateZ="60" className="w-auto h-auto">
                        <img
                            src={avatarfull}
                            width="1000"
                            className="w-auto h-auto object-cover rounded-xl group-hover/card:shadow-xl"
                            alt="avatar"
                        />
                    </CardItem>

                    <CardItem
                        translateZ="100"
                        className="px-4 py-2 w-full h-auto *:text-xs font-normal dark:text-white"
                    >
                        <SpiderChart />
                    </CardItem>

                </div>
            </CardBody>
        </CardContainer>
    );
}
