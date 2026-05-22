export default function LoadingSpinner({ fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4 animate-fadeIn">
      <div className="relative w-16 h-16">
        {/* Outer glowing pulsing orb */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 opacity-20 blur-md animate-pulse"></div>
        {/* Middle spinning border */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary-500 animate-spin"></div>
        {/* Inner spinning border (reverse direction) */}
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-accent-400 animate-spin [animation-direction:reverse] opacity-80"></div>
        {/* Tiny center pulsing core */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-300 shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
      </div>
      <p className="text-sm font-semibold tracking-widest text-dark-200 uppercase animate-pulse">
        AI is processing...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900 bg-opacity-90 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
}
