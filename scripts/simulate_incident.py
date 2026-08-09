#!/usr/bin/env python
"""Simulate one or more incident scenarios end-to-end.

Runs the full 7-agent cascade in-process using real LLM calls (with graceful
fallback to canned narratives). Writes the resulting dossier to data/.

Usage:
    python scripts/simulate_incident.py                      # default (romanian-pii)
    python scripts/simulate_incident.py ransomware-lateral
    python scripts/simulate_incident.py aws-cryptojacking
    python scripts/simulate_incident.py all                  # all three scenarios
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from threatenx.brain import AgentBrain, Turn
from threatenx.config import AGENTS
from threatenx.mock_mesh import MockMesh
from threatenx.scenario import DEFAULT_SCENARIO_ID, get_scenario, list_scenarios

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("threatenx.simulate")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


async def run_scenario(scenario_id: str) -> dict:
    scenario = get_scenario(scenario_id)
    print(f"\n{'='*60}")
    print(f"  SCENARIO: {scenario.name}")
    print(f"  ID:       {scenario.id}")
    print(f"  Severity: {scenario.dossier_severity.upper()}")
    print(f"{'='*60}\n")

    feed: list[dict] = []

    async def on_event(record: dict) -> None:
        content_preview = record["content"][:120].replace("\n", " ")
        print(f"  [{record['from_agent']:30s}] {content_preview}")
        feed.append(record)

    brains = [AgentBrain(profile, scenario) for profile in AGENTS.values()]
    mesh = MockMesh(brains, on_event=on_event)

    start = datetime.now()
    await mesh.run(
        seed_target="Threat Detection Agent",
        seed=Turn("EDR Telemetry", scenario.seed_message()),
    )
    elapsed = (datetime.now() - start).total_seconds()

    dossier = scenario.build_dossier().model_dump(mode="json")
    result = {
        "scenario_id": scenario.id,
        "scenario_name": scenario.name,
        "severity": scenario.dossier_severity,
        "elapsed_seconds": round(elapsed, 2),
        "message_count": len(feed),
        "dossier": dossier,
        "feed": [
            {"from_agent": r["from_agent"], "content": r["content"][:200]}
            for r in feed
        ],
    }

    # Save to data/
    os.makedirs(DATA_DIR, exist_ok=True)
    out_path = os.path.join(DATA_DIR, f"incident_{scenario.id}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"\n  Completed in {elapsed:.1f}s — {len(feed)} messages")
    print(f"  Dossier saved: {out_path}\n")
    return result


async def main() -> None:
    load_dotenv()
    arg = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SCENARIO_ID

    if arg == "all":
        for scenario in list_scenarios():
            await run_scenario(scenario.id)
    else:
        await run_scenario(arg)

    print("Simulation complete.")


if __name__ == "__main__":
    asyncio.run(main())
