'use client';
import { motion } from 'motion/react';
import { Plus, Target, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function QuestManagement() {
  const dailyQuests = [
    {
      id: 1,
      title: 'Complete 2 Lessons',
      description: 'Finish at least 2 lessons today',
      xpReward: 50,
      type: 'daily',
      completions: 1245,
      active: true
    },
    {
      id: 2,
      title: 'Study for 30 Minutes',
      description: 'Spend at least 30 minutes learning',
      xpReward: 40,
      type: 'daily',
      completions: 2103,
      active: true
    },
    {
      id: 3,
      title: 'Take a Quiz',
      description: 'Complete any quiz with 70% or higher',
      xpReward: 60,
      type: 'daily',
      completions: 892,
      active: true
    },
  ];

  const weeklyQuests = [
    {
      id: 4,
      title: 'Complete 10 Lessons',
      description: 'Finish 10 lessons this week',
      xpReward: 200,
      type: 'weekly',
      completions: 456,
      active: true
    },
    {
      id: 5,
      title: 'Perfect Week',
      description: 'Complete all daily quests for 7 days',
      xpReward: 300,
      type: 'weekly',
      completions: 145,
      active: true
    },
  ];

  const specialQuests = [
    {
      id: 6,
      title: 'Course Marathon',
      description: 'Complete an entire course in one week',
      xpReward: 500,
      type: 'special',
      completions: 78,
      active: true
    },
  ];

  const stats = [
    { label: 'Active Quests', value: '12', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Daily Completions', value: '4,240', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total XP Rewarded', value: '125,680', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const QuestCard = ({ quest, index }: { quest: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{quest.title}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${quest.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                quest.type === 'weekly' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
              }`}>
              {quest.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-600 font-medium">+{quest.xpReward} XP</span>
            </div>
            <div className="text-muted-foreground">
              {quest.completions.toLocaleString()} completions
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${quest.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
            {quest.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Quest System
              </h1>
              <p className="text-muted-foreground">Manage daily, weekly and special quests</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Quest
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Daily Quests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Daily Quests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyQuests.map((quest, index) => (
              <QuestCard key={quest.id} quest={quest} index={index} />
            ))}
          </div>
        </div>

        {/* Weekly Quests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Weekly Quests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeklyQuests.map((quest, index) => (
              <QuestCard key={quest.id} quest={quest} index={index + 3} />
            ))}
          </div>
        </div>

        {/* Special Quests */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Special Quests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specialQuests.map((quest, index) => (
              <QuestCard key={quest.id} quest={quest} index={index + 5} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
