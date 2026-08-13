import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-50 to-indigo-200 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="mt-2 text-sm text-slate-450">
                Authorized administrative functions and platform metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: User Profile Details */}
          <div className="bg-slate-800/20 border border-slate-850 p-6 rounded-3xl backdrop-blur-sm">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-800/80 pb-4 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-400" />
              <span>Session Metadata</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-450">Admin Name</span>
                <span className="font-semibold text-slate-250">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Email Address</span>
                <span className="font-semibold text-slate-250">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Assigned Role</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-600/15 text-indigo-400 border border-indigo-500/10 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Environment Health */}
          <div className="bg-slate-800/20 border border-slate-850 p-6 rounded-3xl backdrop-blur-sm">
            <h3 className="text-base font-bold text-slate-200 border-b border-slate-800/80 pb-4 mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-400" />
              <span>Platform Health</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-450">API Base URI</span>
                <span className="font-mono text-xs text-purple-300">http://localhost:5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">DB Driver</span>
                <span className="font-semibold text-slate-250">better-sqlite3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Auth Strategy</span>
                <span className="font-semibold text-slate-250">JWT (24h Expiry)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Banner */}
        <div className="mt-8 flex items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/15 rounded-3xl">
          <ShieldAlert className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-250">Privileged Session</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              You are currently logged in with administrative clearances. All SQL transactions executed via administrative requests are attached to token headers and audited by Express backend guards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
