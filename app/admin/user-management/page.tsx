import UserHeader from '@/app/ui/admin/user-management/user-header';
import UserStats from '@/app/ui/admin/user-management/user-stats';
import UserList from '@/app/ui/admin/user-management/user-list';
import { getAllUsers } from '@/app/lib/data/users';

export default async function UserManagementPage() {
  const users = await getAllUsers();
  const activeThisWeek = users.filter((user) => user.last_study_date && new Date(user.last_study_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const newThisMonth = users.filter((user) => new Date(user.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <UserHeader />

        <UserStats
          total={users.length}
          activeThisWeek={activeThisWeek}
          newThisMonth={newThisMonth}
        />

        <UserList users={users} />
      </div>
    </div>
  );
}
