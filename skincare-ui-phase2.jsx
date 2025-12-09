import React, { useState } from 'react';
import { ArrowLeft, Check, Copy, Download, Sparkles, ShoppingBag, Info, Clock } from 'lucide-react';

const SkinCareAppPhase2 = () => {
  const [copied, setCopied] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Enhanced mock results with Phase 2 data
  const mockResults = {
    analysis: "Based on your photo and answers, your skin shows signs of dryness particularly in the T-zone area, with some minor texture concerns. Your melanin-rich skin is generally healthy but would benefit from targeted hydration and gentle exfoliation.",
    morning: [
      { 
        step: 1, 
        product: "CeraVe Hydrating Facial Cleanser", 
        why: "Gentle, non-stripping cleanser that maintains your skin barrier", 
        price: "$15",
        howToUse: "Wet your face with lukewarm water. Apply a dime-sized amount to your fingertips and massage into your face in gentle circular motions for 30-60 seconds. Rinse thoroughly with lukewarm water and pat dry with a clean towel.",
        amount: "Dime-sized amount",
        application: "Gentle circular motions",
        whereToBuy: [
          { store: "Amazon", price: "$12.99" },
          { store: "Target", price: "$14.99" },
          { store: "CVS", price: "$15.49" }
        ]
      },
      { 
        step: 2, 
        product: "The Ordinary Niacinamide 10% + Zinc 1%", 
        why: "Reduces oiliness, minimizes pores, evens skin tone", 
        price: "$6",
        howToUse: "Apply 2-3 drops to your fingertips. Gently pat and press the serum into your face and neck while skin is still slightly damp from cleansing. Let it absorb for 1-2 minutes before the next step.",
        amount: "2-3 drops",
        application: "Pat and press into skin",
        waitTime: "Wait 1-2 minutes",
        whereToBuy: [
          { store: "Ulta", price: "$5.90" },
          { store: "Sephora", price: "$5.90" },
          { store: "The Ordinary website", price: "$5.90" }
        ]
      },
      { 
        step: 3, 
        product: "CeraVe Moisturizing Cream", 
        why: "Rich hydration with ceramides for dry skin", 
        price: "$19",
        howToUse: "Take a nickel-sized amount and warm it between your palms. Apply to your face and neck using gentle upward strokes. Can be applied while skin is still slightly damp for better absorption.",
        amount: "Nickel-sized amount",
        application: "Upward strokes",
        whereToBuy: [
          { store: "Amazon", price: "$17.99" },
          { store: "Walmart", price: "$18.99" },
          { store: "Target", price: "$19.49" }
        ]
      },
      { 
        step: 4, 
        product: "Black Girl Sunscreen SPF 30", 
        why: "No white cast, perfect for melanin-rich skin", 
        price: "$16",
        howToUse: "As the final step, apply a generous amount (about two finger lengths) to your entire face and neck. Reapply every 2 hours if you're outside or sweating. Wait 15 minutes before sun exposure.",
        amount: "Two finger lengths",
        application: "Smooth evenly over face and neck",
        waitTime: "Wait 15 min before sun",
        whereToBuy: [
          { store: "Amazon", price: "$15.99" },
          { store: "Target", price: "$15.99" },
          { store: "BGS website", price: "$15.99" }
        ]
      }
    ],
    evening: [
      { 
        step: 1, 
        product: "CeraVe Hydrating Facial Cleanser", 
        why: "Same gentle cleanser as morning", 
        price: "$15",
        howToUse: "Same as morning routine - massage for 30-60 seconds with lukewarm water, rinse thoroughly.",
        amount: "Dime-sized amount",
        application: "Gentle circular motions"
      },
      { 
        step: 2, 
        product: "Paula's Choice 2% BHA Liquid", 
        why: "Gentle exfoliation for texture and pores (2-3x/week)", 
        price: "$32",
        howToUse: "Use only 2-3 times per week after cleansing. Apply a small amount to a cotton pad and gently swipe across your face, avoiding the eye area. Do NOT rinse off. Start with once a week and gradually increase.",
        amount: "Cotton pad amount",
        application: "Gentle swipes, leave on",
        waitTime: "Wait 5 minutes",
        whereToBuy: [
          { store: "Paula's Choice", price: "$32.00" },
          { store: "Amazon", price: "$32.00" },
          { store: "Dermstore", price: "$32.00" }
        ]
      },
      { 
        step: 3, 
        product: "The Ordinary Hyaluronic Acid 2%", 
        why: "Deep hydration boost", 
        price: "$7",
        howToUse: "Apply 2-3 drops to damp skin (this is important!). Pat gently into face and neck. Works best when skin is still slightly wet.",
        amount: "2-3 drops",
        application: "Pat into damp skin",
        whereToBuy: [
          { store: "Ulta", price: "$6.90" },
          { store: "Sephora", price: "$6.90" }
        ]
      },
      { 
        step: 4, 
        product: "CeraVe Moisturizing Cream", 
        why: "Lock in all the good stuff overnight", 
        price: "$19",
        howToUse: "Same as morning - nickel-sized amount, warm between palms, apply in upward strokes. Can use a bit more at night for extra hydration.",
        amount: "Nickel-sized amount",
        application: "Upward strokes"
      }
    ],
    totalCost: "$114 (will last 3-4 months)",
    beginnerGuide: {
      morningTime: "5 minutes total",
      eveningTime: "7-10 minutes total",
      tips: [
        "Always apply products to damp skin - it helps with absorption",
        "Use lukewarm water, never hot (hot water strips natural oils)",
        "Pat your face dry with a clean towel, don't rub",
        "Give products 1-2 minutes to absorb between steps",
        "Start slow - your skin needs time to adjust to new products"
      ],
      mistakes: [
        "Don't skip sunscreen even on cloudy days or indoors",
        "Don't use too much product - a little goes a long way",
        "Don't rub products in harshly - be gentle with your skin",
        "Don't introduce all products at once - add one every few days"
      ]
    }
  };

  const handleCopy = () => {
    const text = `My Skincare Routine\n\n${mockResults.beginnerGuide ? `⏱️ Morning: ${mockResults.beginnerGuide.morningTime} | Evening: ${mockResults.beginnerGuide.eveningTime}\n\n` : ''}Morning:\n${mockResults.morning.map(item => `${item.step}. ${item.product} - ${item.amount}\n   ${item.howToUse}`).join('\n\n')}\n\nEvening:\n${mockResults.evening.map(item => `${item.step}. ${item.product} - ${item.amount}\n   ${item.howToUse}`).join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4 border-b border-indigo-200 bg-white/50 backdrop-blur">
        <button className="p-2 hover:bg-white rounded-lg transition-colors">
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

        {/* Beginner's Guide */}
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
              <div className="text-2xl font-bold">{mockResults.beginnerGuide.morningTime}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Evening</span>
              </div>
              <div className="text-2xl font-bold">{mockResults.beginnerGuide.eveningTime}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm opacity-90">✅ Pro Tips</h4>
              <ul className="space-y-2">
                {mockResults.beginnerGuide.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm bg-white/10 rounded-lg p-3">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm opacity-90">⚠️ Avoid These Mistakes</h4>
              <ul className="space-y-2">
                {mockResults.beginnerGuide.mistakes.map((mistake, idx) => (
                  <li key={idx} className="text-sm bg-white/10 rounded-lg p-3">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
                    {item.whereToBuy && (
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
            {mockResults.evening.map((item) => (
              <div key={item.step} className="border-l-4 border-purple-600 pl-4">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-gray-900">{item.step}. {item.product}</div>
                  <div className="text-purple-600 font-semibold text-sm">{item.price}</div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.why}</p>
                
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
                    {item.whereToBuy && (
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
            <div className="text-3xl font-bold">{mockResults.totalCost}</div>
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
            onClick={() => alert('Download feature would save as PDF with all instructions')}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCareAppPhase2;
