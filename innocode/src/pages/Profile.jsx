import React from 'react';
import PageContainer from '../components/PageContainer';
import { Icon } from '@iconify/react';

export default function Profile() {
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

          {/* tabs */}
          <div className="mb-6">
            <nav className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 rounded-t-md border-b-2 border-orange-400">
                About
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-t-md">
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
            <div className="grid gap-4">
              {/* Row */}
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

              {/* Row */}
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

              {/* Row */}
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
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
