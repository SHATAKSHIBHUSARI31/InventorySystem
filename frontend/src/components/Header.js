import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AuthContext from "../AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorageData?.role;

  // Navigation based on role
  const baseNavigation = [
    { name: "Dashboard", href: "/", roles: ["Admin", "Lab Technician", "Researcher", "Manufacturing Engineer"] },
    { name: "Inventory", href: "/inventory", roles: ["Admin", "Lab Technician", "Researcher", "Manufacturing Engineer"] },
    { name: "Purchase Details", href: "/purchase-details", roles: ["Admin", "Lab Technician"] },
    { name: "Sales", href: "/sales", roles: ["Admin", "Lab Technician", "Manufacturing Engineer"] },
    { name: "Manage Store", href: "/manage-store", roles: ["Admin"] },
    { name: "Manage Users", href: "/manage-users", roles: ["Admin"] }, // Admin only
  ];

  const navigation = baseNavigation.filter((item) => item.roles.includes(userRole));
  const userNavigation = [{ name: "Sign out", href: "./login" }];

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center">
                  <img className="h-8 w-8" src={require("../assets/logo.png")} alt="Logo" />
                  <span className="ml-2 text-white font-bold italic text-sm sm:text-lg">
                    Inventory Management
                  </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* User Section */}
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-white text-sm font-medium">
                    {localStorageData?.firstName} ({userRole})
                  </span>

                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex items-center text-sm focus:outline-none">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={localStorageData?.imageUrl || "/default-profile.png"}
                          alt="User"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={() => authContext.signout()}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile menu toggle */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <Disclosure.Button
                      as="span"
                      className={classNames(
                        "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 pb-3 px-5">
                <div className="flex items-center space-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={localStorageData?.imageUrl || "/default-profile.png"}
                    alt="User"
                  />
                  <div>
                    <div className="text-white text-sm font-medium">
                      {localStorageData?.firstName + " " + localStorageData?.lastName}
                    </div>
                    <div className="text-gray-400 text-xs">{localStorageData?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="button"
                      className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 text-base font-medium"
                      onClick={() => authContext.signout()}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
