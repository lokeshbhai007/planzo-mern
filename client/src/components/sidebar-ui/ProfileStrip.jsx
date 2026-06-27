import { UserButton } from "@clerk/react";

function ProfileStrip() {
  return (
    <div className="
      flex items-center justify-center gap-3 px-3 py-3 rounded-xl
      border border-gray-200 dark:border-gray-700
      bg-gray-50 dark:bg-gray-800
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition-colors duration-200 cursor-pointer
    ">
      <UserButton />
      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
        Profile
      </span>
    </div>
  );
}

export default ProfileStrip