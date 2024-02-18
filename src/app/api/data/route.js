import dbConnect from "@/lib/dbConnect";
import Forms from "@/models/formSubmit";
import { Readable } from "stream";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const auth = new google.auth.GoogleAuth({
  credentials: {
    // Add your Google Drive API credentials here
    client_email: "eifpe-test-storage@eifpe-413803.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLbmR0NVYt6YxH\nzQ9A31dHY4rXYD0v2+KEX10p3XgSKzg1AnrhMZbnb2kctclP86fBFn+E7tMwXlDc\nHglN8+RSgQk+p8IGYM7zmzsQg1hAlFiA3nb9zHl2vX0boNFyDaWk87yvOYrPtCrO\nAQtiGMhJVXIvXXJTtuNeWlbeofAWearF1DQnL3oUgAGgVQoUjvMt8uioWVSdSlmZ\nsERw3G5ESui0xrnf4hKOVfIur0B+7riPCNnHJsNWrsEJsGXslmqsDZO9QMaHnUoE\n8DZdfVXmukeJ+zZNzvUK23AgDGCzB7g0Qw2wa1tIyiMmMGfTodmasvMXhlEX3+vl\n68XYPrurAgMBAAECggEAUUG3g0l4sl8axuVMJfPv91Z182CAIDk6yfgTjPDnEI7N\n5TKn5YJ6zdfNCwg7sKFZDQHRDsacebH6p2mh+s6kESZ0jF/S2txZXanQFmD4Y9c9\nYMA7lFXT4I+AxQPgFSgJVZF7+RvJa/yBqoZ1RwoyGkS0luHDFFg1io8YKtZRQZBB\nplW7WpfyqpcReFM0Gq1AtD/mz7fe8dCN6Sr0pAHXRk7dniayWHC0pK7XeY6W/IZF\nD0Ion/I4sP7Ne6vGBi+YlIPy9cnxg8VBjDSqylYDNcZVB7RStacFnyfnZmyAFu7+\nq+aa5sVcrL6v+urUQUHz7qt8C/s6hFhsILxa29PHdQKBgQD4T5CRGmZN55MeoNU5\nyTB3qVxl9TbXdmIUohU3zt/zgbUS0xVw/frFgPjvWEqR272masvtKyNWTycN3gXs\nTxStuIojCqB6J3Xu18gIuNrX2+rfXFqk9ZhI4vXV3k0E/DOdytuc3J2U5Y1+qTQB\nt3KB1Nu1a7/aYn4CN2faICEwpQKBgQDRuw24pkF4oCEQZmBzq4p+7Q9km33DYsCW\nWqDQ8JGXyexhAMhzvUE3fp+csVaq+pZsdDYyei2eI69cRCppesstwCHaF8K7xoMQ\nbZEZ9kjoZSqciCbOLrKiI9fT5zN6hlir65lqVIXAEbFaO3dD9Gj9kkeeX/U0TkTo\nS97qxhG6DwKBgQCNOOs2q3YNzqvsmnpKsDMBi3ACiNEU/75Oj9RTdjQGkPmD6Etk\nhP5Pv8dUkLlwdTJKaKjsjUE+wCutBl4GBP/0wWTHAy876h93pH+e/ktwwyG0wRjI\ngumGYpaAeTsCn9FXZ905PHvfCCNOKztp0oSsdHw0lUB7GtMhvZMyCl32BQKBgEMw\n7iBuAyOmCXG7msLz/hbT086jkhL6nECPIF5P9BTw9+3L1mxeAXrJ8lC878svJOny\nATsCsYKsZA3nOL86O8WYfD/mxNhrrKmisI3kvU7WumQTqnr7svcHDKoys+dZCydo\n/2l1UrRJ9su1qWv37XrvVkqC64eqW6EgTXZhpmQ5AoGAAIVOkfoK0ylPKla31Sit\n3D7DfU3Nbb87jc00yin/HNU+tyR4gRYxy2038+Pr53AK5qY8/eG+spCTdlMVjY0g\nruz8LgKZuF3zHMcJ0nE4J72jxixQ60nU6izMgN/k92Ag/wOCqN7Sghmfi+Z0XLDU\nv4+HLqxZ/lGrogudPd8lAH8=\n-----END PRIVATE KEY-----\n".replace(
        /\\n/g,
        "\n"
      )
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
        parents: ["15hybOFQMojL9thVKOMsCUfqi9WLz-2vI"]
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
