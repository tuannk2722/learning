'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, BookOpen, Brain, Award } from 'lucide-react';
import { HistoryEvent, ActivityType } from '@/app/lib/definitions/definitions';
import { HistoryTimeline } from './timeline';

const filters = [
  { key: 'all', label: 'All', icon: CheckCircle2, color: 'text-gray-600', bg: 'bg-gray-100' },
  { key: 'lesson', label: 'Lessons', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'quiz', label: 'Quizzes', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'achievement', label: 'Achievements', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

export function HistoryFilterBar({ events }: { events: HistoryEvent[] }) {
  const [activeFilter, setActiveFilter] = useState<ActivityType | 'all'>('all');

  const filteredEvents = events.filter(event =>
    activeFilter === 'all' || event.type === activeFilter
  );

  const counts = {
    all: events.length,
    lesson: events.filter(e => e.type === 'lesson').length,
    quiz: events.filter(e => e.type === 'quiz').length,
    achievement: events.filter(e => e.type === 'achievement').length,
  };

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${isActive
                  ? `${filter.bg} ${filter.color} ring-2 ring-current ring-offset-2`
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              <span className={`
                ml-1 px-1.5 py-0.5 rounded-full text-[10px] 
                ${isActive ? 'bg-white/50' : 'bg-gray-100'}
              `}>
                {counts[filter.key as keyof typeof counts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <HistoryTimeline events={filteredEvents} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
