
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SessionSetup = {
    activities: string[];
    time: string;
    budget: string;
    social: string;
};

type WordCoach = {
    word: string;
    partOfSpeech: string;
    definition: string;
    whyItFits: string;
    example: string;
    challenge: string;
};

const missions = [
    {
        title: "The Ordinary, More Carefully",
        category: "A LITTLE OBSERVATION",
        intro: "There's more to your everyday world than meets the eye.",
        instructions: [
            "Take a walk somewhere familiar.",
            "Find something you've probably seen many times but never really examined.",
            "Notice its shape, color, texture, or the way people interact with it.",
            "Keep your phone away for a little while. Let yourself be curious.",
        ],
        prompt: "What's one detail you would normally have overlooked?",
        word: "inconspicuous",
        definition: "Not easily noticed or attracting attention.",
        emoji: "🌼",
        color: "lavender",
    },
    {
        title: "A Small World of Details",
        category: "YOUR LITTLE FIELD TRIP",
        intro: "Today, ordinary things get to be interesting.",
        instructions: [
            "Head somewhere you can walk safely and comfortably.",
            "Look for something weathered, unusual, or unexpectedly beautiful.",
            "Pay attention to the details rather than rushing to name what you see.",
            "When you're ready, remember what caught your eye.",
        ],
        prompt: "What caught your attention, and why?",
        word: "weathered",
        definition: "Worn or changed by long exposure to weather or time.",
        emoji: "🍂",
        color: "peach",
    },
];

export default function MissionPage() {
    const [setup, setSetup] = useState<SessionSetup | null>(null);
    const [started, setStarted] = useState(false);
    const [reflection, setReflection] = useState("");
    const [stage, setStage] = useState<"mission" | "reflect" | "word">("mission");

    const [wordCoach, setWordCoach] = useState<WordCoach | null>(null);
    const [loadingWord, setLoadingWord] = useState(false);
    const [wordError, setWordError] = useState("");
    const [rewrite, setRewrite] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("little-outside-session");

        if (saved) {
            try {
                setSetup(JSON.parse(saved) as SessionSetup);
            } catch {
                setSetup(null);
            }
        }
    }, []);

    const mission = missions[
        setup?.activities.includes("vocabulary") ? 0 : 1
    ];

    if (!setup) {
        return (
            <main className="app-shell mission-page">
                <header className="topbar">
                    <Link className="brand" href="/">
                        <span className="brand-mark">✿</span>
                        <span>little outside</span>
                    </Link>
                </header>
                <section className="mission-card">
                    <h1>Let's plan a little adventure.</h1>
                    <p>Choose what you're in the mood for first.</p>
                    <Link className="start-button back-link" href="/">
                        Back to home ↗
                    </Link>
                </section>
            </main>
        );
    }

    async function findMyWords() {
        setLoadingWord(true);
        setWordError("");
        setWordCoach(null);
        setShowFeedback(false);

        try {
            const response = await fetch("/api/vocabulary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reflection }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Couldn't find your words.");
            }

            setWordCoach(data.wordCoach);
            setStage("word");
        } catch (error) {
            setWordError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoadingWord(false);
        }
    }

    return (
        <main className="app-shell mission-page">
            <header className="topbar">
                <Link className="brand" href="/">
                    <span className="brand-mark">✿</span>
                    <span>little outside</span>
                </Link>
                <Link className="journal-link" href="/">
                    ← Back home
                </Link>
            </header>

            <section className="mission-layout">
                <div className={`mission-card ${mission.color}`}>
                    <div className="mission-topline">
                        {/* <span className="eyebrow">{mission.category}</span> */}
                        <span className="mission-emoji">{mission.emoji}</span>
                    </div>

                    {stage === "mission" && (
                        <>
                            <h1>{mission.title}</h1>
                            <p className="mission-intro">{mission.intro}</p>

                            <div className="mission-meta">
                                <span>◷ {setup.time}</span>
                                <span>♡ {setup.budget}</span>
                                <span>✿ {setup.social}</span>
                            </div>

                            <div className="mission-instructions">
                                <h2>Your little mission</h2>
                                <ol>
                                    {mission.instructions.map((instruction) => (
                                        <li key={instruction}>{instruction}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="mission-reminder">
                                <span>☀</span>
                                <p>
                                    No need to take pictures or prove anything. Just go
                                    somewhere safe and see what you notice.
                                </p>
                            </div>

                            <button
                                className="start-button mission-action"
                                onClick={() => setStarted(true)}
                            >
                                {started ? "You're ready to go" : "I'm ready"} <span>↗</span>
                            </button>

                            {started && (
                                <div className="mission-go">
                                    <span>🌷</span>
                                    <div>
                                        <strong>Off you go!</strong>
                                        <p>
                                            Put your phone away. Come back when you're ready to
                                            tell me about it.
                                        </p>
                                        <button
                                            className="text-button"
                                            onClick={() => setStage("reflect")}
                                        >
                                            I'm back from my walk →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {stage === "reflect" && (
                        <>
                            <h1>You're back! ♡</h1>
                            <p className="mission-intro">
                                Take a breath. What did you notice out there?
                            </p>

                            <label className="reflection-label" htmlFor="reflection">
                                Tell me about something you saw, heard, or experienced.
                            </label>
                            <textarea
                                id="reflection"
                                className="reflection-input"
                                value={reflection}
                                onChange={(event) => setReflection(event.target.value)}
                                placeholder="I noticed..."
                                rows={6}
                            />

                            <button
                                className="start-button mission-action"
                                disabled={!reflection.trim() || loadingWord}
                                onClick={findMyWords}
                            >
                                {loadingWord ? "Finding your words..." : "Find my words"}
                                {!loadingWord && <span> ↗</span>}
                            </button>

                            {wordError && (
                                <p role="alert" className="mission-error">
                                    {wordError}
                                </p>
                            )}
                        </>
                    )}

                    {stage === "word" && (
                        <>
                            <h1>Your words, a little richer.</h1>
                            <p className="mission-intro">
                                Here's a word to keep in your pocket for next time.
                            </p>

                            <div className="reflection-quote">
                                <span className="eyebrow">WHAT YOU NOTICED</span>
                                <p>{reflection}</p>
                            </div>

                            {wordCoach && (
                                <>
                                    <div className="word-card">
                                        <span className="eyebrow">A WORD TO KEEP</span>
                                        <h2>{wordCoach.word}</h2>
                                        <p className="word-part">{wordCoach.partOfSpeech}</p>
                                        <p>{wordCoach.definition}</p>

                                        <div className="word-explanation">
                                            <strong>Why this word?</strong>
                                            <p>{wordCoach.whyItFits}</p>
                                        </div>

                                        <div className="word-example">
                                            <span className="eyebrow">IN CONTEXT</span>
                                            <p>{wordCoach.example}</p>
                                        </div>

                                        <span className="word-decoration">✳</span>
                                    </div>

                                    <div className="word-challenge">
                                        <label className="reflection-label" htmlFor="rewrite">
                                            {wordCoach.challenge}
                                        </label>

                                        <textarea
                                            id="rewrite"
                                            className="reflection-input"
                                            value={rewrite}
                                            onChange={(event) => {
                                                setRewrite(event.target.value);
                                                setShowFeedback(false);
                                            }}
                                            placeholder="Try putting it in your own words..."
                                            rows={4}
                                        />

                                        <button
                                            className="start-button mission-action"
                                            disabled={!rewrite.trim()}
                                            onClick={() => setShowFeedback(true)}
                                        >
                                            Keep this word ♡
                                        </button>

                                        {showFeedback && (
                                            <p className="word-feedback" role="status">
                                                Lovely. You've practiced using "{wordCoach.word}" in your own
                                                words. Keep noticing, keep describing. 🌷
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <p className="mission-intro">
                                This is a sample word for now. In the next milestone, we'll
                                have the AI choose words that actually fit your description.
                            </p>

                            <Link className="start-button back-link" href="/">
                                Plan another adventure ↗
                            </Link>
                        </>
                    )}
                </div>

                <aside className="mission-aside">
                    <span className="aside-flower">✿</span>
                    <h2>A little reminder</h2>
                    <p>
                        You don't have to make every moment productive. Sometimes noticing
                        one small thing is enough.
                    </p>
                    <div className="aside-sticker">take your time ♡</div>
                </aside>
            </section>
        </main>
    );
}
