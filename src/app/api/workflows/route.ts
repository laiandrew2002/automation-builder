import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const clerkId = req.headers.get("clerk-id"); // Pass this from the client
  
  if (!clerkId) {
    return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });
  }

  const workflows = await db.workflows.findMany({
    where: { userId: clerkId },
  })

  return NextResponse.json(workflows)
}

// 📌 UPDATE Workflow Publish State
export async function PATCH(req: NextRequest) {
  const { workflowId, state } = await req.json()
  
  if (!workflowId) return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 })
    
    const updatedWorkflow = await db.workflows.update({
      where: { id: workflowId },
      data: { publish: state },
    })
    
    return NextResponse.json({ message: updatedWorkflow.publish ? 'Workflow published' : 'Workflow unpublished' })
  }
  
  // 📌 CREATE Workflow
  export async function POST(req: NextRequest) {
    const { clerkId, name, description } = await req.json();
    
    if (!clerkId || !name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const workflow = await db.workflows.create({
      data: {
        userId: clerkId,
        name,
        description,
      },
    })
    
    return NextResponse.json({ message: 'Workflow created', workflow })
  }
