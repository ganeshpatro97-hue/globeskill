export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <main className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to GlobeSkill
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A Next.js application with Vercel Speed Insights configured
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="font-semibold text-green-900 mb-2">
                ✅ Vercel Speed Insights Configured
              </h2>
              <p className="text-green-700 text-sm">
                Speed Insights is now tracking performance metrics for your application.
                Deploy to Vercel to see real-time analytics in your dashboard.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">
                🚀 Next Steps
              </h2>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Deploy your application to Vercel</li>
                <li>• Visit your Vercel dashboard to view Speed Insights</li>
                <li>• Monitor Core Web Vitals and performance metrics</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
