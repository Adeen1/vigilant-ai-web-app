import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "../../lib/mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession({ req: request });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("workplace-monitoring");
    const user = await db.collection("users").findOne({
      email: session.user.email,
    });
    const subscription = await db.collection("subscriptions").findOne({
      organizationId: user.organizationId,
    });

    return NextResponse.json(subscription || { activities: [] });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession({ req: request });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activities } = await request.json();

    if (!activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { error: "Invalid activities data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("workplace-monitoring");

    const user = await db.collection("users").findOne({
      email: session.user.email,
    });
    await db
      .collection("subscriptions")
      .updateOne(
        { organizationId: user.organizationId },
        { $set: { activities, updatedAt: new Date() } },
        { upsert: true }
      );

    return NextResponse.json({ message: "Subscriptions updated successfully" });
  } catch (error) {
    console.error("Error updating subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to update subscriptions" },
      { status: 500 }
    );
  }
}
