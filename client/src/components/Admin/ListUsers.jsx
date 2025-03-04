import React, { useEffect, useState } from 'react';
import { Axios } from '../../utils/Axiox';

const ListUsers = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await Axios.get('/admin/ListUsers');
        setUserList(data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
      {userList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userList.map((user) => (
            <div key={user._id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
              <img src={user.profilePic} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border" />
              <h2 className="text-lg font-semibold mt-2">{user.fullName}</h2>
              <p className="text-gray-700">📍 {user.locationName}</p>
              <a
                href={`mailto:${user.email}`}
                className="mt-2 text-blue-600 hover:underline"
              >
                {user.email}
              </a>
              <p className="text-sm text-gray-500 mt-1">Joined on: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-gray-700">No Users Found</h2>
        </div>
      )}
    </div>
  );
};

export default ListUsers;