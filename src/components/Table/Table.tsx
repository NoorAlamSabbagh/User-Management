import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../model/Users';
import { Subscription } from 'rxjs';
import TableRow from './TableRow';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import './../styles/Table.css';

const Table: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const rowsPerPage = 10;

  useEffect(() => {
    const sub: Subscription = userService.users$.subscribe(setUsers);
    userService.fetchUsers();
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const result = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const selectAll = paginatedUsers.every(user => user.isSelected);
  
  const handleSelectAll = () => {
    const ids = paginatedUsers.map(user => user.id);
    userService.toggleSelectAll(ids, !selectAll);
  };

  return (
    <div className="table-container">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <table className="user-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <TableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>

      <div className="table-bottom">
        <button onClick={userService.deleteSelected}>Delete Selected</button>
        <Pagination
          total={filteredUsers.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
};

export default Table;
