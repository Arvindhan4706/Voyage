"use client";

import { motion } from "framer-motion";
import { Settings2, Bell, Shield, CreditCard, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account preferences and security.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 space-y-2"
          >
            {[
              { icon: <Settings2 size={18} />, label: "General", active: true },
              { icon: <Bell size={18} />, label: "Notifications", active: false },
              { icon: <Shield size={18} />, label: "Privacy", active: false },
              { icon: <CreditCard size={18} />, label: "Billing", active: false },
              { icon: <Key size={18} />, label: "Security", active: false },
            ].map((tab, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  tab.active 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 md:col-span-3 space-y-8"
          >
            {/* Display Preferences */}
            <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
              <h2 className="text-xl font-bold mb-6">Display Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Language</h4>
                    <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary">
                    <option>English (US)</option>
                    <option>French (FR)</option>
                    <option>Japanese (JP)</option>
                  </select>
                </div>
                <hr className="border-border/50" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Currency</h4>
                    <p className="text-sm text-muted-foreground">Default currency for pricing.</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-primary">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 rounded-3xl border border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-bold mb-2 text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-6">Irreversible actions for your account.</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <button className="px-6 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl text-sm font-semibold transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
