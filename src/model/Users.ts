export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSelected?: boolean;
  isEditing?: boolean;
}
