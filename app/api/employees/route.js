
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession({ req: request });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const client = await clientPromise;
    const db = client.db("workplace-monitoring");
    
    const employees = await db.collection("employees")
      .find({ organizationId: new ObjectId(session.user.organizationId) })
      .toArray();
    
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession({ req: request });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, role, imageUrls } = await request.json();
    
    if (!name || !role || !imageUrls || imageUrls.length < 5) {
      return NextResponse.json({ 
        error: "Missing required fields. Name, role, and 5 images are required." 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db("workplace-monitoring");
    
    const result = await db.collection("employees").insertOne({
      name,
      role,
      imageUrls,
      organizationId: new ObjectId(session.user.organizationId),
      createdAt: new Date()
    });
    
    return NextResponse.json({ 
      message: "Employee added successfully",
      employeeId: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
  }
}
