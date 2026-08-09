#!/usr/bin/env python
"""Log Analysis Agent — live Band worker (handle: log-analysis-agent)."""
import asyncio, logging, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from threatenx.live import run_agent_live
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s", datefmt="%H:%M:%S")
if __name__ == "__main__":
    asyncio.run(run_agent_live("log-analysis-agent"))
