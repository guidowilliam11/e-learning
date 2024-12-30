import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
            <h1>Session Details</h1>
            <pre
                style={{
                    backgroundColor: "#f4f4f4",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    overflowX: "auto",
                }}
            >
        {JSON.stringify(session.user.id, null, 2)}
      </pre>

        </div>
    );
}
