import React from "react";
import Search from "./Search";
import Users from "./Users";

function Left() {
  return (
    <div className="w-[30%] bg-black text-gray-300">
      <div className="flex items-center space-x-2 p-4">
        <div className="w-12 rounded-full">
          <img src="/logo.png" alt="Logo" />
        </div>
        <span className="text-xl font-semibold text-purple-500">Connectly</span>
      </div>
      
      <Search />
      
      <div
        className="flex-1 overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
    </div>
  );
}

export default Left;
