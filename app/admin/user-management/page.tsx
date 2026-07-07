import UserHeader from '@/app/ui/admin/user-management/user-header';
import UserFilters from '@/app/ui/admin/user-management/user-filters';
import UserList from '@/app/ui/admin/user-management/user-list';
import { getFilteredUsers } from '@/app/lib/data/users';

interface SearchParams {
  searchQuery?: string;
  status?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function UserManagementPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? "1");
  const searchQuery = params.searchQuery;
  const status = params.status;

  const { users, totalPages } = await getFilteredUsers({
    searchQuery,
    status,
    page: currentPage,
    pageSize: 10,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <UserHeader />

          <UserFilters />

          <UserList users={users} totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}
