import { useEffect, useState } from "react";
import api from "../../services/api";

function ChatSidebar({ onSelectChat }) {

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);


  useEffect(() => {

    if (query.trim().length < 2) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {

      try {

        const response = await api.get(
          `/users/search?query=${query}`
        );

        setUsers(response.data.users);

      } catch (error) {

        console.error(error);

      }

    };

    searchUsers();

  }, [query]);


  const openChat = async (userId) => {

    try {

      const response = await api.post(
        "/chats",
        { userId }
      );

      onSelectChat(response.data.chat);

    } catch (error) {

      console.error(error);

    }

  };


  return (
    <div className="w-[300px] border-r p-4">

      <h2 className="text-xl font-bold mb-4">
        Chats
      </h2>


      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full rounded"
      />


      <div className="mt-4">

        {users.map((user) => (

          <div
            key={user._id}
            onClick={() => openChat(user._id)}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
          >

            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ChatSidebar;