const steps = [
  {
    number: '01',
    title: 'Submit Your Request',
    description:
      'Fill out our quick audit request form with your business details. It takes less than 3 minutes and costs nothing.',
  },
  {
    number: '02',
    title: 'We Analyze Your Business',
    description:
      'Our team dives deep into your metrics, marketing channels, and growth potential to identify key opportunities.',
  },
  {
    number: '03',
    title: 'Receive Your Roadmap',
    description:
      'Get a detailed, actionable audit report with a custom 90-day growth plan tailored specifically to your business.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
            Three simple steps to unlock your business's growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 hover:border-zinc-700 transition-colors"
            >
              <span className="block text-5xl sm:text-6xl font-bold text-zinc-800 leading-none mb-4 select-none">
                {step.number}
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
