'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, User, ShieldAlert, UserX } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { UserWithAnalytics } from '@/lib/types';

export default function DashboardPage() {
  const { analytics, loading, fetchAnalytics } = useDashboardStore();

  useEffect(() => {
    // Fetch data only if it's not already loaded
    if (!analytics) {
      fetchAnalytics();
    }
  }, [analytics, fetchAnalytics]);

  if (loading || !analytics) {
    return <DashboardSkeleton />;
  }

  const { kpi, charts, tables } = analytics;

  const kpiData = [
    { title: "Total Users", value: kpi.totalUsers, change: "+12%", icon: Users },
    { title: "Active Users (Week)", value: kpi.activeUsers, change: "+5%", icon: User },
    { title: "Highest Irritability", value: kpi.highestIrritability.value, change: kpi.highestIrritability.user, icon: ShieldAlert },
    { title: "Least Compliant", value: kpi.leastCompliant.value, change: kpi.leastCompliant.user, icon: UserX },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#73B7BC" strokeWidth={2} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Session Completion Trends (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.sessionCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#73B7BC" name="Completed" />
                <Bar dataKey="missed" stackId="a" fill="#F87171" name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Lists */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Least Compliant Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.leastCompliantUsers.map((user: UserWithAnalytics) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell className="text-right text-red-500 font-bold">{user.analytics.complianceRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
    <div>
      <Skeleton className="h-64" />
    </div>
  </div>
);
