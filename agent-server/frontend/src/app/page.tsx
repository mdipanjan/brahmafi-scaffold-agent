"use client";
import ChatBox from "../components/ChatBox";
import Head from "next/head";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>Intelligent DCA Agent Chat</title>
        <meta
          name="description"
          content="Chat with the Intelligent DCA Agent"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          padding: "2rem",
          backgroundColor: "#f7fafc",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Intelligent DCA Agent Chat
        </h1>
        <ChatBox />
      </main>
    </div>
  );
}
