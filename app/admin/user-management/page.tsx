import UserHeader from '@/app/ui/admin/user-management/user-header';
import UserList from '@/app/ui/admin/user-management/user-list';
import { getAllUsers } from '@/app/lib/data/users';

export default async function UserManagementPage() {
  const users = await getAllUsers();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <UserHeader />

        <UserList users={users} />
      </div>
    </div>
  );
}
