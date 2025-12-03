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
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "../../components/ThemeToggle";

function AppHeader() {
  return (
    <div className="p-3 shadow-sm flex justify-between items-center bg-white dark:bg-black">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo"
          width={180}
          height={200}
          className="dark:invert dark:hue-rotate-180"
        />
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default AppHeader;
