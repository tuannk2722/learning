import UserHeader from '@/app/ui/admin/user-management/user-header';
import UserStats from '@/app/ui/admin/user-management/user-stats';
import UserList from '@/app/ui/admin/user-management/user-list';

export default async function UserManagementPage() {
  // MOCK DATA (Sau này fetch từ DB)
  const users = [
    {
      id: 1,
      name: 'Alex Chen',
      email: 'alex@email.com',
      level: 18,
      xp: 5240,
      streak: 45,
      enrolled: 8,
      completed: 5,
      joinDate: '2026-01-15',
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      level: 17,
      xp: 4980,
      streak: 32,
      enrolled: 6,
      completed: 4,
      joinDate: '2026-02-03',
      lastActive: '5 minutes ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Michael Kim',
      email: 'michael@email.com',
      level: 16,
      xp: 4560,
      streak: 28,
      enrolled: 7,
      completed: 6,
      joinDate: '2026-01-20',
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@email.com',
      level: 15,
      xp: 4120,
      streak: 0,
      enrolled: 5,
      completed: 2,
      joinDate: '2026-03-10',
      lastActive: '1 week ago',
      status: 'inactive'
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <UserHeader />
        
        <UserStats 
          total="12,458" 
          activeThisWeek="8,234" 
          newThisMonth="1,456" 
        />

        <UserList users={users} />
      </div>
    </div>
  );
}
