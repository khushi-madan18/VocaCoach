// import { UserButton } from '@stackframe/stack'
// import Image from 'next/image'
// import React from 'react'

// function AppHeader() {
//   return (
//     <div className='p-3 shadow-sm flex justify-between items-center'>
//       <Image src = {'/logo.svg'} alt = 'logo'
//       width={180}
//       height={200}
//       />
//     <UserButton />
//     </div>
//   )
// }

// export default AppHeader

"use client";

import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import React from "react";
import ThemeToggle from "./ThemeToggle";

function AppHeader() {
  return (
    <div className="p-3 shadow-sm flex justify-between items-center bg-white dark:bg-black">
      <Image
        src="/logo.svg"
        alt="logo"
        width={180}
        height={200}
      />

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default AppHeader;
