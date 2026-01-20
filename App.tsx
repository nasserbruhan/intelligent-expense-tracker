
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Upload, 
  BrainCircuit, 
  FileText, 
  AlertCircle,
  Loader2,
  Sparkles,
  PieChart as PieChartIcon,
  Sun,
  Moon
} from 'lucide-react';
import { analyzeExpenses } from './services/geminiService';
import { AnalysisReport } from './types';
import Dashboard from './components/Dashboard';

const DEMO_CSV = `Date,Description,Amount,Payment Method
2023-11-01,Starbucks,5.50,Credit Card
2023-11-01,Netflix,15.99,Direct Debit
2023-11-02,Rent - Apt 4B,1200.00,ACH
2023-11-03,Exxon Mobile,45.00,Credit Card
2023-11-05,Whole Foods,89.30,Credit Card
2023-11-07,Gym Membership,50.00,Credit Card
2023-11-10,Uber,22.40,Credit Card
2023-11-15,Amazon - Household,45.90,Credit Card
2023-11-18,Dinner - Italian Bistro,75.00,Debit Card
2023-11-20,City Utilities,112.00,ACH
2023-12-01,Starbucks,6.20,Credit Card
2023-12-01,Netflix,15.99,Direct Debit
2023-12-02,Rent - Apt 4B,1200.00,ACH
2023-12-04,Shell Gas,52.00,Credit Card
2023-12-06,Trader Joes,104.50,Credit Card
2023-12-10,Uber,18.90,Credit Card
2023-12-12,Spotify,9.99,Debit Card
2023-12-20,City Utilities,135.00,ACH
2023-12-22,Christmas Shopping - Mall,340.00,Credit Card
2024-01-01,Starbucks,4.50,Credit Card
2024-01-02,Rent - Apt 4B,1200.00,ACH
2024-01-05,Whole Foods,92.00,Credit Card
2024-01-07,Gym Membership,50.00,Credit Card
2024-01-10,Uber,25.00,Credit Card
2024-01-15,iPhone Installment,42.00,Credit Card
2024-01-18,Restaurant - Sushi,110.00,Debit Card
2024-01-22,City Utilities,108.00,ACH
2024-01-25,LinkedIn Premium,29.99,Credit Card`;

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-slate-900');
      document.body.classList.remove('bg-slate-50');
    } else {
      document.body.classList.add('bg-slate-50');
      document.body.classList.remove('bg-slate-900');
    }
  }, [darkMode]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please provide some expense data first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeExpenses(inputText);
      setReport(result);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. Please ensure the data format is correct.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setInputText(DEMO_CSV);
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic Header */}
      <nav className={`border-b sticky top-0 z-50 transition-all duration-300 ${
        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              FinSight <span className="text-indigo-500">AI</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <span className="text-indigo-500 flex items-center gap-1.5"><PieChartIcon className="w-4 h-4" /> Intelligence</span>
              <span className={`cursor-pointer transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>Security</span>
            </div>
            
            <div className={`flex items-center gap-2 border-l pl-4 transition-colors ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all duration-300 border shadow-sm ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-700 hover:shadow-amber-900/10' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-indigo-100'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 transition-transform duration-500 rotate-0" /> : <Moon className="w-5 h-5 transition-transform duration-500 -rotate-12" />}
              </button>
              <button 
                onClick={loadDemo}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                  darkMode ? 'text-indigo-400 bg-indigo-900/30 hover:bg-indigo-900/50' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Hero Section */}
        {!report && !loading && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Next Gen Expense Tracking
            </div>
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Turn your statements into <span className="text-indigo-500">financial wisdom.</span>
            </h2>
            <p className={`text-lg mb-10 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Upload your CSV history. Our AI engine researches merchants using <span className="font-semibold text-indigo-500">Google Search</span> to provide deeper market intelligence.
            </p>
          </div>
        )}

        {/* Input Area */}
        {!report && (
          <div className={`max-w-4xl mx-auto p-8 rounded-3xl shadow-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 shadow-none' : 'bg-white border-slate-100 shadow-indigo-100/50'} mb-12`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="text-slate-400 w-5 h-5" />
                <h3 className="font-bold">Expense Data (CSV / Text)</h3>
              </div>
              <button 
                onClick={() => setInputText('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear All
              </button>
            </div>
            <textarea
              className={`w-full h-64 p-5 rounded-2xl border transition-all font-mono text-sm mb-6 outline-none focus:ring-4 ${
                darkMode 
                  ? 'bg-slate-900 border-slate-700 focus:ring-indigo-900/30 focus:border-indigo-500 text-slate-300' 
                  : 'bg-slate-50 border-slate-200 focus:ring-indigo-100 focus:border-indigo-500 text-slate-800'
              }`}
              placeholder="Paste CSV content here... (Date, Description, Amount)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            <button
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Intelligence Processing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  Generate Grounded Intelligence Report
                </>
              )}
            </button>
          </div>
        )}

        {/* Report Section */}
        {report && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Intelligence Dashboard</h2>
                <p className="text-slate-500 font-medium">Market-grounded analysis of your financial history</p>
              </div>
              <button 
                onClick={() => setReport(null)}
                className={`px-6 py-2.5 border rounded-xl font-bold transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-4 h-4" /> New Analysis
              </button>
            </div>
            <Dashboard report={report} darkMode={darkMode} />
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className={`mt-20 border-t pt-10 pb-10 transition-colors ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-1">
            Powered by <Sparkles className="w-4 h-4 text-indigo-500" /> Grounded Gemini Intelligence Engine
          </p>
          <p className="text-slate-500 text-xs mt-2">© 2024 FinSight AI. Using Search Grounding for real-world merchant analysis.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
