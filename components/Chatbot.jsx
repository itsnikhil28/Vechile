"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AnimatePresence } from 'framer-motion'
import { ArrowDownCircleIcon, MessageCircleIcon, Send, SendIcon, Square, SquareIcon, X } from 'lucide-react'
import React, { use, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { Input } from "./ui/input"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Chatbot() {
    const [isChatOpen, setisChatOpen] = useState(false)
    const [showChatIcon, setshowChatIcon] = useState(true)
    const chaticonref = useRef(null)
    const [language, setLanguage] = useState(null)
    const [awaitingLanguage, setAwaitingLanguage] = useState(true)

    const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error, append } = useChat({ api: '/api/gemini' })

    useEffect(() => {
        console.log(error)
    }, [error])

    const tooglechat = () => {
        setisChatOpen(!isChatOpen)
    }

    const scrollref = useRef(null)

    const handleLanguageSelect = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setAwaitingLanguage(false);

        append({
            role: 'system',
            content: `LANGUAGE:${selectedLanguage}`,
        });
    };

    useEffect(() => {
        if (scrollref.current) {
            scrollref.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return (
        <>
            {/* Chat Icon */}
            <AnimatePresence>
                {showChatIcon && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 right-4 z-50"
                        onClick={tooglechat}
                    >
                        <Button ref={chaticonref} title="Chat" onClick={tooglechat} size="icon" className='rounded-full size-14 p-2 shadow-lg'>
                            {!isChatOpen ? (
                                <MessageCircleIcon className="size-12" />
                            ) : (
                                <ArrowDownCircleIcon />
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Black Overlay */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={tooglechat}
                    />
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 right-4 z-50 w-[90%] md:w-[500px]"
                    >
                        <Card className="border-2">
                            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-3">
                                <CardTitle className='text-lg font-bold'>
                                    Chat with Vehicle AI {language && `(${language.toUpperCase()})`}
                                </CardTitle>
                                <Button onClick={tooglechat} size="sm" variant="ghost" className="px-2 py-0">
                                    <X className="size-4" />
                                    <span className="sr-only">Close Chat</span>
                                </Button>
                            </CardHeader>
                            {awaitingLanguage && (
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[300px] px-5">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <div className="text-center text-lg font-medium mb-4">
                                                Please select your language:
                                            </div>
                                            <div className="flex gap-4">
                                                <Button
                                                    onClick={() => handleLanguageSelect('english')}
                                                    className="px-6 py-2 bg-black text-white rounded-md">
                                                    English
                                                </Button>
                                                <Button
                                                    onClick={() => handleLanguageSelect('hindi')}
                                                    className="px-6 py-2 bg-black text-white rounded-md">
                                                    Hindi
                                                </Button>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            )}
                            {!awaitingLanguage && (
                                <>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-[300px] px-5">
                                            {messages?.length === 0 && (
                                                <div className="flex justify-center items-center w-full mt-32 text-gray-500 gap-3">
                                                    No Messages Yet
                                                </div>
                                            )}
                                            {messages?.map((message, index) => {
                                                if (message.role === 'system' && message.content.startsWith('LANGUAGE:')) {
                                                    return null;
                                                }
                                                return (
                                                    <div key={index} className={`mb-4 ${message.role == "user" ? "text-right" : "text-left"}`}>
                                                        <div className={`inline-block p-3 rounded-lg ${message.role == "user" ? "bg-primary text-primary-foreground" : "bg-muted"} `}>
                                                            <ReactMarkdown children={message.content} remarkPlugins={[remarkGfm]} components={{
                                                                code({ node, inline, className, children, ...props }) {
                                                                    return inline ? (
                                                                        <code {...props} className="bg-gray-200 px-1 rounded">{children}</code>
                                                                    ) : (
                                                                        <pre className="bg-gray-200 p-2 rounded">
                                                                            <code {...props}>{children}</code>
                                                                        </pre>
                                                                    )
                                                                },

                                                                ul: ({ children }) => (
                                                                    <ul className="list-disc ml-4">
                                                                        {children}
                                                                    </ul>
                                                                ),

                                                                ol: ({ children }) => (
                                                                    <ol className="list-decimal ml-4">
                                                                        {children}
                                                                    </ol>
                                                                ),

                                                                a: ({ href, children }) => (
                                                                    <a href={href} className="underline text-black" rel="noopener noreferrer">
                                                                        {children}
                                                                    </a>
                                                                )
                                                            }} >
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {isLoading && (
                                                <div className="w-full flex justify-start items-center gap-2 mb-10 mt-3">
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0s]"></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                </div>
                                            )}
                                            {error && (
                                                <div className="w-full items-center flex justify-center gap-3 mb-10">
                                                    <div>An error occured</div>
                                                    <Button title="Retry" className="underline" type="button" onClick={() => reload()}>Retry..</Button>
                                                </div>
                                            )}
                                            <div ref={scrollref}></div>
                                        </ScrollArea>
                                    </CardContent>
                                    <CardFooter className="pt-3">
                                        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                                            <Input value={input} onChange={handleInputChange} className="flex-1" placeholder="Type Your Message Here..." />
                                            {isLoading ? (
                                                <Button title="Stop" type="submit" className="size-9" size="icon" onClick={() => stop()}>
                                                    <SquareIcon className="size-4" />
                                                </Button>
                                            ) : (
                                                <Button title="Send" type="submit" className="size-9" disabled={isLoading} size="icon">
                                                    <SendIcon className="size-4" />
                                                </Button>
                                            )}
                                        </form>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
