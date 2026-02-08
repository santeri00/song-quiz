'use client'
import React from 'react'
import Navbar from "../../components/Navbar";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SockJs from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function Lobby() {
    const { roomId } = useParams();
    const [players, setPlayers] = useState([]);
    const [username, setUsername] = useState("Player" + Math.floor(Math.random() * 1000));
    const router = useRouter();
    const clientRef = useRef(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!roomId) return;
        if (clientRef.current) return;
        const hasTicket = sessionStorage.getItem('ticket');
        if (!hasTicket) {
            router.replace(`/join/${roomId}`);
            return;
        }
        setIsAuthorized(true);
        setTimeout(() => {
            sessionStorage.removeItem('ticket');
        }, 1000);

        const socket = new SockJs('http://localhost:5000/ws-game');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/lobby/${roomId}`, (message) => {
                    const roomState = JSON.parse(message.body);
                    setPlayers(roomState.players);
                });

                client.publish({
                    destination: `/app/lobby/${roomId}/join`,
                    body: JSON.stringify({ nickname: username }),
                });
            },
            onStompError: (error) => {
                console.error("STOMP error:", error);
            },
        })
        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [roomId, router, username]);


    if (!isAuthorized) {
        return null;
    }

    return (
        <div>
            <Navbar />
            <section className='flex justify-center  flex-col gap-5 w-7/10 mx-auto'>
                <h1 className='mt-5'>Room ID: {roomId}</h1>
                <div className='mt-20 bg-neutral-900 p-8 rounded-md'>
                    <h1 className='ml-5'>Room Creation</h1>
                </div>

                <div className='grid grid-cols-10 gap-5 '>
                    <div className='col-span-3 border-1 rounded-sm p-6 h-48'>
                        {players.length > 0 ? (
                            <ul>
                                {players.map((player, index) => (
                                    <li key={index} className=''>
                                        {player.nickname === username ? "* " : ""}
                                        {player.nickname}
                                        {player.host && " (Host)"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No players in the lobby</p>
                        )}

                    </div>
                    <div className='col-span-7 border-1 rounded-sm h-48'>

                    </div>
                </div>
            </section>


        </div>
    )
}

export default Lobby