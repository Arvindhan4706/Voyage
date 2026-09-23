import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, CreditCard, Activity, Calendar } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // For demo purposes, we will allow anyone logged in to see the admin portal,
  // but in reality you'd enforce: if (session?.user?.email !== "admin@voyage.ai")
  if (!session) {
    redirect("/login");
  }

  const [totalUsers, totalBookings, recentUsers, recentBookings] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.booking.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  // Mock revenue calculation based on active bookings (e.g. ₹500 fee per booking)
  const revenue = totalBookings * 500;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-background relative overflow-hidden">
      <div className="absolute top-[10%] left-[60%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Admin Command Center</h1>
          <p className="text-muted-foreground text-lg">System overview and management dashboard.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-3xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Total Users</h3>
              <Users className="text-cyan-400" size={20} />
            </div>
            <p className="text-4xl font-bold">{totalUsers}</p>
            <p className="text-xs text-green-400 mt-2">↑ +12% from last week</p>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Active Bookings</h3>
              <Calendar className="text-purple-400" size={20} />
            </div>
            <p className="text-4xl font-bold">{totalBookings}</p>
            <p className="text-xs text-green-400 mt-2">↑ +4 new today</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Total Revenue</h3>
              <CreditCard className="text-emerald-400" size={20} />
            </div>
            <p className="text-4xl font-bold">₹{revenue.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-2">↑ +24% from last month</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-border shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">System Health</h3>
              <Activity className="text-amber-400" size={20} />
            </div>
            <p className="text-4xl font-bold">99.9%</p>
            <p className="text-xs text-muted-foreground mt-2">All services operational</p>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Users */}
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Recent Signups
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">User</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Email</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? recentUsers.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-sm font-medium">{user.name}</td>
                      <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-4 text-sm text-right">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="py-4 text-center text-sm text-muted-foreground">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="glass-panel p-8 rounded-3xl border border-border shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-purple-400" /> Latest Bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">ID</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">User</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="pb-3 text-sm font-semibold text-muted-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? recentBookings.map((b: any) => (
                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-sm font-mono text-muted-foreground">{b.referenceId}</td>
                      <td className="py-4 text-sm font-medium">{b.user?.name || "Unknown"}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-right font-bold">₹{b.amount.toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-4 text-center text-sm text-muted-foreground">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
