import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "../../../lib/mongodb";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession({ req: request });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const client = await clientPromise;
    const db = client.db("workplace-monitoring");
    const user = await db.collection("users").findOne({
      email: session.user.email,
    });
    const employee = await db.collection("employees").findOne({
      _id: id,
      organizationId: user.organizationId,
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession({ req: request });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { name, role, imageUrls } = await request.json();

    const client = await clientPromise;
    const db = client.db("workplace-monitoring");

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (imageUrls && imageUrls.length >= 5) updateData.imageUrls = imageUrls;
    const user = await db.collection("users").findOne({
      email: session.user.email,
    });
    const result = await db.collection("employees").updateOne(
      {
        _id: id,
        organizationId: user.organizationId,
      },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession({ req: request });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const client = await clientPromise;
    const db = client.db("workplace-monitoring");
    const user = await db.collection("users").findOne({
      email: session.user.email,
    });
    const result = await db.collection("employees").deleteOne({
      _id: id,
      organizationId: user.organizationId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
