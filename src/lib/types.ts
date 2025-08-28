
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   plan: string; // e.g., "FAI Post Op"
//   status: 'Active' | 'Inactive';
//   startDate: string;
//   lastLogin: string;
//   compliance: number; // Percentage
//   irritability: number; // 0-10 scale
// }


export interface User {
  _id: string;
  username: string;
  email: string;
  status: 'Active' | 'Inactive';
  plan: string; // This would be populated from RehabPlan name
  startDate: string;
  lastLogin: string;
}

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  videoUrl: string;
  reps: string;
  sets: string;
  category: string;
  tags: string[];
}

export interface RehabPlan {
    _id: string;
    name: string;
    type: 'Paid' | 'Free';
    durationWeeks: number;
}

export interface Notification {
    _id: string;
    title: string;
    body: string;
    targetGroup: 'All' | 'Selected';
    status: 'Sent' | 'Scheduled';
    sentTime?: string;
}

export interface ContentPage {
  _id: string;
  title: string;
  slug: string;
  contentHtml: string;
  updatedAt: string;
}


// Types for API responses and Zustand stores
export interface UserWithAnalytics extends User {
  analytics: {
      complianceRate: number;
      averageIrritability: number;
  }
}

export interface DashboardAnalytics {
  kpi: {
    totalUsers: number;
    activeUsers: number;
    highestIrritability: { value: string; user: string };
    leastCompliant: { value: string; user: string };
  };
  charts: {
    userGrowth: { month: string; users: number }[];
    sessionCompletion: { day: string; completed: number; missed: number }[];
  };
  tables: {
    leastCompliantUsers: User[]; // Simplified for the table
  };
}

// Zustand State & Actions
export interface UserState {
  users: UserWithAnalytics[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  // Add addUser, updateUser, etc. later
}

export interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  fetchExercises: () => Promise<void>;
}

export interface RehabPlanState {
  plans: RehabPlan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  sendNotification: (notification: Omit<Notification, '_id' | 'status' | 'sentTime'>) => Promise<void>;
}

export interface ContentState {
  pages: ContentPage[];
  loading: boolean;
  error: string | null;
  fetchPages: () => Promise<void>;
  updatePage: (slug: string, content: string) => Promise<void>;
}

export interface DashboardState {
  analytics: DashboardAnalytics | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}