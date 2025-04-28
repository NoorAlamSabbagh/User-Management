import { BehaviorSubject } from 'rxjs';
import { User } from '../model/Users';

const users$ = new BehaviorSubject<User[]>([]);

export const userService = {
  users$,

  fetchUsers: async () => {
    const response = await fetch('https://excelerate-profile-dev.s3.ap-south-1.amazonaws.com/1681980949109_users.json');
    const data: User[] = await response.json();
    users$.next(data);
  },

  updateUser: (id: string, updatedUser: Partial<User>) => {
    const currentUsers = users$.getValue();
    const updated = currentUsers.map(user => user.id === id ? { ...user, ...updatedUser } : user);
    users$.next(updated);
  },

  deleteUser: (id: string) => {
    const currentUsers = users$.getValue();
    users$.next(currentUsers.filter(user => user.id !== id));
  },

  deleteSelected: () => {
    const currentUsers = users$.getValue();
    users$.next(currentUsers.filter(user => !user.isSelected));
  },

  toggleSelect: (id: string) => {
    const currentUsers = users$.getValue();
    const updated = currentUsers.map(user => user.id === id ? { ...user, isSelected: !user.isSelected } : user);
    users$.next(updated);
  },

  toggleSelectAll: (ids: string[], selectAll: boolean) => {
    const currentUsers = users$.getValue();
    const updated = currentUsers.map(user =>
      ids.includes(user.id) ? { ...user, isSelected: selectAll } : user
    );
    users$.next(updated);
  },
};
