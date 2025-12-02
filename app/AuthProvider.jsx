// "use client"
// import { api } from '@/convex/_generated/api';
// import { useUser } from '@stackframe/stack'
// import { useMutation } from 'convex/react';
// import React, { useEffect, useState } from 'react'
// import { UserContext } from './_context/UserContext';

// function AuthProvider({children}) {

//     const user = useUser();
//     const CreateUser = useMutation(api.users.CreateUser);
//     const [userData, setUserData] = useState()
//     const CreateNewUser = async ()=>{
//         const result = await CreateUser({
//             name:user.displayName,
//             email:user.primaryEmail
//         });
//         console.log(result);
//         setUserData(result)
//     }
//     useEffect(()=>{
//         console.log(user)
//         user && CreateNewUser()
//     },[user])
    
    
   
//   return (
//     <div>
//         <UserContext.Provider value={{userData,setUserData}}>
//         {children}
//         </UserContext.Provider>
        
//     </div>
//   )
// }

// export default AuthProvider

"use client";

import { api } from '@/convex/_generated/api';
import { useUser } from '@stackframe/stack';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { UserContext } from './_context/UserContext';

function AuthProvider({ children }) {
  const user = useUser();
  const CreateUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState(null);

  const CreateNewUser = async () => {
    if (!user) return;

    const name =
      user.name ||
      user.given_name ||
      user.family_name ||
      user.username ||
      (user.email ? user.email.split("@")[0] : "User");

    const email = user.email || user.primaryEmail;

    const result = await CreateUser({
      name,
      email,
    });

    console.log("Created user:", result);
    setUserData(result);
  };

  useEffect(() => {
    if (user && !userData) {
      CreateNewUser();
    }
  }, [user, userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;
