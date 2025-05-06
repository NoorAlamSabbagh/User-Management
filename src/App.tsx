import { useEffect } from "react";
import UserTable from "./components/UserTable";
import { useAppDispatch } from "./store/hooks";
import { fetchUsers } from "./store/userSlice";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return <UserTable />;
};

export default App;
