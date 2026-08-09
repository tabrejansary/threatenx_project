import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/approve
 * Receives containment approval from the Human Security Officer.
 * Body: { incident_id: string, action_ids: string[] }
 *
 * In production this would forward the approval to the local integration layer
 * (firewall APIs, Active Directory, cloud provider SDKs). Here it logs and
 * returns acknowledgement — the bridge handles the actual execution via the
 * dashboard bridge WebSocket.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { incident_id, action_ids } = body as {
      incident_id: string;
      action_ids: string[];
    };

    if (!incident_id || !Array.isArray(action_ids)) {
      return NextResponse.json(
        { ok: false, error: "incident_id and action_ids are required" },
        { status: 400 }
      );
    }

    // Log the approval (in production: trigger containment integrations)
    console.log(
      `[APPROVAL] Incident: ${incident_id} | Actions: ${action_ids.join(", ")}`
    );

    return NextResponse.json({
      ok: true,
      incident_id,
      approved_actions: action_ids,
      message: "Containment actions approved and dispatched to integration layer.",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
