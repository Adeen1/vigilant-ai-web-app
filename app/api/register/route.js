
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { name, email, password, company } = await request.json();
    
    // Validate input
    if (!name || !email || !password || !company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("workplace-monitoring");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create organization
    const organizationResult = await db.collection("organizations").insertOne({
      name: company,
      createdAt: new Date(),
    });

    const organizationId = organizationResult.insertedId;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Organization head/admin
      organizationId: new ObjectId(organizationId),
      createdAt: new Date(),
    });

    // Create empty subscriptions document
    await db.collection("subscriptions").insertOne({
      organizationId: new ObjectId(organizationId),
      activities: [],
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
