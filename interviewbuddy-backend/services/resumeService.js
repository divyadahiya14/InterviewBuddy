import pdf from 'pdf-parse';
import Resume from '../models/Resume.js';

const capitalizeSkill = (skill) => {
  switch (skill) {
    case 'java': return 'Java';
    case 'spring boot': return 'Spring Boot';
    case 'spring': return 'Spring';
    case 'react': return 'React';
    case 'angular': return 'Angular';
    case 'vue': return 'Vue.js';
    case 'javascript': return 'JavaScript';
    case 'typescript': return 'TypeScript';
    case 'python': return 'Python';
    case 'django': return 'Django';
    case 'flask': return 'Flask';
    case 'c++': return 'C++';
    case 'c#': return 'C#';
    case 'php': return 'PHP';
    case 'node.js':
    case 'node': return 'Node.js';
    case 'sql': return 'SQL';
    case 'mysql': return 'MySQL';
    case 'postgresql': return 'PostgreSQL';
    case 'mongodb': return 'MongoDB';
    case 'aws': return 'AWS';
    case 'azure': return 'Azure';
    case 'docker': return 'Docker';
    case 'kubernetes': return 'Kubernetes';
    case 'git': return 'Git';
    case 'html': return 'HTML';
    case 'css': return 'CSS';
    case 'machine learning': return 'Machine Learning';
    case 'data science': return 'Data Science';
    case 'devops': return 'DevOps';
    default:
      return skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
};

export const extractSkills = (text) => {
  if (!text || !text.trim()) {
    return '';
  }
  const lowerText = text.toLowerCase();
  const foundSkills = [];

  const commonSkills = [
    'java', 'spring boot', 'spring', 'react', 'angular', 'vue', 'javascript', 'typescript',
    'python', 'django', 'flask', 'c++', 'c#', 'ruby', 'php', 'node.js', 'node', 'express',
    'sql', 'mysql', 'postgresql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'html', 'css', 'machine learning', 'data science', 'devops', 'ci/cd'
  ];

  for (const skill of commonSkills) {
    if (lowerText.includes(skill)) {
      foundSkills.push(capitalizeSkill(skill));
    }
  }

  return foundSkills.join(', ');
};

export const parseAndSaveResume = async (email, fileBuffer) => {
  // Offline parse the PDF
  const data = await pdf(fileBuffer);
  const parsedText = data.text;

  const skills = extractSkills(parsedText);

  const resume = new Resume({
    userEmail: email,
    parsedText,
    skills,
    timestamp: new Date()
  });

  return await resume.save();
};

export const getLatestResume = async (email) => {
  return await Resume.findOne({ userEmail: email }).sort({ timestamp: -1 });
};
