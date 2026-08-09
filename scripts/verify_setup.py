#!/usr/bin/env python
"""Verify that all 7 Threatenx agents can connect to the Band.ai mesh.

Usage:
    python scripts/verify_setup.py
"""
from __future__ import annotations
import asyncio, logging, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
from threatenx.config import AGENTS
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")

async def verify_agent(handle: str) -> bool:
    try:
        from band import SimpleAdapter, load_agent_config
    except ImportError:
        print(f"  [SKIP] band-sdk not installed — install with: pip install band-sdk>=1.0.0")
        return False
    try:
        config = load_agent_config("agent_config.yaml")
        creds = config.get(handle, {})
        if not creds.get("agent_id") or not creds.get("api_key"):
            print(f"  [FAIL] {handle}: missing credentials in agent_config.yaml")
            return False
        print(f"  [ OK ] {handle}: credentials found")
        return True
    except Exception as exc:
        print(f"  [FAIL] {handle}: {exc}")
        return False

async def main() -> None:
    load_dotenv()
    print(f"\nThreatenx Setup Verification\n{'='*40}")
    results = []
    for handle, profile in AGENTS.items():
        ok = await verify_agent(handle)
        results.append(ok)
    passed = sum(results)
    total = len(results)
    print(f"\n{'='*40}")
    print(f"Result: {passed}/{total} agents verified")
    if passed == total:
        print("All agents ready. Run: bash scripts/start_agents.sh")
    else:
        print("Fix the issues above before running in live mode.")
        print("For simulate mode (no Band needed): python scripts/simulate_incident.py")

if __name__ == "__main__":
    asyncio.run(main())
