'use client';

import React, { useState, useRef } from 'react';
import { Camera, Check, Copy, Download, ArrowLeft, Sparkles, Loader2, ShoppingBag, Info, Clock } from 'lucide-react';

interface FormData {
  gender: string;
  concerns: string[];
  currentRoutine: string;
  budget: string;
  preferences: string[];
}

interface WhereToBuy {
  store: string;
  price: string;
  link?: string;
}

interface RoutineStep {
  step: number;
  product: string;
  why: string;
  price: string;
  howToUse: string;
  amount: string;
  application: string;
  waitTime?: string;
  whereToBuy?: WhereToBuy[];
}

interface BeginnerGuide {
  morningTime: string;
  eveningTime: string;
  tips: string[];
  mistakes: string[];
}

interface AnalysisResult {
  analysis: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  totalCost: string;
  beginnerGuide?: BeginnerGuide;
}

const SkinCareApp = () => {
  const [step, setStep] = useState('welcome');
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    concerns: [],
    currentRoutine: '',
    budget: '',
    preferences: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create canvas and convert to JPEG
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setError('Failed to process image');
            return;
          }

          // Resize if too large (max 1920px on longest side)
          const maxSize = 1920;
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with good quality
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setImage(jpegDataUrl);
          setStep('questions');
        };

        img.onerror = () => {
          setError('Failed to load image. Please try another file.');
        };

        img.src = reader.result as string;
      };

      reader.onerror = () => {
        setError('Failed to read image file');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const handlePreferenceToggle = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
          formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze skin');
      }

      const result: AnalysisResult = await response.json();
      setResults(result);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!results) return;

    let text = `My Skincare Routine\n\n`;

    // Add beginner's guide timing if available
    if (results.beginnerGuide) {
      text += `⏱️ Morning: ${results.beginnerGuide.morningTime} | Evening: ${results.beginnerGuide.eveningTime}\n\n`;
    }

    // Morning routine with detailed instructions
    text += `MORNING ROUTINE:\n`;
    text += results.morning.map(item =>
      `${item.step}. ${item.product} - ${item.amount}\n   ${item.howToUse}${item.waitTime ? `\n   ${item.waitTime}` : ''}`
    ).join('\n\n');

    // Evening routine with detailed instructions
    text += `\n\nEVENING ROUTINE:\n`;
    text += results.evening.map(item =>
      `${item.step}. ${item.product} - ${item.amount}\n   ${item.howToUse}${item.waitTime ? `\n   ${item.waitTime}` : ''}`
    ).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!results) return;

    let text = `SkinAI - Your Personalized Skincare Routine\n\n`;
    text += `SKIN ANALYSIS:\n${results.analysis}\n\n`;

    // Add beginner's guide if available
    if (results.beginnerGuide) {
      text += `NEW TO SKINCARE? START HERE\n`;
      text += `Morning Time: ${results.beginnerGuide.morningTime}\n`;
      text += `Evening Time: ${results.beginnerGuide.eveningTime}\n\n`;
      text += `PRO TIPS:\n${results.beginnerGuide.tips.map(tip => `• ${tip}`).join('\n')}\n\n`;
      text += `AVOID THESE MISTAKES:\n${results.beginnerGuide.mistakes.map(mistake => `• ${mistake}`).join('\n')}\n\n`;
    }

    // Morning routine with full details
    text += `MORNING ROUTINE:\n`;
    text += results.morning.map(item => {
      let itemText = `${item.step}. ${item.product} (${item.price})\n`;
      itemText += `   Why: ${item.why}\n`;
      itemText += `   Amount: ${item.amount}\n`;
      itemText += `   How to Use: ${item.howToUse}\n`;
      if (item.waitTime) {
        itemText += `   Wait Time: ${item.waitTime}\n`;
      }
      if (item.whereToBuy && item.whereToBuy.length > 0) {
        itemText += `   Where to Buy:\n`;
        itemText += item.whereToBuy.map(store => `      • ${store.store}: ${store.price}`).join('\n');
      }
      return itemText;
    }).join('\n\n');

    // Evening routine with full details
    text += `\n\nEVENING ROUTINE:\n`;
    text += results.evening.map(item => {
      let itemText = `${item.step}. ${item.product} (${item.price})\n`;
      itemText += `   Why: ${item.why}\n`;
      itemText += `   Amount: ${item.amount}\n`;
      itemText += `   How to Use: ${item.howToUse}\n`;
      if (item.waitTime) {
        itemText += `   Wait Time: ${item.waitTime}\n`;
      }
      if (item.whereToBuy && item.whereToBuy.length > 0) {
        itemText += `   Where to Buy:\n`;
        itemText += item.whereToBuy.map(store => `      • ${store.store}: ${store.price}`).join('\n');
      }
      return itemText;
    }).join('\n\n');

    text += `\n\nTOTAL INVESTMENT: ${results.totalCost}\n\n`;
    text += `Generated by SkinAI - 100% private, no data stored.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-skincare-routine.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="/logo.png" alt="SkinAI Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">SkinAI</h1>
          <p className="text-lg text-gray-600 mb-8">
            Get a personalized skincare routine in 60 seconds. Scan your face, answer a few questions, done.
          </p>
          <button
            onClick={() => {
              setError(null);
              setStep('camera');
            }}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Start Analysis
          </button>
          <p className="text-sm text-gray-500 mt-6">
            100% private • No account needed • Data deleted after viewing
          </p>
        </div>
      </div>
    );
  }

  // Camera Screen
  if (step === 'camera') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4">
          <button
            onClick={() => {
              setError(null);
              setStep('welcome');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Take a Photo</h2>
            <p className="text-gray-600">Clear photo of your face in good lighting</p>
          </div>

          {error && (
            <div className="w-full max-w-sm mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="w-full max-w-sm">
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="w-full rounded-3xl shadow-xl" />
                <button
                  onClick={() => {
                    setImage(null);
                    setError(null);
                  }}
                  className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  Retake
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square border-4 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <Camera className="w-16 h-16 text-gray-400 mb-3" />
                <span className="text-gray-600 font-medium">Tap to capture</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleImageCapture}
              className="hidden"
            />
          </div>

          {image && (
            <button
              onClick={() => {
                setError(null);
                setStep('questions');
              }}
              className="w-full max-w-sm mt-8 bg-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  // Questions Screen
  if (step === 'questions') {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => {
              setError(null);
              setStep('camera');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6 max-w-2xl mx-auto pb-32">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your skin</h2>
            <p className="text-gray-600">This helps us personalize your routine</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['Male', 'Female'].map(option => (
                  <button
                    key={option}
                    onClick={() => setFormData({...formData, gender: option})}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      formData.gender === option
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Primary Concerns (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Dryness', 'Acne/Pimples', 'Dark Spots', 'Oily', 'Sensitive', 'Uneven Tone'].map(concern => (
                  <button
                    key={concern}
                    onClick={() => handleConcernToggle(concern)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all text-sm ${
                      formData.concerns.includes(concern)
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Routine */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Current Routine</label>
              <div className="space-y-2">
                {['Nothing really', 'Just wash my face', 'Have some products'].map(option => (
                  <button
                    key={option}
                    onClick={() => setFormData({...formData, currentRoutine: option})}
                    className={`w-full py-3 rounded-xl font-medium transition-all text-left px-4 ${
                      formData.currentRoutine === option
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Range</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '$', desc: 'Under $50' },
                  { label: '$$', desc: '$50-150' },
                  { label: '$$$', desc: '$150+' }
                ].map(option => (
                  <button
                    key={option.label}
                    onClick={() => setFormData({...formData, budget: option.label})}
                    className={`py-3 rounded-xl font-medium transition-all ${
                      formData.budget === option.label
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-lg">{option.label}</div>
                    <div className="text-xs opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preferences (optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Fragrance-free', 'Natural/Clean', 'Vegan', 'Cruelty-free'].map(pref => (
                  <button
                    key={pref}
                    onClick={() => handlePreferenceToggle(pref)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all text-sm ${
                      formData.preferences.includes(pref)
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={!formData.gender || formData.concerns.length === 0 || loading}
            className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get My Routine'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-4 border-b border-indigo-200 bg-white/50 backdrop-blur">
          <button
            onClick={() => {
              setStep('welcome');
              setImage(null);
              setFormData({
                gender: '',
                concerns: [],
                currentRoutine: '',
                budget: '',
                preferences: []
              });
              setResults(null);
              setError(null);
            }}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto p-6 pb-32">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Custom Routine</h2>
            <p className="text-gray-600">Tailored specifically for your skin</p>
          </div>

          {/* Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
              Skin Analysis
            </h3>
            <p className="text-gray-700 leading-relaxed">{results.analysis}</p>
          </div>

          {/* Beginner's Guide - Only show if user has no current routine */}
          {results.beginnerGuide && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg mb-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2" />
                New to Skincare? Start Here
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Morning</span>
                  </div>
                  <div className="text-2xl font-bold">{results.beginnerGuide.morningTime}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Evening</span>
                  </div>
                  <div className="text-2xl font-bold">{results.beginnerGuide.eveningTime}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm opacity-90">✅ Pro Tips</h4>
                  <ul className="space-y-2">
                    {results.beginnerGuide.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm bg-white/10 rounded-lg p-3">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm opacity-90">⚠️ Avoid These Mistakes</h4>
                  <ul className="space-y-2">
                    {results.beginnerGuide.mistakes.map((mistake, idx) => (
                      <li key={idx} className="text-sm bg-white/10 rounded-lg p-3">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Morning Routine */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">☀️ Morning Routine</h3>
            <div className="space-y-4">
              {results.morning.map((item) => (
                <div key={item.step} className="border-l-4 border-indigo-600 pl-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">{item.step}. {item.product}</div>
                    <div className="text-indigo-600 font-semibold text-sm">{item.price}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.why}</p>

                  {/* Expandable usage details */}
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === `m${item.step}` ? null : `m${item.step}`)}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700 mb-2"
                  >
                    {expandedProduct === `m${item.step}` ? '▼ Hide details' : '▶ How to use'}
                  </button>

                  {expandedProduct === `m${item.step}` && (
                    <div className="mt-3 bg-indigo-50 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-indigo-900 mb-1">AMOUNT</div>
                        <div className="text-sm text-gray-700">{item.amount}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-900 mb-1">HOW TO APPLY</div>
                        <div className="text-sm text-gray-700">{item.howToUse}</div>
                      </div>
                      {item.waitTime && (
                        <div>
                          <div className="text-xs font-semibold text-indigo-900 mb-1">WAIT TIME</div>
                          <div className="text-sm text-gray-700">{item.waitTime}</div>
                        </div>
                      )}
                      {item.whereToBuy && item.whereToBuy.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-indigo-900 mb-2 flex items-center">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            WHERE TO BUY
                          </div>
                          <div className="space-y-1">
                            {item.whereToBuy.map((store, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-white rounded px-3 py-2">
                                <span className="text-gray-700">{store.store}</span>
                                <span className="font-semibold text-indigo-600">{store.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🌙 Evening Routine</h3>
            <div className="space-y-4">
              {results.evening.map((item) => (
                <div key={item.step} className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">{item.step}. {item.product}</div>
                    <div className="text-purple-600 font-semibold text-sm">{item.price}</div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.why}</p>

                  {/* Expandable usage details */}
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === `e${item.step}` ? null : `e${item.step}`)}
                    className="text-sm text-purple-600 font-medium hover:text-purple-700 mb-2"
                  >
                    {expandedProduct === `e${item.step}` ? '▼ Hide details' : '▶ How to use'}
                  </button>

                  {expandedProduct === `e${item.step}` && (
                    <div className="mt-3 bg-purple-50 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-purple-900 mb-1">AMOUNT</div>
                        <div className="text-sm text-gray-700">{item.amount}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-purple-900 mb-1">HOW TO APPLY</div>
                        <div className="text-sm text-gray-700">{item.howToUse}</div>
                      </div>
                      {item.waitTime && (
                        <div>
                          <div className="text-xs font-semibold text-purple-900 mb-1">WAIT TIME</div>
                          <div className="text-sm text-gray-700">{item.waitTime}</div>
                        </div>
                      )}
                      {item.whereToBuy && item.whereToBuy.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-purple-900 mb-2 flex items-center">
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            WHERE TO BUY
                          </div>
                          <div className="space-y-1">
                            {item.whereToBuy.map((store, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-white rounded px-3 py-2">
                                <span className="text-gray-700">{store.store}</span>
                                <span className="font-semibold text-purple-600">{store.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg mb-6 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Total Investment</div>
              <div className="text-3xl font-bold">{results.totalCost}</div>
              <div className="text-sm opacity-75 mt-2">Best deals highlighted above 👆</div>
            </div>
          </div>
        </div>

        {/* Fixed bottom buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkinCareApp;
