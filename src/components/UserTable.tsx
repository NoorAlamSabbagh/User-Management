import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, editUser, deleteUser, deleteMultipleUsers, deleteSelected } from '../store/userSlice';
import '../App.css';
import { TbEdit } from 'react-icons/tb';
import { FiTrash } from 'react-icons/fi';

const ITEMS_PER_PAGE = 10;

const UserTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '' });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
  
    const name = user.name?.toString().toLowerCase() || '';
    const email = user.email?.toString().toLowerCase() || '';
    const role = user.role?.toString().toLowerCase() || '';
  
    return name.includes(term) || email.includes(term) || role.includes(term);
  });
  

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEditClick = (user: any) => {
    setEditRowId(user.id);
    setEditedUser({ name: user.name, email: user.email, role: user.role });
  };

  const handleSaveClick = () => {
    if (editedUser.name?.length < 3 || editedUser.email?.length < 3 || editedUser.role?.length < 3) {
      alert('Name, Email and Role must be at least 3 characters long.');
      return;
    }
    if (editRowId) {
      dispatch(editUser({ id: editRowId, ...editedUser }));
    }
    setEditRowId(null);
  };


  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
    setSelectedRows((prev) => prev.filter((userId) => userId !== id));
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedUsers.map((user) => user.id);
    const allSelected = currentPageIds.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleDeleteSelected = () => {
    dispatch(deleteMultipleUsers(selectedRows));
    setSelectedRows([]);
  };

  const renderPagination = () => (
    <div className="pagination">
      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        «
      </button>
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? 'active' : ''}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
        ›
      </button>
      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
        »
      </button>
    </div>
  );

  return (
    <div className="table-container">
      <input
        type="text"
        placeholder="Search by name, email or role"
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={paginatedUsers.every((user) => selectedRows.includes(user.id))}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="no-data">No data found</td>
            </tr>
          ) : (
            paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editRowId === user.id ? (
                    <input
                      value={editedUser.role}
                      onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editRowId === user.id ? (
                    <>
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={() => handleEditClick(false)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(user)}><TbEdit /></button>
                      <button onClick={() => handleDelete(user.id)}><FiTrash color="red" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="footer-controls">
        <button onClick={handleDeleteSelected} className="delete-selected">
          Delete Selected
        </button>
        {renderPagination()}
      </div>
    </div>
  );
};

export default UserTable;
