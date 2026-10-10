
"use client";

import { useState } from "react";

const activities = [
  {
    id: "notice",
    emoji: "🌼",
    title: "Notice things",
    description: "Find little details hiding in plain sight.",
    color: "lilac",
  },
  {
    id: "vocabulary",
    emoji: "📖",
    title: "Find better words",
    description: "Put your experiences into words.",
    color: "peach",
  },
  {
    id: "talk",
    emoji: "🦋",
    title: "Talk to someone",
    description: "Try a tiny, low-pressure interaction.",
    color: "pink",
  },
  {
    id: "think",
    emoji: "☁️",
    title: "Clear your head",
    description: "Give a thought some room to breathe.",
    color: "yellow",
  },
];

const times = ["15 min", "30 min", "1 hour", "2+ hours"];
const budgets = ["₦0", "₦1k", "₦5k+"];

export default function Home() {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    "notice",
    "vocabulary",
  ]);
  const [time, setTime] = useState("30 min");
  const [budget, setBudget] = useState("₦0");
  const [social, setSocial] = useState("Just me");

  function toggleActivity(id: string) {
    setSelectedActivities((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function startAdventure() {
    if (selectedActivities.length === 0) return;

    const setup = {
      activities: selectedActivities,
      time,
      budget,
      social,
    };

    sessionStorage.setItem("little-outside-session", JSON.stringify(setup));

    window.location.href = "/mission";
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Little Outside home">
          <span className="brand-mark">✿</span>
          <span>little outside</span>
        </a>

        <a className="journal-link" href="/journal">
          <span>♡</span> My journal
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">


          <h1>
            Life is happening
            <br />
            <span>out there.</span>
          </h1>

          <p>
            Let's go find something lovely, learn a new word,
            or simply see the world a little differently.
          </p>
        </div>

        <div className="hero-art" aria-label="A little illustrated garden">
          <div className="sun-doodle">✳</div>
          <span className="floating-star star-one">✦</span>
          <span className="floating-star star-two">✧</span>
          <span className="floating-star star-three">·</span>

          <div className="garden-scene">
            <div className="garden-hill hill-back" />
            <div className="garden-hill hill-front" />

            <div className="flower flower-one">
              <span>✿</span>
            </div>
            <div className="flower flower-two">
              <span>✿</span>
            </div>
            <div className="flower flower-three">
              <span>✿</span>
            </div>

            <div className="pumpkin">
              <span className="pumpkin-stem" />
              <span className="pumpkin-leaf" />
              <span className="pumpkin-body">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="tiny-mushroom">
              <span />
              <i />
            </div>
          </div>

          <div className="art-caption">your world, a little closer ♡</div>
        </div>
      </section>

      <section className="adventure-section">
        <div className="section-heading">
          <div>
            <h2>What do you feel like doing?</h2>
            <p>Pick a few. You can change your mind.</p>
          </div>
          <span className="heading-doodle">✳</span>
        </div>

        <div className="activity-grid">
          {activities.map((activity) => {
            const selected = selectedActivities.includes(activity.id);

            return (
              <button
                key={activity.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleActivity(activity.id)}
                className={`activity-card ${activity.color} ${
                  selected ? "selected" : ""
                }`}
              >
                <span className="activity-emoji">{activity.emoji}</span>
                <span className="activity-check">
                  {selected ? "✓" : "+"}
                </span>
                <span className="activity-title">{activity.title}</span>
                <span className="activity-description">
                  {activity.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="preferences-card">
          <div className="preference-block">
            <span className="preference-title">
              <span>◷</span> How much time have you got?
            </span>
            <div className="choice-row">
              {times.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTime(item)}
                  aria-pressed={time === item}
                  className={`choice-pill ${time === item ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-block">
            <span className="preference-title">
              <span>♡</span> What's the budget?
            </span>
            <div className="choice-row">
              {budgets.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBudget(item)}
                  aria-pressed={budget === item}
                  className={`choice-pill ${budget === item ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-block">
            <span className="preference-title">
              <span>☀</span> People today?
            </span>
            <div className="choice-row">
              {["Just me", "A little interaction", "I'm feeling social"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSocial(item)}
                    aria-pressed={social === item}
                    className={`choice-pill ${social === item ? "active" : ""}`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="start-row">
          <div className="start-note">
            <span>🌷</span>
            <p>
              Your plans don't have to be grand
              <br />
              to make a lovely day.
            </p>
          </div>

          <button
            type="button"
            className="start-button"
            disabled={selectedActivities.length === 0}
            onClick={startAdventure}
          >
            Let's go outside <span>↗</span>
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <span>Made for the curious, the daydreamers & you.</span>
        <span>Take the long way home ✿</span>
      </footer>
    </main>
  );
}
