"use client";
import { data } from "./dummy";
import { useState } from "react";

interface TypeSelect {
  type: string;
  name: string;
}

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
    </div>
  );
}
