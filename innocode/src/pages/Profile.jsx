import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import { Icon } from "@iconify/react";

export default function Profile() {
  const [tab, setTab] = useState("about");

  return (
    <PageContainer title="Profile">
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: avatar + meta + tabs */}
        <div className="col-span-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-orange-400 to-orange-200 shadow-md" />
            <div>
              <h2 className="text-2xl font-bold">Lộc</h2>
              <div className="text-sm text-gray-600">Loc@gmail.com</div>
              <div className="text-sm text-gray-500">Judge account</div>
            </div>
          </div>

          {/* tabs as buttons */}
          <div className="mb-6">
            <nav className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-md font-medium transition
                  ${
                    tab === "about"
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-400 shadow"
                      : "hover:bg-gray-100"
                  }
                `}
                onClick={() => setTab("about")}
              >
                About
              </button>
              <button
                className={`px-4 py-2 rounded-md font-medium transition
                  ${
                    tab === "password"
                      ? "bg-orange-100 text-orange-600 border-l-4 border-orange-400 shadow"
                      : "hover:bg-gray-100"
                  }
                `}
                onClick={() => setTab("password")}
              >
                Change Password
              </button>
            </nav>
          </div>
        </div>

        {/* Content area - two columns */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-md p-8 border shadow-sm border-gray-200">
          <h3 className="text-3xl ml-[100px] mt-12 font-bold mb-8 text-wrap">
            <p>User</p> Information
          </h3>
          {/* placeholder content on the left */}
        </div>

        <div className="col-span-12 lg:col-span-7 ">
          <div className="bg-white border border-gray-200 p-6 rounded-md shadow-sm">
            {tab === "about" && (
              <div className="grid gap-4">
                {/* About content here */}
                {/* ...existing About rows... */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-1 border border-gray-200 shadow-sm rounded-lg p-4 text-xl text-center">
                    Full Name
                  </div>
                  <div className="col-span-2 shadow-sm border border-gray-200 rounded-lg p-4 text-xl flex items-center justify-between">
                    <span>Huỳnh Thiện Lộc</span>
                    <button className="ml-4 p-1 hover-button">
                      <Icon icon="mdi:pencil" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-1 shadow-sm border border-gray-200 rounded-lg p-4 text-xl text-center">
                    Email
                  </div>
                  <div className="col-span-2 shadow-sm border border-gray-200 rounded-lg p-4 text-xl flex items-center justify-between">
                    <span>Loc@gmail.com</span>
                    <button className="ml-4 p-1 hover-button">
                      <Icon icon="mdi:pencil" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-1 shadow-sm border border-gray-200 rounded-lg p-4 text-xl text-center">
                    Phone Number
                  </div>
                  <div className="col-span-2 shadow-sm border border-gray-200 rounded-lg p-4 text-xl flex items-center justify-between">
                    <span>0123456798</span>
                    <button className="ml-4 p-1 hover-button">
                      <Icon icon="mdi:pencil" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab === "password" && (
              <div>
                {/* Change Password content here */}
                <form className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  >
                    Save
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
