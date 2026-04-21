'use client';

import { motion } from "motion/react";

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Computer Science Student',
    image: 'AC',
    quote: 'StudyHub transformed how I learn. The gamification keeps me motivated every day!',
  },
  {
    name: 'Sarah Johnson',
    role: 'Medical Student',
    image: 'SJ',
    quote: 'The structured roadmaps and analytics help me stay on track with my study goals.',
  },
  {
    name: 'Michael Kim',
    role: 'Self-Learner',
    image: 'MK',
    quote: 'Best learning platform I\'ve used. The interactive lessons make complex topics easy.',
  },
];

export function TestimonialsSection() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4">Loved by Students Worldwide</h2>
          <p className="text-xl text-muted-foreground">
            See what our learners have to say
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-muted-foreground italic leading-relaxed">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}