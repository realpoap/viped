"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { usePlayerStore } from "@/store/playerStore";
import { SpiderChart } from "./spiderChart";
import { useStatStore } from "@/store/statStore";

export const VipedCard = () => {
    const { player, games } = usePlayerStore();
    const { gameTotal } = useStatStore()
    const { steamid, personaname, loccountrycode, locstatecode, avatarfull, timecreated } = player;

    return (
        <CardContainer className="inter-var">
            <CardBody className=" flex flex-row text-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] bg-gradient-to-tr from-teal-900 border-slate-200 shadow-2xl shadow-cyan-400 to-teal-400 from-15%  w-full h-auto rounded-xl p-6 border  ">
                {steamid && <div className="flex flex-col w-1/3 justify-between items-center mt-4">
                    <CardItem
                        translateZ="60"
                        className="capitalize text-2xl font-bold "
                    >
                        {personaname}
                    </CardItem>
                    <CardItem
                        as="p"
                        translateZ="50"
                        className="text-sm max-w-sm mt-2 "
                    >
                        ID : {steamid}
                    </CardItem>
                    <CardItem
                        as="p"
                        translateZ="50"
                        className="text-sm max-w-sm mt-2 "
                    >   {locstatecode}, {loccountrycode}<br></br>
                        Time created : {timecreated?.toLocaleDateString("en-US")}<br></br>
                        Played games : {games.length}/{gameTotal}
                    </CardItem>

                    <CardItem translateZ="60" className="w-auto h-auto">
                        <img
                            src={avatarfull}
                            width="1000"
                            className="w-auto h-auto object-cover rounded-xl group-hover/card:shadow-xl"
                            alt="avatar"
                        />
                    </CardItem>



                </div>}
                <CardItem
                    translateZ="100"
                    className="px-4 py-2 w-full h-auto *:text-xs font-normal dark:text-white"
                >
                    <SpiderChart />
                </CardItem>
            </CardBody>
        </CardContainer>
    );
}
