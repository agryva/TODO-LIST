'use client';

import React from "react";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from '@/stores/auth.store';
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

const Header = () => {
    const router = useRouter()
    const { logout, user } = useAuthStore();

    const logoutAction = () => {
        logout();
        deleteCookie('token')
        router.replace('/')
    }

    return (
        <header className="antialiased">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 light:bg-gray-800">
                <div className="flex justify-between items-center">
                    <a href="/" className="flex items-center">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap light:text-white">
                            Todo List APP
                        </span>
                    </a>

                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            className="flex text-sm items-center gap-3 rounded-full focus:ring-4 focus:ring-gray-300 light:focus:ring-gray-600"
                            id="user-menu-button"
                            aria-expanded="false"
                        >
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                alt="user avatar"
                            />
                            <span className="text-lg font-medium text-gray-800 light:text-gray-200">
                                {user?.name}
                            </span>
                        </button>
                        <button
                            type="button"
                            className="text-gray-800 hover:text-gray-600 light:text-gray-200 light:hover:text-gray-400"
                            aria-label="Logout"
                            onClick={logoutAction}
                        >
                            <FiLogOut size={24} />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;