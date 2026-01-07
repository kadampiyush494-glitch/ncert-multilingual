import { useState } from 'react';
import { User, GraduationCap, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Grade, Subject, Language, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('8');
  const [subject, setSubject] = useState<Subject>('Science');
  const [language, setLanguage] = useState<Language>('English');

  const grades: Grade[] = ['5', '6', '7', '8', '9', '10'];
  const subjects: Subject[] = ['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Urdu'];
  const languages: Language[] = ['English', 'Hindi', 'Urdu', 'Tamil', 'Telugu', 'Marathi', 'Bengali'];

  const handleContinue = () => {
    if (role === 'student') {
      login({
        role: 'student',
        name: name || undefined,
        grade,
        preferredLanguage: language,
        preferredSubject: subject,
      });

      navigate('/chat'); // ✅ React Router
    }

    if (role === 'admin') {
      login({
        role: 'admin',
        preferredLanguage: language,
      });

      navigate('/admin'); // ✅ React Router
    }
  };

  // ================= ROLE SELECTION =================
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to NCERT AI
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose how you'd like to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <RoleCard
              icon={<GraduationCap className="w-12 h-12" />}
              title="Student"
              description="Ask questions and get instant answers from NCERT textbooks"
              color="from-blue-500 to-blue-600"
              onClick={() => setRole('student')}
            />
            <RoleCard
              icon={<User className="w-12 h-12" />}
              title="Admin"
              description="Access analytics dashboard and manage system performance"
              color="from-purple-500 to-purple-600"
              onClick={() => setRole('admin')}
            />
          </div>
        </div>
      </div>
    );
  }

  // ================= FORM =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setRole(null)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {role === 'student' ? 'Student Setup' : 'Admin Login'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {role === 'student'
              ? 'Help us personalize your experience'
              : 'Configure your preferences'}
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name (Optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  {grades.map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  {subjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 hover:border-blue-500 text-left"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}

