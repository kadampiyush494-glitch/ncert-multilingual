import { BookOpen, Brain, Globe, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Understand Every{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NCERT Concept
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                Any Language. Any Grade.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                Grades 5 to 10 | Multilingual | Verified Answers | Citations Included
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-all hover:border-blue-500 dark:hover:border-blue-500"
                >
                  Try Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 ml-auto max-w-xs">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      What is photosynthesis?
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                      Photosynthesis is the process by which green plants make their own food using sunlight, water, and carbon dioxide.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <FileText className="w-3 h-3" />
                      <span>NCERT Grade 7 Science, Ch 1</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="grid md:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Only NCERT Verified"
              description="All answers sourced exclusively from official NCERT textbooks"
              color="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="AI + RAG Powered"
              description="Advanced retrieval system with intelligent context understanding"
              color="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Multilingual Support"
              description="Hindi, English, Urdu, and regional languages supported"
              color="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Citations Included"
              description="Every answer includes exact chapter, page, and book reference"
              color="from-orange-500 to-orange-600"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl px-8 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Students
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Simple, friendly, and designed for learning
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BenefitItem text="Ask questions in your own language" />
            <BenefitItem text="Get instant, accurate answers" />
            <BenefitItem text="See exactly where the answer comes from" />
            <BenefitItem text="Ask follow-up questions naturally" />
            <BenefitItem text="Choose explanation difficulty level" />
            <BenefitItem text="Works on phone and computer" />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Clear Your Doubts?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students using AI-powered learning to master their NCERT curriculum
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Solving Doubts
          </button>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:transform hover:scale-105">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-200">{text}</span>
    </div>
  );
}

