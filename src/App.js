import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, {
      name: name,
      age: Number(age),
      country: country,
    });
  };

  const updateAge = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, [users]);
  
  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age"
          onChange={(e) => {
            setAge(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Country"
          onChange={(e) => {
            setCountry(e.target.value);
          }}
        />
        <button onClick={createUser}>Create user</button>
      </div>

      <h1>Users: </h1>
      <hr />
      {users.map((user, i) => {
        return (
          <div key={i}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Country: {user.country}</p>
            <button
              onClick={() => {
                updateAge(user.id, user.age);
              }}
              className="border-2 border-cyan-600 rounded-md px-1 py-0.5 mr-2"
            >
              Update Age
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
              className="border-2 border-cyan-600 rounded-md px-1 py-0.5"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
