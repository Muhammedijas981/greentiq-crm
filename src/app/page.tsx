import StatCard from "@/components/customers/stat-card";
import { Users, Rocket, Phone } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total Customers"
          value="14,782"
          trend="+3.2%"
          trendUp={true}
          icon={<Users size={20} />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatCard 
          title="Active Leads"
          value="3,105"
          trend="+5.8%"
          trendUp={true}
          icon={<Rocket size={20} />}
          iconBg="bg-orange-500/10"
          iconColor="text-orange-500"
        />
        <StatCard 
          title="Contacted This Week"
          value="947"
          trend="-1.5%"
          trendUp={false}
          icon={<Phone size={20} />}
          iconBg="bg-pink-500/10"
          iconColor="text-pink-500"
        />
      </div>
    </div>
  );
}
