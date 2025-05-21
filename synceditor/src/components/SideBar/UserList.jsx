import { memo } from 'react';
import { User } from 'lucide-react';

const UserList = memo(({ users }) => (
  <div className="p-4 space-y-2 overflow-auto max-h-[calc(100vh-250px)]">
    {users.length === 0 ? (
      <div className="text-gray-400 text-sm text-center italic">
        No users connected
      </div>
    ) : (
      users.map((user) => (
        <div
          key={user.socketId}
          className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-lg text-sm group hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <User size={14} className="text-gray-400" />
            <span className="text-blue-300 font-medium">{user.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      ))
    )}
  </div>
));

UserList.displayName = 'UserList';
export default UserList;
