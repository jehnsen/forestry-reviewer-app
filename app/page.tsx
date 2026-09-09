import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Sparkles,
  TrendingUp,
  Smartphone,
  Clock,
  Target,
  TreePine,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Board Exam Review</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Still Waiting to Sign as{" "}
              <span className="text-green-700">Forester? Pass This Board.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Stop paying for review centers in Manila. Get unlimited access to
              AI-powered Forester Licensure Exam prep for just ₱399 — less than the
              fare to a single review session.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Reviewing Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>1,240 registered foresters since 2023</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Aligned with the PRC syllabus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why ForestGuro Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for forestry graduates juggling fieldwork, LGU duties, and thesis
              defense — without the cost of a Manila review center.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-green-700" />
                </div>
                <CardTitle>AI Forestry Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Stuck on a volume equation or a provision of PD 705? Get instant
                  explanations and ask follow-ups until the concept holds — like a
                  professor available at 2 AM.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="w-6 h-6 text-emerald-700" />
                </div>
                <CardTitle>Six-Subject Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Silviculture, mensuration, forest management, engineering, wood
                  science, and forest policy. We find your weakest board subject and
                  drill it until it is your strongest.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-amber-700" />
                </div>
                <CardTitle>Review From the Field</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Works offline-friendly on your phone, so you can review between plot
                  measurements or on the long ride back from the reforestation site. No
                  heavy textbooks in your field pack.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Stop Overpaying for Board Review
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get better results for a fraction of the cost.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="bordered" className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold">
                  OLD WAY
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Traditional Board Review Center</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mt-4">₱5,000+</div>
                <p className="text-sm text-slate-500">One-time fee</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>Fixed weekend schedule — conflicts with field duty</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>Requires relocating to Manila, Los Baños, or Cebu</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>Little time to ask about difficult computations</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>One pace for the whole batch</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated" className="relative overflow-hidden border-2 border-green-700 shadow-xl">
              <div className="absolute top-4 right-4">
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  RECOMMENDED
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">ForestGuro Board Pass</CardTitle>
                <div className="text-5xl font-bold text-green-700 mt-4">₱399</div>
                <p className="text-sm text-slate-500">Valid until board exam day + 6 months</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Review anytime — field season or not</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>AI forestry tutor available instantly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited practice across all four board papers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Personalized study plan by weak subject</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-green-700">
                      Pass the board or get your money back
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full" size="lg">
                      Get Board Pass Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Sign Your Name as a Forester?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join the forestry graduates who earned their PRC license with ForestGuro.
            Start today and review at your own pace, wherever your assignment takes you.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-green-700 hover:bg-slate-100"
            >
              Start Your Free Trial
            </Button>
          </Link>
          <p className="text-sm text-green-200 mt-4">
            No credit card required • Cancel anytime • Money-back guarantee
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
