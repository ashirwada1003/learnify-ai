import { Link } from "react-router-dom";

function Home() {
    return (
        // full-screen background: a diagonal gradient from dark blue to purple
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-700 via-emerald-800 to-teal-800 text-white">

            {/* two blurred colour blobs behind the content, just for decoration */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/30 blur-3xl"></div>

            {/* relative keeps the content above the blobs */}
            <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">

                <span className="mb-4 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm backdrop-blur">
                    ✨ AI-powered learning
                </span>

                {/* gradient text: the gradient is the background, clipped to the letters */}
                <h1 className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-5xl font-extrabold text-transparent md:text-6xl">
                    Learnify-AI
                </h1>

                <p className="mt-4 max-w-xl text-lg text-slate-200">
                    Learn with courses, quizzes and an AI tutor that answers from your own lessons.
                </p>

                <div className="mt-8 flex gap-4">
                    <Link
                        to="/login"
                        className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold shadow-lg transition hover:bg-emerald-400"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-lg border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
                    >
                        Register
                    </Link>
                </div>

                <Link to="/courses" className="mt-6 text-sm text-slate-300 underline hover:text-white">
                    Browse courses
                </Link>

                {/* three feature cards */}
                <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                        <p className="text-2xl">📚</p>
                        <h3 className="mt-2 font-semibold">Courses</h3>
                        <p className="mt-1 text-sm text-slate-300">Structured lessons from instructors.</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                        <p className="text-2xl">🤖</p>
                        <h3 className="mt-2 font-semibold">AI Tutor</h3>
                        <p className="mt-1 text-sm text-slate-300">Ask questions, get answers from the lessons.</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                        <p className="text-2xl">📝</p>
                        <h3 className="mt-2 font-semibold">Quizzes</h3>
                        <p className="mt-1 text-sm text-slate-300">Test yourself with auto-made quizzes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;