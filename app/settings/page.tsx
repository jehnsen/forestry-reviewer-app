import DashboardLayout from "@/components/layout/dashboard-layout";
import ProfileForm from "@/components/settings/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Bell, CreditCard, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">
            Manage your account preferences and subscription.
          </p>
        </div>

        <ProfileForm />

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Daily Study Reminder</p>
                <p className="text-sm text-slate-600">Get reminded to practice every day</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Weekly Progress Report</p>
                <p className="text-sm text-slate-600">Receive your weekly analytics summary</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Board Exam Countdown</p>
                <p className="text-sm text-slate-600">Get notified as board exam day approaches</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-slate-700" />
              <CardTitle>Subscription</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-900">Board Pass</p>
                <span className="text-sm font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-600">Valid until December 31, 2026</p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-slate-700" />
              <CardTitle>Account Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <div className="pt-4 border-t border-slate-200">
              <Button variant="ghost" className="text-rose-600 hover:bg-rose-50">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
