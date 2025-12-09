import React, { useState, useRef } from 'react';
import { Camera, Check, Copy, Download, ArrowLeft, Sparkles } from 'lucide-react';

const SkinCareApp = () => {
  const [step, setStep] = useState('welcome');
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    gender: '',
    concerns: [],
    currentRoutine: '',
    budget: '',
    preferences: []
  });
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Mock results for demo
  const mockResults = {
    analysis: "Based on your photo and answers, your skin shows signs of dryness particularly in the T-zone area, with some minor texture concerns. Your melanin-rich skin is generally healthy but would benefit from targeted hydration and gentle exfoliation.",
    morning: [
      { step: 1, product: "CeraVe Hydrating Facial Cleanser", why: "Gentle, non-stripping cleanser that maintains your skin barrier", price: "$15" },
      { step: 2, product: "The Ordinary Niacinamide 10% + Zinc 1%", why: "Reduces oiliness, minimizes pores, evens skin tone", price: "$6" },
      { step: 3, product: "CeraVe Moisturizing Cream", why: "Rich hydration with ceramides for dry skin", price: "$19" },
      { step: 4, product: "Black Girl Sunscreen SPF 30", why: "No white cast, perfect for melanin-rich skin", price: "$16" }
    ],
    evening: [
      { step: 1, product: "CeraVe Hydrating Facial Cleanser", why: "Same gentle cleanser as morning", price: "$15" },
      { step: 2, product: "Paula's Choice 2% BHA Liquid", why: "Gentle exfoliation for texture and pores (2-3x/week)", price: "$32" },
      { step: 3, product: "The Ordinary Hyaluronic Acid 2%", why: "Deep hydration boost", price: "$7" },
      { step: 4, product: "CeraVe Moisturizing Cream", why: "Lock in all the good stuff overnight", price: "$19" }
    ],
    totalCost: "$114 (will last 3-4 months)"
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setStep('questions');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConcernToggle = (concern) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const handlePreferenceToggle = (pref) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const handleSubmit = () => {
    // In real app, this would call the API
    setTimeout(() => setStep('results'), 1000);
  };

  const handleCopy = () => {
    const text = `My Skincare Routine\n\nMorning:\n${mockResults.morning.map(item => `${item.step}. ${item.product}`).join('\n')}\n\nEvening:\n${mockResults.evening.map(item => `${item.step}. ${item.product}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">SkinAI</h1>
          <p className="text-lg text-gray-600 mb-8">
            Get a personalized skincare routine in 60 seconds. Scan your face, answer a few questions, done.
          </p>
          <button
            onClick={() => setStep('camera')}
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
            onClick={() => setStep('welcome')}
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

          <div className="w-full max-w-sm">
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="w-full rounded-3xl shadow-xl" />
                <button
                  onClick={() => setImage(null)}
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
              onClick={() => setStep('questions')}
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
            onClick={() => setStep('camera')}
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
            disabled={!formData.gender || formData.concerns.length === 0}
            className="w-full max-w-2xl mx-auto block bg-indigo-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get My Routine
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === 'results') {
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
            <p className="text-gray-700 leading-relaxed">{mockResults.analysis}</p>
          </div>

          {/* Morning Routine */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">☀️ Morning Routine</h3>
            <div className="space-y-4">
              {mockResults.morning.map((item) => (
                <div key={item.step} className="border-l-4 border-indigo-600 pl-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">{item.step}. {item.product}</div>
                    <div className="text-indigo-600 font-semibold text-sm">{item.price}</div>
                  </div>
                  <p className="text-sm text-gray-600">{item.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🌙 Evening Routine</h3>
            <div className="space-y-4">
              {mockResults.evening.map((item) => (
                <div key={item.step} className="border-l-4 border-purple-600 pl-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">{item.step}. {item.product}</div>
                    <div className="text-purple-600 font-semibold text-sm">{item.price}</div>
                  </div>
                  <p className="text-sm text-gray-600">{item.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg mb-6 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Total Investment</div>
              <div className="text-3xl font-bold">{mockResults.totalCost}</div>
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
              onClick={() => alert('Download feature would save as PDF/text')}
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
