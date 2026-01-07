import { useState } from 'react';
import { Clock, Target, CheckCircle, AlertTriangle, TrendingUp, Upload, Database, BarChart3, Download } from 'lucide-react';

export function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'upload' | 'monitoring' | 'evaluation'>('overview');

  const mockAnalytics = {
    avgLatency: 3.2,
    accuracy: 87,
    groundedAnswers: 85,
    failedQueries: 4,
    totalQueries: 1247,
    languageUsage: {
      English: 620,
      Hindi: 380,
      Urdu: 120,
      Tamil: 80,
      Telugu: 30,
      Marathi: 12,
      Bengali: 5,
    },
    subjectUsage: {
      Math: 340,
      Science: 520,
      'Social Science': 280,
      English: 60,
      Hindi: 35,
      Urdu: 12,
    },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Analytics, Monitoring & System Management</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="Analytics"
          />
          <TabButton
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
            icon={<Upload className="w-4 h-4" />}
            label="Upload"
          />
          <TabButton
            active={activeTab === 'monitoring'}
            onClick={() => setActiveTab('monitoring')}
            icon={<Database className="w-4 h-4" />}
            label="RAG Monitor"
          />
          <TabButton
            active={activeTab === 'evaluation'}
            onClick={() => setActiveTab('evaluation')}
            icon={<CheckCircle className="w-4 h-4" />}
            label="Evaluation"
          />
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={<Clock className="w-6 h-6" />}
                title="Avg Latency"
                value={`${mockAnalytics.avgLatency}s`}
                change="-0.3s"
                positive={true}
                color="from-blue-500 to-blue-600"
              />
              <MetricCard
                icon={<Target className="w-6 h-6" />}
                title="Accuracy"
                value={`${mockAnalytics.accuracy}%`}
                change="+2%"
                positive={true}
                color="from-green-500 to-green-600"
              />
              <MetricCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Grounded Answers"
                value={`${mockAnalytics.groundedAnswers}%`}
                change="+1%"
                positive={true}
                color="from-purple-500 to-purple-600"
              />
              <MetricCard
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Failed Queries"
                value={`${mockAnalytics.failedQueries}%`}
                change="-1%"
                positive={true}
                color="from-orange-500 to-orange-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language Usage</h3>
                <div className="space-y-3">
                  {Object.entries(mockAnalytics.languageUsage).map(([lang, count]) => {
                    const percentage = (count / mockAnalytics.totalQueries) * 100;
                    return (
                      <div key={lang}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{lang}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(mockAnalytics.subjectUsage).map(([subject, count]) => {
                    const percentage = (count / mockAnalytics.totalQueries) * 100;
                    return (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-blue-600"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Analytics</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Latency Over Time</h4>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Chart would be rendered here with real data</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accuracy Trend</h4>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Chart would be rendered here with real data</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload NCERT Content</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Grade
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {['5', '6', '7', '8', '9', '10'].map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Subject
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Urdu'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Language
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {['English', 'Hindi', 'Urdu', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Drop PDFs or images here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to browse</p>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Select Files
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Processing Status</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">No files currently processing</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Indexed Chunks" value="124,587" color="blue" />
              <StatCard title="Vector Count" value="124,587" color="purple" />
              <StatCard title="Memory Usage" value="2.4 GB" color="green" />
              <StatCard title="Avg Relevance" value="0.87" color="orange" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">RAG Pipeline Status</h3>
              <div className="space-y-4">
                <StatusRow label="Vector Database" status="operational" />
                <StatusRow label="Embedding Model" status="operational" />
                <StatusRow label="Retrieval System" status="operational" />
                <StatusRow label="Generation Model" status="operational" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evaluation Dataset</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export Dataset
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Question</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Answer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Correct</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">What is photosynthesis?</td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">Process by which plants make food...</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                        Yes
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">Helpful</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({ icon, title, value, change, positive, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function StatCard({ title, value, color }: {
  title: string;
  value: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: 'operational' | 'warning' | 'error' }) {
  const statusConfig = {
    operational: { color: 'bg-green-500', text: 'Operational' },
    warning: { color: 'bg-yellow-500', text: 'Warning' },
    error: { color: 'bg-red-500', text: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 ${config.color} rounded-full`}></div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{config.text}</span>
      </div>
    </div>
  );
}
