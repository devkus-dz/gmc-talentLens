export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card bg-base-200 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold text-gradient-primary">
            TalentLens
          </h2>
          <p className="text-base-content/70 mt-2">
            The Cognitive ATS is ready to be built.
          </p>
          <div className="card-actions mt-6 w-full">
            <button className="btn btn-primary w-full rounded-xl">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}