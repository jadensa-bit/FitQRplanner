"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details
    if (sessionId) {
      fetch(`/api/order-status?session_id=${sessionId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch order');
          }
          return res.text();
        })
        .then(text => {
          try {
            const data = JSON.parse(text);
            setOrderInfo(data);
          } catch (e) {
            console.error('JSON parse error:', e, 'Response:', text);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Payment Successful! 🎉</h1>
              <p className="text-lg text-gray-600">Your FitQR plan is on its way!</p>
            </div>

            {orderInfo && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Confirmation</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Order #:</span><span className="font-mono">{orderInfo.id?.substring(0, 8)}</span></div>
                  <div className="flex justify-between"><span>Email:</span><span>{orderInfo.customer_email}</span></div>
                  <div className="flex justify-between"><span>Plan:</span><span className="capitalize">{orderInfo.plan_id}</span></div>
                  <div className="flex justify-between"><span>Amount:</span><span className="font-bold text-green-600">${(orderInfo.amount_total / 100).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Status:</span><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">PAID</span></div>
                </div>
              </div>
            )}

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-3">What's Next?</h2>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3"><span className="font-bold text-purple-600">1.</span><span>Check your email for your custom plan (within 24 hours)</span></div>
                <div className="flex gap-3"><span className="font-bold text-purple-600">2.</span><span>Download your free habit tracker & meal prep guide</span></div>
                <div className="flex gap-3"><span className="font-bold text-purple-600">3.</span><span>Start with one workout and one healthy meal this week!</span></div>
              </div>
            </div>

            <a href="/" className="block text-center rounded-xl bg-purple-600 text-white px-8 py-3 font-semibold hover:bg-purple-700">
              Back to FitQR
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-cyan-50 px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
