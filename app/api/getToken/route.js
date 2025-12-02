import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

export async function GET() {
  console.log("hello")
  try {
    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLY_API_KEY,
    });

    const resp = await client.realtime.createTemporaryToken({
      expires_in: 3600,
      model: "nano",   
    });

    return NextResponse.json({ token: resp.token });
  } catch (error) {
    console.error("AssemblyAI token generation FAILED:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     const apiKey = process.env.ASSEMBLY_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "ASSEMBLY_API_KEY is missing in environment variables" },
//         { status: 500 }
//       );
//     }


//     const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
//       method: "POST",
//       headers: {
//         Authorization: apiKey,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ expires_in: 3600 }), 
//     });

//     const data = await response.json();

//     if (!response.ok) {
//         console.error("AssemblyAI Token API Error:", data);

//         return NextResponse.json({ error: data.error }, { status: 500 });
//     }

//     return NextResponse.json({ token: data.token });

//   } catch (error) {
//     console.error("Server Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }


// }

// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     const apiKey = process.env.ASSEMBLY_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "ASSEMBLY_API_KEY is missing in environment variables" },
//         { status: 500 }
//       );
//     }

//     const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
//       method: "POST",
//       headers: {
//         Authorization: apiKey, // AssemblyAI expects the key directly in Authorization
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ expires_in: 3600 }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("AssemblyAI Token API Error:", data);
//       return NextResponse.json({ error: data.error }, { status: 500 });
//     }

//     return NextResponse.json({ token: data.token });

//   } catch (error) {
//     console.error("Server Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }