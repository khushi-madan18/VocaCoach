import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.ASSEMBLY_API_KEY;

    if (!apiKey) {
      console.error("ASSEMBLY_API_KEY is missing!");
      return NextResponse.json(
        { error: "ASSEMBLY_API_KEY is missing" },
        { status: 500 }
      );
    }

    const MAX_RETRIES = 3;
    let lastError;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await fetch(`https://streaming.assemblyai.com/v3/token?expires_in_seconds=600`, {
          method: "GET",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`Attempt ${i + 1} failed:`, data);
          if (i === MAX_RETRIES - 1) {
            return NextResponse.json({ error: data.error || "Failed to fetch token" }, { status: 500 });
          }
          continue;
        }

        return NextResponse.json({ token: data.token });

      } catch (error) {
        console.error(`Attempt ${i + 1} network error:`, error);
        lastError = error;
        if (i === MAX_RETRIES - 1) throw lastError;
        // Wait briefly before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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