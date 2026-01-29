const { useState } = React;

function CharacterCounter() {
    const limit = 150;
    const [text, setText] = useState("");

    const count = text.length;
    const remaining = limit - count;
    const atLimit = count >= limit;

    const handleChange = (e) => {
        const next = e.target.value.slice(0, limit);
        setText(next);
    };

    return (
        <main className="screen">
            <section className="panel" aria-labelledby="prompt">
                <p id="prompt" className="prompt">Type your message...</p>
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    maxLength={limit}
                    className={atLimit ? "hit" : ""}
                    aria-label="Message input"
                    spellCheck={false}
                />
                <div className="counter" aria-live="polite">{count}/{limit}</div>
            </section>
        </main>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CharacterCounter />);
