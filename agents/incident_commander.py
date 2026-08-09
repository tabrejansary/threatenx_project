#!/usr/bin/env python
"""Incident Commander Agent — live Band worker (handle: incident-commander)."""
import asyncio, logging, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from threatenx.live import run_agent_live
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s", datefmt="%H:%M:%S")
if __name__ == "__main__":
    asyncio.run(run_agent_live("incident-commander"))
