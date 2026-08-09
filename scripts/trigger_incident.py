#!/usr/bin/env python
"""One-shot incident trigger for live Band mesh mode.

Creates a Band room and posts the bootstrap event for the chosen scenario.
The 7 live agents (started via start_agents.sh) pick it up automatically.

Usage:
    python scripts/trigger_incident.py romanian-pii
    python scripts/trigger_incident.py ransomware-lateral
    python scripts/trigger_incident.py aws-cryptojacking
"""
from __future__ import annotations
import asyncio, logging, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
from threatenx.incident_room import make_client, open_incident
from threatenx.scenario import DEFAULT_SCENARIO_ID, get_scenario
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")

async def main() -> None:
    load_dotenv()
    scenario_id = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SCENARIO_ID
    scenario = get_scenario(scenario_id)
    print(f"\nTriggering live incident: {scenario.name}")
    print(f"Incident ID: {scenario.incident_id}\n")
    try:
        client = make_client()
        room_id = await open_incident(client, scenario)
        print(f"Band room created: {room_id}")
        print(f"Agents should join automatically. Monitor in the dashboard.")
    except RuntimeError as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
