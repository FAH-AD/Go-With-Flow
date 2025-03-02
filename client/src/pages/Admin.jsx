import React, { useEffect, useState } from 'react';
import { deleteUser, get, post } from '../services/ApiEndpoint'; // Import the `post` function
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get('/api/admin/getuser');
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delet/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== id));
        setShowDeleteModal(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message || !subject) {
      toast.error('Please fill in both the subject and message.');
      return;
    }

    try {
      const request = await post('/api/admin/send-email', {
        email: selectedUser.email,
        subject: subject,
        message: message,
      });

      if (request.status === 200) {
        toast.success(request.data.message); // Success message from backend
        setShowMessageModal(false);
        setMessage('');
        setSubject('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send the message.');
      }
    }
  };

  return (
    <>
      <Navbar isLogged={true} showFullNav={true} role="admin" />

      <div className="min-h-screen bg-black text-white p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
        <table className="w-full bg-white text-black rounded-md shadow-md overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 space-x-4">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowMessageModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete {selectedUser?.name}?</p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-md shadow-lg">
            <h3 className="text-xl font-bold mb-4">Send Message</h3>
            <p>
              Send a message to {selectedUser?.name} ({selectedUser?.email})
            </p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 p-4 mt-4 rounded-md"
              placeholder="Subject"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 p-4 mt-4 rounded-md"
              placeholder="Type your message here..."
              rows="5"
            ></textarea>
            <div className="mt-6 space-x-4">
              <button
               
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
