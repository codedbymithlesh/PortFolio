const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  hero: {
    name: { type: String, default: 'MITHLESH RAJBHAR' },
    subtitle: { type: String, default: 'MERN STACK DEVELOPER | CREATOR | LEARNER' },
    bio: { type: String, default: 'Motivated Web Developer with hands-on experience in building responsive and user-friendly web applications. Actively improving problem-solving skills through real-world projects.' },
    profileImage: { type: String, default: 'https://res.cloudinary.com/dhepliygh/image/upload/f_auto,q_auto/person_zcnmuw' },
  },
  about: {
    professionalSummary: { type: String, default: 'I have a strong understanding of front-end development with HTML, CSS, JavaScript, React.js, and Tailwind CSS. Familiar with back-end development using Node.js, Express.js, PHP and Python, along with database management using MySQL and MongoDB.' },
    quote: { type: String, default: 'To build a successful career by continuously learning new technologies, working on real-world projects, and creating innovative solutions.' },
    badges: [{ label: String, type: { type: String, enum: ['orange', 'red'], default: 'orange' } }],
  },
  education: [
    {
      year: String,
      title: String,
      description: String,
      dotColor: { type: String, enum: ['orange', 'blue', 'red', 'cyan'], default: 'blue' },
    }
  ],
  skills: {
    frontend: [String],
    backend: [String],
    tools: [String],
  },
  projects: [
    {
      icon: { type: String, default: '🚀' },
      previewImage: { type: String, default: '' },
      title: String,
      tech: [String],
      description: String,
      link: { type: String, default: '#' },
      linkLabel: { type: String, default: 'View Page' },
    }
  ],
  contact: {
    email: { type: String, default: 'mithleshrajbhar23@gmail.com' },
    location: { type: String, default: 'Mumbai, Maharashtra - 400072' },
    github: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
