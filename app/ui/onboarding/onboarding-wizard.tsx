'use client';
import { BookOpen, Briefcase, Crown, Flame, Loader2, Sparkles, Target, Trophy, ChevronRight, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selections, setSelections] = useState({
    goal: "",
    courseId: ""
  });

  const goals = [
    { id: 'career', label: 'Boost Career', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
    { id: 'exam', label: 'Exam Prep', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    { id: 'fun', label: 'Just for Fun', icon: Target, color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200' },
  ];

  const suggestedCourses = [
    { id: 'c1', title: 'React Masterclass', level: 'Beginner', duration: '4 Weeks', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'c2', title: 'UI/UX Principles', level: 'All Levels', duration: '2 Weeks', icon: Sparkles, color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 'c3', title: 'Python for Data', level: 'Intermediate', duration: '6 Weeks', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  // Trigger confetti when hitting step 3
  useEffect(() => {
    if (step === 3) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [step]);

  const handleNext = () => {
    if (step === 2) {
      setIsLoading(true);
      // Giả lập Enroll API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden relative min-h-[500px] flex flex-col border border-gray-100">
      
      {/* Header and Progress */}
      {step < 3 && (
         <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                 <Trophy className="w-5 h-5 text-white" />
               </div>
               <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                 LearnQuest
               </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4 max-w-md mx-auto">
               <motion.div 
                 className="bg-violet-600 h-full rounded-full"
                 initial={{ width: `${((step - 1) / 2) * 100}%` }}
                 animate={{ width: `${(step / 2) * 100}%` }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
               />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 1 ? "What brings you here?" : "Pick your first quest"}
            </h2>
            <p className="text-gray-500">
              {step === 1 ? "We'll customize your learning journey." : "Start learning immediately and earn your first badge."}
            </p>
         </div>
      )}

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full items-center"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {goals.map((g) => {
                  const isSelected = selections.goal === g.id;
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelections({ ...selections, goal: g.id })}
                      className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 ${
                        isSelected 
                         ? `border-violet-500 bg-violet-50 shadow-md transform -translate-y-1` 
                         : `border-gray-100 hover:border-violet-200 hover:bg-gray-50`
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-violet-600 text-white' : `${g.bg} ${g.color}`}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="font-bold text-gray-800 text-lg">{g.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 w-full max-w-sm">
                <button
                  onClick={handleNext}
                  disabled={!selections.goal}
                  className="w-full py-4 bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg hover:shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center h-full"
            >
              <div className="space-y-4 w-full max-w-xl">
                {suggestedCourses.map((c) => {
                  const isSelected = selections.courseId === c.id;
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelections({ ...selections, courseId: c.id })}
                      className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-5 transition-all duration-300 ${
                        isSelected 
                         ? `border-violet-500 bg-violet-50/50 shadow-md` 
                         : `border-gray-100 hover:border-violet-200 hover:bg-gray-50`
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-violet-600 text-white' : c.bg + ' ' + c.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-gray-900 text-lg">{c.title}</h3>
                         <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Target className="w-4 h-4"/> {c.level}</span>
                            <span>•</span>
                            <span>{c.duration}</span>
                         </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-violet-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-violet-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 w-full max-w-xl flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isLoading || !selections.courseId}
                  className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Start Learning
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center text-center h-full pt-6"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-violet-400 blur-[60px] opacity-20 rounded-full" />
                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                  className="w-36 h-36 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl relative z-10 rotate-3"
                >
                  <Crown className="w-20 h-20 text-white" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="absolute -bottom-4 -right-4 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-xl border-2 border-white shadow-xl z-20 flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  +100 XP
                </motion.div>
              </div>

              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">You're all set!</h2>
              <p className="text-lg text-gray-600 mb-10 max-w-md">
                You successfully enrolled in your first course. You've earned the <b>Pioneer Badge</b> to kickstart your journey.
              </p>

              <button
                onClick={() => router.push('/dashboard')}
                className="w-full max-w-xs py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1"
              >
                Go to Dashboard
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
