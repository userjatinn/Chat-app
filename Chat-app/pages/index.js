import Head from "next/head";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Home() {
    const [username, setUsername] = useState("User");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe("chat");
        channel.bind("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        await fetch("http://localhost:8000/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, message }),
        });

        setMessage("");
    };

    return (
        <div className="container">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
            </Head>
            <div className="d-flex flex-column bg-white vh-100">
                <div className="p-3 border-bottom">
                    <input
                        className="form-control mb-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className="list-group flex-grow-1 overflow-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="list-group-item">
                            <strong>{msg.username}</strong>: {msg.message}
                        </div>
                    ))}
                </div>
                <form onSubmit={submit} className="mt-2">
                    <input
                        className="form-control"
                        placeholder="Write a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}
