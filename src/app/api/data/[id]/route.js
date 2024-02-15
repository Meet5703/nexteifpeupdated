import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Forms from "@/models/formSubmit";

// Function to fetch all form data
export const fetchDataList = async () => {
  try {
    await dbConnect();
    return await Forms.find();
  } catch (error) {
    console.error("Error fetching form data:", error);
    return [];
  }
};

// GET method for fetching specific form data by ID
export async function GET(request, content) {
  try {
    const formDataList = await fetchDataList();
    const userData = formDataList.find((item) => item.ID === content.params.id);

    if (!userData) {
      return NextResponse.json(
        { msg: "Form data not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json(
      { msg: "Internal error", success: false },
      { status: 500 }
    );
  }
}

// PUT method to update form data status
export async function PUT(request, content) {
  try {
    await dbConnect();
    const { id } = content.params;
    const payload = await request.json();

    // Find the form data by ID and update the status
    const updatedData = await Forms.findOneAndUpdate(
      { ID: id },
      { status: "success" },
      { new: true }
    );

    if (!updatedData) {
      return NextResponse.json(
        { msg: "Form data not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, formData: updatedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating form data:", error);
    return NextResponse.json(
      { msg: "Internal error", success: false },
      { status: 500 }
    );
  }
}

// DELETE method to delete form data by ID
export async function DELETE(request, content) {
  try {
    await dbConnect();
    const { id } = content.params;

    // Find the form data by ID and delete it
    const deletedData = await Forms.findOneAndDelete({ ID: id });

    if (!deletedData) {
      return NextResponse.json(
        { msg: "Form data not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Data deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting form data:", error);
    return NextResponse.json(
      { msg: "Internal error", success: false },
      { status: 500 }
    );
  }
}
