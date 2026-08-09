#!/usr/bin/env python
"""Export all scenario metadata to dashboard/public/scenarios.json.

The dashboard fetches live data from the bridge; this file is a bundled
fallback for offline / no-bridge operation (the UI replays it automatically).

Usage:
    python scripts/export_scenarios.py
"""

from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from threatenx.scenario import list_scenarios
from threatenx.brain import AgentBrain, Turn
from threatenx.config import AGENTS
from threatenx.mock_mesh import MockMesh
import asyncio

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(ROOT, "dashboard", "public", "scenarios.json")


async def build_feed(scenario) -> list[dict]:
    """Run a fast in-process simulation to generate the feed for offline replay."""
    feed: list[dict] = []
    seq = [0]

    async def on_event(record: dict) -> None:
        entry = {
            "seq": seq[0],
            "id": f"offline-{seq[0]}",
            "clock": f"T+{seq[0] * 30:02d}s",
            "from_agent": record["from_agent"],
            "handle": record["handle"],
            "llm": None,
            "content": record["content"],
            "mentions": record["mentions"],
            "message_type": record["message_type"],
            "is_dossier": record["is_dossier"],
            "payload": record["payload"],
        }
        feed.append(entry)
        seq[0] += 1

    brains = [AgentBrain(profile, scenario) for profile in AGENTS.values()]
    mesh = MockMesh(brains, on_event=on_event)
    await mesh.run(
        seed_target="Threat Detection Agent",
        seed=Turn("EDR Telemetry", scenario.seed_message()),
    )
    return feed


async def main() -> None:
    scenarios = list_scenarios()
    output = []
    for scenario in scenarios:
        print(f"Building offline feed for: {scenario.name}...")
        feed = await build_feed(scenario)
        public = scenario.to_public()
        public["feed"] = feed
        output.append(public)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    print(f"\nExported {len(output)} scenarios to:\n  {OUT_PATH}")


if __name__ == "__main__":
    asyncio.run(main())
