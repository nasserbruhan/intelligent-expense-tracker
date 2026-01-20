
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  CheckCircle2, CreditCard, Calendar, Target, Zap, ExternalLink, Globe
} from 'lucide-react';
import { AnalysisReport } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

interface DashboardProps {
  report: AnalysisReport;
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ report, darkMode }) => {
  const pieData = report.topCategories.map(cat => ({
    name: cat.category,
    value: cat.amount
  }));

  const trendData = report.monthlyTrends.map(t => ({
    name: t.month,
    change: parseFloat(t.change.replace('%', ''))
  }));

  const cardClass = `p-6 rounded-2xl shadow-sm border transition-colors ${
    darkMode 
      ? 'bg-slate-800 border-slate-700 text-slate-100' 
      : 'bg-white border-slate-100 text-slate-900'
  }`;

  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${textSecondary} text-sm font-medium`}>Predicted Next Month</span>
            <Target className="text-indigo-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            ${report.predictions.nextMonthTotal.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on ML trend analysis</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${textSecondary} text-sm font-medium`}>Top Category</span>
            <CreditCard className="text-pink-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {report.topCategories[0]?.category || 'N/A'}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ${report.topCategories[0]?.amount.toLocaleString()} ({report.topCategories[0]?.percentage}%)
          </p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${textSecondary} text-sm font-medium`}>Spending Pulse</span>
            <Zap className="text-amber-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {report.monthlyTrends[0]?.change || '0%'}
          </div>
          <p className="text-xs text-slate-400 mt-1">Change from previous cycle</p>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${textSecondary} text-sm font-medium`}>Recurring Load</span>
            <Calendar className="text-emerald-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">
            {report.recurringExpenses.length} Items
          </div>
          <p className="text-xs text-slate-400 mt-1">Identified subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className={cardClass}>
          <h3 className={`text-lg font-bold mb-6 ${textTitle}`}>Spending Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke={darkMode ? '#1e293b' : '#fff'}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: darkMode ? '#0f172a' : '#fff',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trends */}
        <div className={cardClass}>
          <h3 className={`text-lg font-bold mb-6 ${textTitle}`}>Monthly Change (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: darkMode ? '#334155' : '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: darkMode ? '#0f172a' : '#fff',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.change > 0 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grounding Sources (Search Results) */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <div className={`${cardClass} border-l-4 border-l-indigo-500`}>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-indigo-500 w-5 h-5" />
            <h3 className={`text-lg font-bold ${textTitle}`}>Market Research & Sources</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {report.groundingSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' 
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {source.title} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ML Insights & Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-amber-400 w-6 h-6" />
            <h3 className="text-xl font-bold">Predictive Intelligence</h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">High Risk Categories</p>
              <div className="flex flex-wrap gap-2">
                {report.predictions.highRiskCategories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold">Stable Sectors</p>
              <div className="flex flex-wrap gap-2">
                {report.predictions.stableCategories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <p className="text-slate-400 text-sm mb-4 italic">"{report.keyInsights[0]}"</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="text-indigo-500 w-6 h-6" />
            <h3 className={`text-xl font-bold ${textTitle}`}>Actionable Recommendations</h3>
          </div>
          <ul className="space-y-4">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 transition-colors ${darkMode ? 'bg-slate-700' : 'bg-indigo-50'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-white`} />
                </div>
                <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expense Log */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className={`px-8 py-6 border-b flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className={`text-lg font-bold ${textTitle}`}>Categorized Intelligence Log</h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">{report.categorizationSummary.length} Transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Merchant / Description</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ML Predicted Category</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
              {report.categorizationSummary.map((item, idx) => (
                <tr key={idx} className={`${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className="px-8 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className={`px-8 py-4 text-sm font-medium ${textTitle}`}>{item.description}</td>
                  <td className={`px-8 py-4 text-sm font-bold text-right ${textTitle}`}>${item.amount.toLocaleString()}</td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
