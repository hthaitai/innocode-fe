import React, { useState } from 'react';
import PageContainer from "@/shared/components/PageContainer";
import TabNavigation from "@/shared/components/TabNavigation";
import { Icon } from '@iconify/react';
import { BREADCRUMBS } from '@/config/breadcrumbs';

export default function Profile() {
  const [tab, setTab] = useState('about');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Định nghĩa các tabs
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'password', label: 'Change Password' }
  ];

  return (
    <PageContainer breadcrumb={BREADCRUMBS.PROFILE}>
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: avatar + meta + tabs */}
        <div className="col-span-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-b from-orange-400 to-orange-200 shadow-md" />
            <div>
              <h2 className="text-3xl font-bold">Lộc</h2>
              <div className="text-base text-gray-600">Loc@gmail.com</div>
              <div className="text-sm text-gray-500">Judge account</div>
            </div>
          </div>

          {/* tabs as buttons */}
          <div className="mb-6">
            <TabNavigation
              tabs={tabs}
              activeTab={tab}
              onTabChange={setTab}
            />
          </div>
        </div>

        <div className="col-span-12">
          <div className="bg-white rounded-xl overflow-hidden">
            {tab === 'about' && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="mdi:account-box-outline"
                            className="h-5 w-5 text-gray-400"
                          />
                          <span className="text-base text-gray-800 font-medium">
                            Huỳnh Thiện Lộc
                          </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-orange-100 rounded-lg transition-all duration-200">
                          <Icon
                            icon="mdi:pencil"
                            className="h-5 w-5 text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="mdi:email-outline"
                            className="h-5 w-5 text-gray-400"
                          />
                          <span className="text-base text-gray-800 font-medium">
                            Loc@gmail.com
                          </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-orange-100 rounded-lg transition-all duration-200">
                          <Icon
                            icon="mdi:pencil"
                            className="h-5 w-5 text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon
                            icon="mdi:phone-outline"
                            className="h-5 w-5 text-gray-400"
                          />
                          <span className="text-base text-gray-800 font-medium">
                            0123456798
                          </span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-orange-100 rounded-lg transition-all duration-200">
                          <Icon
                            icon="mdi:pencil"
                            className="h-5 w-5 text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab === 'password' && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Security Settings
                  </h3>
                </div>
                <form className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Current Password
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center space-x-3">
                        <Icon
                          icon="mdi:lock-outline"
                          className="h-5 w-5 text-gray-400"
                        />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Enter your current password"
                          className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                        >
                          <Icon
                            icon={
                              showCurrentPassword ? 'mdi:eye-off' : 'mdi:eye'
                            }
                            className="h-5 w-5 text-gray-500 hover:text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      New Password
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center space-x-3">
                        <Icon
                          icon="mdi:lock-plus-outline"
                          className="h-5 w-5 text-gray-400"
                        />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                        >
                          <Icon
                            icon={showNewPassword ? 'mdi:eye-off' : 'mdi:eye'}
                            className="h-5 w-5 text-gray-500 hover:text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Confirm New Password
                    </label>
                    <div className="relative bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center space-x-3">
                        <Icon
                          icon="mdi:lock-check-outline"
                          className="h-5 w-5 text-gray-400"
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your new password"
                          className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                        >
                          <Icon
                            icon={
                              showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'
                            }
                            className="h-5 w-5 text-gray-500 hover:text-orange-500"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon icon="mdi:check" className="h-5 w-5" />
                        <span>Update Password</span>
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
