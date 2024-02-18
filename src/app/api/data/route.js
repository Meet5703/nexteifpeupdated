import dbConnect from "@/lib/dbConnect";
import Forms from "@/models/formSubmit";
import { Readable } from "stream";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const auth = new google.auth.GoogleAuth({
  credentials: {
    // Add your Google Drive API credentials here
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
  },
  scopes: "https://www.googleapis.com/auth/drive"
});
const drive = google.drive({ version: "v3", auth });

export async function GET() {
  try {
    await dbConnect();
    const formDataList = await Forms.find(); // Fetch all form data

    return NextResponse.json({
      success: true,
      formDataList: formDataList
    });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({
      msg: "Error fetching form data",
      success: false
    });
  }
}

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("VideoUpload");

  if (!file) {
    return NextResponse.json({ msg: "No file found", success: false });
  }

  const supportedVideoTypes = ["video/mp4", "video/webm"]; // Add more as needed

  if (!supportedVideoTypes.includes(file.type)) {
    return NextResponse.json({
      msg: "Unsupported video format",
      success: false
    });
  }

  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);

  // Generate a unique ID starting with "EIFPE"
  const uniqueId = () => {
    const date = new Date();

    // Set the time zone to India Standard Time (IST)
    const options = { timeZone: "Asia/Kolkata" };
    const localDateString = date.toLocaleString("en-US", options);

    // Extract only numeric characters and limit to the first 14 characters
    const dateString = localDateString.replace(/[^0-9]/g, "").slice(0, 14);

    const randomness = Math.random().toString(36).substr(2, 3); // Modify this to generate only 2 to 3 characters
    const uniqueId = "EIFPE-" + dateString + randomness;

    console.log("Unique ID:", uniqueId);

    return uniqueId;
  };

  try {
    const stream = new Readable();
    stream._read = () => {}; // Define _read method for Readable stream
    stream.push(buffer);
    stream.push(null);
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: file.type,
        body: stream // Use the file buffer directly
      }
    });

    // Now that the file is saved, save other form data to the database
    const formData = {
      ID: uniqueId(),
      Name: data.get("Name"),
      FatherName: data.get("FatherName"),
      MotherName: data.get("MotherName"),
      Address: data.get("Address"),
      email: data.get("email"),
      ActingRole: data.get("ActingRole"),
      MobileNumber: data.get("MobileNumber"),
      WhatsAppNumber: data.get("WhatsAppNumber"),
      status: data.get("status") || "Failed",
      VideoUpload: response.data.id
    };
    console.log("FormData:", formData);

    await dbConnect();
    const result = await Forms.create(formData);

    return NextResponse.json({
      msg: "File uploaded and form data saved successfully",
      success: true,
      result: result
    });
  } catch (error) {
    console.error("Error writing file or saving form data:", error);
    return NextResponse.json({
      msg: "File upload or form data save failed",
      success: false
    });
  }
}
