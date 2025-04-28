import React, { useState } from 'react';
import { User } from '../../model/Users';
import { userService } from '../../services/userService';
import { TbEdit } from 'react-icons/tb';
import { FiTrash } from 'react-icons/fi';

interface Props {
    user: User;
}

const TableRow: React.FC<Props> = ({ user }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: user.name, email: user.email, role: user.role });

    const saveChanges = () => {
        userService.updateUser(user.id, formData);
        setEditMode(false);
    };

    return (
        <tr>
            <td><input type="checkbox" checked={user.isSelected || false} onChange={() => userService.toggleSelect(user.id)} /></td>

            {editMode ? (
                <>
                    <td><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></td>
                    <td><input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></td>
                    <td><input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} /></td>
                </>
            ) : (
                <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                </>
            )}

            <td style={{ textAlign: "center" }}>
                {editMode ? (
                    <>
                        <button onClick={saveChanges}>Save</button>
                        <button onClick={() => setEditMode(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditMode(true)} style={{ marginRight: "16px" }}><TbEdit /></button>
                        <button onClick={() => userService.deleteUser(user.id)}><FiTrash color="red" /></button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default TableRow;
