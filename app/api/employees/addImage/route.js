export const runtime = "nodejs";

// app/api/employees/addImage/route.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    console.log("BUCKET_NAME", BUCKET_NAME);
    const formData = await request.formData();
    const file = formData.get("file"); // This is a Blob (File object from browser)
    console.log(file, "file");
    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return Response.json({
      message: "Image uploaded successfully",
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.log("Upload error:", error);
    return Response.json(
      { error: "Something went wrong while uploading image" },
      { status: 500 }
    );
  }
}
