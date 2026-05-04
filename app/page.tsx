"use client";
import { data } from "./dummy";
import { useState, useEffect } from "react";
import axios from "axios";
import { groupBy } from "./utils";
import { TypeSelect, User } from "./interface";

export default function Home() {
  const [dataList, setDataList] = useState<TypeSelect[]>(data);
  const [fruits, setFruits] = useState<TypeSelect[]>([]);
  const [vegetable, setVegetable] = useState<TypeSelect[]>([]);
  const [isFruitTurn, setIsFruitTurn] = useState(true);

  const selectData = (items: TypeSelect) => {
    if (items.type.toLowerCase() === "fruit") {
      setFruits([...fruits, items]);
      setDataList(dataList.filter((item) => item.name !== items.name));
    } else if (items.type.toLowerCase() === "vegetable") {
      setVegetable([...vegetable, items]);
      setDataList(dataList.filter((item) => item.name !== items.name));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isFruitTurn) {
      setFruits((prev) => {
        if (!prev.length) return prev;

        const removed = prev[0];

        setDataList((dataList) =>
          dataList.filter((item) => item.name !== removed.name).concat(removed),
        );

        return prev.slice(1);
      });
    } else {
      setVegetable((prev) => {
        if (!prev.length) return prev;

        const removed = prev[0];

        setDataList((dataList) =>
          dataList.filter((item) => item.name !== removed.name).concat(removed),
        );

        return prev.slice(1);
      });
    }

    setIsFruitTurn((prev) => !prev);
  };

  const [groupedUsers, setGroupedUsers] = useState<Record<string, User[]>>({});

  // ✅ API call inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<{ users: User[] }>(
          "https://dummyjson.com/users",
        );

        const grouped = groupBy<User, string>(
          res.data.users,
          (user) => user.company?.department || "unknown",
        );

        setGroupedUsers(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="flex flex-col flex-1 items-center justify-center bg-white font-sans"
      onContextMenu={handleRightClick}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded flex flex-col">
          {dataList.map((item, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2 m-2"
              onClick={() => selectData(item)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="border rounded flex flex-col">
          <div className="bg-gray-300 text-white text-center font-bold p-3">
            Fruits
          </div>
          {fruits && fruits.length
            ? fruits.map((item, index) => (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2 m-2"
                >
                  {item.name}
                </button>
              ))
            : null}
        </div>
        <div className="border rounded flex flex-col">
          <div className="bg-gray-300 text-white text-center font-bold p-3">
            Vegetables
          </div>
          {vegetable && vegetable.length
            ? vegetable.map((item, index) => (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2 m-2"
                >
                  {item.name}
                </button>
              ))
            : null}
        </div>
      </div>

      {/*  SHOW GROUPED USERS */}
      <div className="mt-10 w-full">
        <h2 className="font-bold mb-4 text-black p-4">Users by Department</h2>
        <div className="grid grid-cols-3 gap-4 p-4">
          {Object.entries(groupedUsers).map(([dept, users]) => (
            <div key={dept} className="mb-4">
              <h3 className="font-semibold text-black">{dept}</h3>
              <ul>
                {users.slice(0, 3).map((u) => (
                  <li key={u.id} className="text-black">
                    {u.firstName} {u.lastName}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
