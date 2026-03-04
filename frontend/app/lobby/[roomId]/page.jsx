'use client'
import React from 'react'
import Navbar from "../../components/Navbar";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SockJs from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Settings, Clipboard, Crown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SettingsWindow from '../components/SettingsWindow';
import PlayListSelector from '../components/PlayListSelector';
import MultiPlayState from '../components/MultiPlayState';
import MultiEndState from '../components/MultiEndState';
import InfoScreen from '../components/InfoScreen';

function Lobby() {
    const { roomId } = useParams();
    const [players, setPlayers] = useState([]);
    const [username, setUsername] = useState(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("username") || "Player" + Math.floor(Math.random() * 1000);
        }
        return "Player";
    });
    const router = useRouter();
    const clientRef = useRef(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [rounds, setRounds] = useState(10);
    const [selectedPlayList, setSelectedPlayList] = useState(null);
    const [gameState, setGameState] = useState("");
    const [songs, setSongs] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [allTracks, setAllTracks] = useState([]);
    const [revealAnswerState, setRevealAnswerState] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedPlaylistName, setSelectedPlayListName] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const isHost = players.find(p => p.nickname === username)?.host || false;
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
        }, 0)



        const socket = new SockJs(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws-game`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setIsConnected(true);
                client.subscribe(`/topic/lobby/${roomId}`, (message) => {
                    const roomState = JSON.parse(message.body);
                    setPlayers(roomState.players);
                    setRounds(roomState.totalRounds);
                    setSelectedPlayList(roomState.selectedPlayListId);
                    setSongs(roomState.currentRoundSongs);
                    setCurrentRound(roomState.currentRound);
                    setTotalRounds(roomState.totalRounds);
                    setAllTracks(roomState.songs);
                    setGameState(roomState.gameState);
                    setRevealAnswerState(roomState.revealAnswerState)
                    setOptions(roomState.options);
                    setSelectedPlayListName(roomState.playListName);
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


    const handleSettingsUpdate = (newRounds) => {
        if (clientRef.current) {
            clientRef.current.publish({
                destination: `/app/lobby/${roomId}/settings`,
                body: JSON.stringify({ rounds: newRounds }),
            })
        }
        setRounds(newRounds);
    }

    const handlePlayListSelect = (id, name) => {
        if (clientRef.current) {
            clientRef.current.publish({
                destination: `/app/lobby/${roomId}/playlist`,
                body: JSON.stringify({ artistId: id, artistName: name }),
            })
        }
        setSelectedPlayList(id);
    }

    const startGame = () => {
        if (clientRef.current) {
            clientRef.current.publish({
                destination: `/app/lobby/${roomId}/start`,
                body: JSON.stringify({}),
            })
            setGameState("PLAYING");
        }
    }



    const playerCard = (player) => {
        return (
            <div className={`flex justify-between items-center overflow-hidden p-2 gap-1.5 rounded text-xl ${player.nickname === username ? 'bg-teal-700' : 'bg-neutral-800'}`}>
                {player.nickname}
                {player.host && (
                    <Crown size={20} />
                )}
            </div>
        )
    }

    if (!isAuthorized) {
        return null;
    }

    if (!isConnected) {
        return (
            <div>
                <Navbar />
                <div className='flex justify-center items-center h-[70vh] text-xl'>
                    <p>Connecting to lobby...</p>
                </div>
            </div>
        )
    }

    if (gameState === "PLAYING") {
        return (
            <MultiPlayState
                roomId={roomId}
                username={username}
                clientRef={clientRef}
                songs={songs}
                currentRound={currentRound}
                totalRounds={totalRounds}
                allTracks={allTracks}
                players={players}
                revealAnswerState={revealAnswerState}
                options={options}
            />
        );
    }
    if (gameState === "FINISHED") {
        return (
            <MultiEndState
                players={players}
                user={username}
            />
        )
    }

    return (
        <div>
            <Toaster />
            <Navbar />
            <section className='flex justify-center flex-col gap-5 w-7/10 mx-auto text-xl'>
                <h1 className='mt-5'>Room ID: {roomId}</h1>
                <div className='mt-5 bg-neutral-900 p-8 rounded-md flex flex-row items-center gap-4'>
                    <p>Players: {players.length}/8</p>
                    <Clipboard className='ml-auto cursor-pointer' size={36}
                        onClick={() => {
                            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BACKEND_URL}/join/` + roomId);
                            toast.success("Room link copied",
                                {
                                    style: {
                                        background: '#171717',
                                        color: '#fff',
                                    }
                                }
                            );
                        }}
                    />
                    {isHost && (
                        <Settings className=' cursor-pointer' size={36} onClick={() => setIsSettingsOpen(true)} />
                    )}
                    <SettingsWindow
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        handleRoundsChange={handleSettingsUpdate}
                        rounds={rounds} />


                </div>



                <div className='flex flex-col '>
                    <div className='flex flex-row items-start gap-5 '>
                        <div className='border-1 rounded-sm p-2 w-1/5'>
                            {players.length > 0 ? (
                                <ul>
                                    {players.map((player, index) => (
                                        <li key={index} className='m-1.5'>
                                            {playerCard(player)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Waiting for you to join...</p>
                            )}

                        </div>

                        <div className='border-1 rounded-sm w-full min-h-50'>
                            {isHost ? (
                                < PlayListSelector selectedPlayList={selectedPlayList} onSelect={handlePlayListSelect} />
                            ) : (
                                <InfoScreen rounds={rounds} playlist={selectedPlaylistName} />
                            )}

                        </div>
                    </div>

                    <div className='flex align-center justify-center mt-10'>
                        {
                            isHost && (
                                <button className='bg-neutral-900 text-white px-8 text-xl py-5 m-2 rounded-md cursor-pointer hover:text-teal-500 w-100'
                                    disabled={!selectedPlayList}
                                    onClick={startGame}>
                                    start game
                                </button>
                            )
                        }

                    </div>

                </div>
            </section>


        </div>
    )
}

export default Lobby