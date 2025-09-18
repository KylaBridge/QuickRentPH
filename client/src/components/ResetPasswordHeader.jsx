import React from "react";

const ResetPasswordHeader = () => {
  return (
    <header className="w-full bg-[#6C4BF4] px-5 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
            {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/quickRentLogo.svg"
              alt="Quick Rent Logo"
              className="w-8 h-8"
            />
            <span className="text-white text-xl font-semibold font-poppins">
              Quick Rent
            </span>
          </div>
        <span className="text-xl font-normal text-white ml-2">Reset Password</span>
      </div>
    </header>
  );
};

export default ResetPasswordHeader;
