import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import LeftAiInterview from "../components/LeftAiInterview";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Lightbulb, 
  RefreshCw, 
  Play, 
  Send, 
  Flag,
  Code,
  FlaskConical,
  BarChart,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function Dsa() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hint, setHint] = useState("");
  const type = location.state?.type || "DSA";
  const level = location.state?.level || "easy";
  const [code, setCode] = useState("// write your code here");
  const [language, setLanguage] = useState("cpp");
  const [activeTab, setActiveTab] = useState("code");
  const [result, setResult] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [aiData, setAiData] = useState(() => {
    const saved = sessionStorage.getItem(`${type}_${level}_question`);
    return saved ? JSON.parse(saved) : null;
  });
  const [hasAppliedStarter, setHasAppliedStarter] = useState(false);
  const [codes, setCodes] = useState({});

  useEffect(() => {
    const handleStorage = () => {
      const saved = sessionStorage.getItem(`${type}_${level}_question`);
      if (saved) setAiData(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorage);
    // Also poll since storage event doesn't fire on same page
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [type, level]);

  useEffect(() => {
    setHasAppliedStarter(false);
    setCodes({});
  }, [aiData?.question]);

  const getHint = async () => {
    if (!code || code.trim() === "" || code.includes("// write your code here")) { toast.error("Write some code first"); return; }
    setHintLoading(true);
    try {
      const res = await API.post("/ai/interview/hint", { question: aiData?.statement, code, language });
      const data = res.data;
      
      const hintText = data?.hint || (typeof data === "string" ? data : "⚠️ No hint received");
      
      setHint(hintText);
      setHintCount(prev => prev + 1);
      toast(hintText, { 
         duration: 8000, 
         icon: '💡',
         style: { 
           background: "#1e293b", 
           color: "#f1f5f9", 
           borderRadius: "12px", 
           padding: "16px 20px", 
           fontSize: "14px", 
           border: "1px solid rgba(245,158,11,0.4)", 
           maxWidth: "450px",
           lineHeight: "1.5"
         } 
      });
    } catch (err) {
      console.error("Hint Error:", err);
      toast.error("⚠️ AI is busy. Please try again in a moment.");
    } finally { setHintLoading(false); }
  };

  const templates = {
    cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// Write your solution here\nvoid solve() {\n    \n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    solve();\n    return 0;\n}`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        \n    }\n}`,
    python: `import sys\n\ndef solve():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
    python3: `import sys\n\ndef solve():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
    javascript: `const fs = require('fs');\n\nfunction solve() {\n    // Write your solution here\n}\n\nsolve();`,
    typescript: `function solve(): void {\n    // Write your solution here\n}\n\nsolve();`,
    csharp: `using System;\nusing System.Collections.Generic;\n\nclass Program {\n    static void Main() {\n        // Write your solution here\n    }\n}`,
    go: `package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\t// Write your solution here\n}`,
    rust: `use std::io;\n\nfn main() {\n    // Write your solution here\n}`,
    sql: `-- Write your SQL query here\nSELECT * FROM table_name;`,
    mongodb: `// Write your MongoDB query here\ndb.collection.find({});`
  };

  useEffect(() => {
    if (aiData?.starterCode && !hasAppliedStarter) {
      setCode(aiData.starterCode);
      setHasAppliedStarter(true);
      const defaultLang = type === "Database" ? "sql" : type === "AIML" ? "python" : "cpp";
      setLanguage(defaultLang);
      setCodes({ [defaultLang]: aiData.starterCode });
    } else if (!aiData && !hasAppliedStarter) {
      const defaultLang = type === "Database" ? "sql" : type === "AIML" ? "python" : "cpp";
      setLanguage(defaultLang);
      setCode(templates[defaultLang]);
    }
  }, [aiData, hasAppliedStarter, type]);

  useEffect(() => {
    const defaultLang = type === "Database" ? "sql" : type === "AIML" ? "python" : "cpp";
    setLanguage(defaultLang);
    setCode(templates[defaultLang]);
    setCodes({});
  }, [type]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    const updatedCodes = { ...codes, [language]: code };
    setCodes(updatedCodes);
    setLanguage(newLang);

    if (updatedCodes[newLang]) {
      setCode(updatedCodes[newLang]);
    } else {
      if (newLang === "cpp" && aiData?.starterCode) {
        setCode(aiData.starterCode);
      } else {
        setCode(templates[newLang] || "// Write your code here");
      }
    }
  };

  const endTest = async () => {
    window.speechSynthesis.cancel();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log("Error exiting full-screen:", err));
    }
    setLoadingFeedback(true);
    if (attempts === 0) { setLoadingFeedback(false); alert("❌ Please submit before ending test"); return; }
    
    // Deductions calculation
    const incorrectSubmissions = Math.max(0, attempts - 1);
    const deduction = (incorrectSubmissions * 3) + (hintCount * 2);

    if (!isPassed) {
      // Save a failed attempt to the candidate profile so it shows up on the dashboard
      try {
        const studentEmail = localStorage.getItem("email");
        if (studentEmail) {
          await API.post("/ai/interview/save-report", {
            studentEmail,
            questionType: type || "DSA",
            questionStatement: aiData?.statement,
            starterCode: aiData?.starterCode || "",
            submittedCode: code,
            expectedSolution: aiData?.expectedSolution || aiData?.starterCode || "",
            timeComplexity: "",
            spaceComplexity: "",
            codeQuality: "Error",
            feedback: "❌ Please correct your code. You need to improve your DSA skills.",
            score: 0,
            attempts: attempts,
            hintsUsed: hintCount,
            difficulty: level || "easy",
            language: language || "cpp",
            status: "pending"
          });
        }
      } catch (saveErr) {
        console.error("Failed to save failed attempt to profile", saveErr);
      }

      setLoadingFeedback(false);
      navigate("/feedback", { state: { score: 0, attempts, timeComplexity: "", spaceComplexity: "", codeQuality: "Error", feedback: "❌ Please correct your code. You need to improve your DSA skills." } });
      return;
    }
    try {
      const res = await API.post("/ai/interview/feedback", { question: aiData?.statement, code, language });
      const feedback = res.data;
      
      const baseScore = feedback.score || 100;
      const adjustedScore = Math.max(0, baseScore - deduction);

      let savedReportId = null;
      try {
        const studentEmail = localStorage.getItem("email");
        if (studentEmail) {
          const saveRes = await API.post("/ai/interview/save-report", {
            studentEmail,
            questionType: type || "DSA",
            questionStatement: aiData?.statement,
            starterCode: aiData?.starterCode || "",
            submittedCode: code,
            expectedSolution: aiData?.expectedSolution || aiData?.starterCode || "",
            timeComplexity: feedback.timeComplexity || "",
            spaceComplexity: feedback.spaceComplexity || "",
            codeQuality: feedback.codeQuality || "",
            feedback: feedback.feedback || "",
            score: adjustedScore,
            attempts: attempts,
            hintsUsed: hintCount,
            difficulty: level || "easy",
            language: language || "cpp",
            status: (feedback.codeQuality === "Analysis Pending" || feedback.codeQuality === "Error") ? "pending" : "completed"
          });
          savedReportId = saveRes.data?.id || null;
        }
      } catch (saveErr) {
        console.error("Failed to save report to profile", saveErr);
      }

      navigate("/feedback", { state: { ...feedback, score: adjustedScore, attempts, timeComplexity: feedback.timeComplexity || "", spaceComplexity: feedback.spaceComplexity || "", reportId: savedReportId } });
    } catch (err) {
      console.error("Feedback generation failed, saving pending report...", err);
      let pendingReportId = null;
      try {
        const studentEmail = localStorage.getItem("email");
        if (studentEmail) {
          const pendingSaveRes = await API.post("/ai/interview/save-report", {
            studentEmail,
            questionType: type || "DSA",
            questionStatement: aiData?.statement,
            starterCode: aiData?.starterCode || "",
            submittedCode: code,
            expectedSolution: aiData?.expectedSolution || aiData?.starterCode || "",
            timeComplexity: "-",
            spaceComplexity: "-",
            codeQuality: "Analysis Pending",
            feedback: "AI report generation failed / quota exceeded. The system will regenerate your report in the background.",
            score: 0,
            attempts: attempts,
            hintsUsed: hintCount,
            difficulty: level || "easy",
            language: language || "cpp",
            status: "pending"
          });
          pendingReportId = pendingSaveRes.data?.id || null;
        }
      } catch (saveErr) {
        console.error("Failed to save pending report in catch block", saveErr);
      }
      navigate("/feedback", { state: { score: 0, attempts, timeComplexity: "", spaceComplexity: "", codeQuality: "Analysis Pending", feedback: "AI report generation failed due to rate limits. Your report has been marked as pending and will regenerate in the background shortly.", reportId: pendingReportId } });
    } finally { setLoadingFeedback(false); }
  };

  const testCases = [aiData?.example1 && { input: aiData.example1.input, expected: aiData.example1.output }, aiData?.example2 && { input: aiData.example2.input, expected: aiData.example2.output }].filter(Boolean);

  const runCode = async () => {
    if (!code || code.trim() === "") { setResult("❌ Code is empty"); setActiveTab("result"); return; }
    setActiveTab("result"); setResult("Running...");
    try {
      const res = await API.post("/ai/interview/evaluate", { question: aiData?.statement, code, language, mode: "run" });
      const output = res.data;
      const resultText = typeof output === "string" ? output : output?.result || output?.status || JSON.stringify(output);
      if (resultText.includes("COMPILE_ERROR")) setResult("❌ Compile Error");
      else if (resultText.includes("RUNTIME_ERROR")) setResult("💥 Runtime Error");
      else setResult("✅ Code Executed Successfully");
    } catch { setResult("⚠️ Server Error"); }
  };

  const submitCode = async () => {
    if (!code || code.trim() === "") { setResult("❌ Code is empty"); setActiveTab("result"); return; }
    setActiveTab("result"); setResult("Evaluating..."); setAttempts(prev => prev + 1);
    try {
      const res = await API.post("/ai/interview/evaluate", { question: aiData?.statement, code, language, mode: "submit" });
      let output = res.data;
      if (typeof output === "string") { try { output = JSON.parse(output.replace(/```json/g, "").replace(/```/g, "").trim()); } catch { } }
      if (output?.passed === true || output?.status === "ACCEPTED") {
        setResult("✅ Success! All test cases passed"); setScore(100); setIsPassed(true);
      } else {
        setResult(`❌ ${output?.message || "Some test cases failed"}`); setScore(50); setIsPassed(false);
      }
    } catch { setResult("⚠️ Server Error"); }
  };

  const resultColor = (result.startsWith("🎉") || result.startsWith("✅")) 
    ? "text-emerald-400" 
    : result.startsWith("❌") 
    ? "text-rose-400" 
    : result.startsWith("💥") 
    ? "text-amber-400" 
    : (result.startsWith("Evaluating...") || result.startsWith("Running...")) 
    ? "text-brand animate-pulse" 
    : "text-white/60";

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 h-screen w-full bg-[#0c0c0c]/40 box-border text-white z-10 relative overflow-hidden">
      
      {/* LEFT — Question Panel */}
      <div className="w-full lg:w-[42%] bg-black/40 border border-white/5 rounded-3xl overflow-auto backdrop-blur-xl relative">
        {/* Neon vertical overlay for separating panels */}
        <div className="absolute inset-y-0 right-0 w-px bg-white/5 pointer-events-none" />
        <LeftAiInterview type={type} level={level} />
      </div>

      {/* RIGHT — Code Editor Panel */}
      <div className="flex-1 min-w-0 bg-black/40 border border-white/5 rounded-3xl flex flex-col overflow-hidden backdrop-blur-xl relative">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 border-b border-white/5 bg-white/[0.01] gap-4 flex-shrink-0">
          
          {/* Custom Tabs */}
          <div className="flex gap-1.5 bg-white/5 border border-white/5 p-1 rounded-xl w-full sm:w-auto">
            {[
              { id: "code", label: "Code", icon: Code },
              { id: "testcase", label: "Testcase", icon: FlaskConical },
              { id: "result", label: "Result", icon: BarChart }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-white/10 text-white shadow-sm border border-white/10" 
                      : "text-white/45 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon size={13} className={isSelected ? "text-[#22d3ee]" : "text-white/40"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls Group */}
          <div className="flex flex-wrap gap-2.5 items-center justify-end w-full sm:w-auto">
            
            <button 
              onClick={getHint} 
              disabled={hintLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 active:scale-[0.98] transition-all text-xs font-bold text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lightbulb size={13} />
              <span>{hintLoading ? "Thinking..." : "Hint"}</span>
            </button>

            <select 
              value={language} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold text-white/80 outline-none transition-all cursor-pointer min-w-[100px]"
            >
              <option value="cpp" className="bg-[#121212]">C++</option>
              <option value="python" className="bg-[#121212]">Python</option>
              <option value="python3" className="bg-[#121212]">Python 3</option>
              <option value="java" className="bg-[#121212]">Java</option>
              <option value="sql" className="bg-[#121212]">SQL</option>
              <option value="mongodb" className="bg-[#121212]">MongoDB</option>
              <option value="javascript" className="bg-[#121212]">JavaScript</option>
              <option value="typescript" className="bg-[#121212]">TypeScript</option>
              <option value="csharp" className="bg-[#121212]">C#</option>
              <option value="go" className="bg-[#121212]">Go</option>
              <option value="rust" className="bg-[#121212]">Rust</option>
            </select>

            <button 
              onClick={() => {
                const templates = {
                  cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\n// Write your solution here\nvoid solve() {\n    \n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    solve();\n    return 0;\n}`,
                  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n        \n    }\n}`,
                  python: `import sys\n\ndef solve():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
                  sql: `-- Write your SQL query here\nSELECT * FROM table_name;`
                };
                const newCode = aiData?.starterCode || templates[language] || "// Write your code here";
                setCode(newCode);
                toast.success("Code reset to starter template");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/70"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>

            <button 
              onClick={runCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 active:scale-[0.98] transition-all text-xs font-extrabold text-emerald-400"
            >
              <Play size={13} fill="currentColor" />
              <span>Run</span>
            </button>

            <button 
              onClick={submitCode}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all text-xs font-extrabold text-white shadow-[0_4px_12px_rgba(61,129,227,0.3)]"
            >
              <Send size={13} />
              <span>Submit</span>
            </button>

            <button 
              onClick={endTest} 
              disabled={loadingFeedback}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 active:scale-[0.98] transition-all text-xs font-bold text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag size={13} />
              <span>{loadingFeedback ? "Analyzing..." : "End Test"}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden display: flex flex-col bg-[#121212]/30">
          <AnimatePresence mode="wait">
            {activeTab === "code" && (
              <motion.div 
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                {/* Thin overlay borders inside Editor block to support premium vibes */}
                <div className="absolute inset-0 border border-white/5 rounded-none pointer-events-none z-10" />
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{ 
                    minimap: { enabled: false }, 
                    fontSize: 14, 
                    padding: { top: 16 }, 
                    renderLineHighlight: "line", 
                    scrollBeyondLastLine: false, 
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    cursorBlinking: "smooth",
                    lineNumbersMinChars: 3
                  }}
                />
              </motion.div>
            )}

            {activeTab === "testcase" && (
              <motion.div 
                key="testcase"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-6 space-y-4 overflow-y-auto w-full h-full"
              >
                {testCases.length === 0 ? (
                  <div className="text-center py-20 text-white/30 flex flex-col items-center">
                    <FlaskConical size={48} className="mb-4 text-white/10" />
                    <p className="text-sm font-semibold">Test cases will appear here once a question is loaded.</p>
                  </div>
                ) : (
                  testCases.map((tc, i) => (
                    <div 
                      key={i} 
                      className="bg-white/[0.015] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-white/[0.025] transition-all"
                    >
                      <div className="text-[10px] font-black text-white/30 tracking-wider uppercase mb-3.5">Test Case {i + 1}</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex gap-2">
                          <span className="text-brand font-bold">Input: </span>
                          <code className="text-white/60 font-mono select-all bg-black/45 px-2 py-0.5 rounded border border-white/5">{tc.input}</code>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-emerald-400 font-bold">Expected: </span>
                          <code className="text-white/60 font-mono select-all bg-black/45 px-2 py-0.5 rounded border border-white/5">{tc.expected}</code>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "result" && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-6 space-y-6 overflow-y-auto w-full h-full"
              >
                {/* Result Message Glass panel */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  
                  {/* Status lights on top left */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>

                  <span className="text-[10px] font-black text-white/30 tracking-wider uppercase block mb-3.5">Execution Status</span>
                  
                  <div className="flex items-center gap-3">
                    {result.startsWith("✅") ? (
                      <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                    ) : result.startsWith("❌") ? (
                      <XCircle className="text-rose-400 flex-shrink-0" size={20} />
                    ) : (result.startsWith("Evaluating...") || result.startsWith("Running...")) ? (
                      <Sparkles className="text-brand flex-shrink-0 animate-spin" size={20} />
                    ) : (
                      <AlertCircle className="text-white/40 flex-shrink-0" size={20} />
                    )}
                    
                    <p className={`text-base font-extrabold tracking-tight ${resultColor}`}>
                      {result || "Run or submit your code to see the result here."}
                    </p>
                  </div>
                </div>

                {attempts > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-center">
                      <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider block">Submission Attempts</span>
                      <div className="text-2xl font-black text-white/90 mt-2 tracking-tight">{attempts}</div>
                    </div>
                    
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-center">
                      <span className="text-[10px] font-bold text-white/35 uppercase tracking-wider block">Mock Score</span>
                      <div className={`text-2xl font-black mt-2 tracking-tight ${
                        (result === "Evaluating..." || result === "Running...") 
                          ? "text-amber-400" 
                          : isPassed 
                          ? "text-emerald-400" 
                          : "text-rose-400"
                      }`}>
                        {(result === "Evaluating..." || result === "Running...") ? "⏳ Check..." : isPassed ? "100 / 100" : "50 / 100"}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Dsa;
