import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [data, setData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [npm, setNpm] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNpm, setSelectedNpm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleAddOrUpdate = async () => {
    const url = isEditMode ? `http://localhost:5000/api/students/${selectedNpm}` : 'http://localhost:5000/api/students';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          npm,
          kelas: studentClass,
          nama: name
        })
      });

      if (response.ok) {
        setNotification({
          type: 'success',
          message: isEditMode ? 'Data berhasil diperbarui!' : 'Data berhasil ditambahkan!'
        });
        fetchData(); // Refresh data
        closeModal();
      } else {
        const error = await response.json();
        setNotification({
          type: 'error',
          message: error.message || (isEditMode ? 'Gagal memperbarui data' : 'Gagal menambahkan data')
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan, silakan coba lagi'
      });
    }
  };

  const handleDelete = async (npm) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${npm}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Data berhasil dihapus!'
        });
        fetchData(); // Refresh data after deleting
      } else {
        const error = await response.json();
        setNotification({
          type: 'error',
          message: error.message || 'Gagal menghapus data'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan, silakan coba lagi'
      });
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setNpm(student.npm);
      setName(student.nama);
      setStudentClass(student.kelas);
      setIsEditMode(true);
      setSelectedNpm(student.npm);
    } else {
      setNpm('');
      setName('');
      setStudentClass('');
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNpm('');
    setName('');
    setStudentClass('');
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">My Application</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Data Table</h2>
          <button
            onClick={() => openModal()}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Data
          </button>
          {notification && (
            <div className={`p-2 mb-4 text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              {notification.message}
            </div>
          )}
          <table className="w-full bg-white shadow-md rounded overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">NPM</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.npm} className="border-b">
                  <td className="px-4 py-2">{item.npm}</td>
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.kelas}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => openModal(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.npm)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Data' : 'Tambah Data'}</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">NPM</label>
                <input
                  type="text"
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  disabled={isEditMode}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Class</label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleAddOrUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditMode ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">&copy; 2024 My Application. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
