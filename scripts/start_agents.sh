#!/bin/bash
# Start all 7 Threatenx agents as background workers connected to the live Band mesh.
# Prerequisites: pip install -r requirements.txt, agent_config.yaml configured.
set -e
cd "$(dirname "$0")/.."
echo "Starting Threatenx agent federation (live Band mesh mode)..."
python agents/threat_detection_agent.py &
python agents/log_analysis_agent.py &
python agents/malware_analysis_agent.py &
python agents/risk_assessment_agent.py &
python agents/compliance_agent.py &
python agents/pr_agent.py &
python agents/incident_commander.py &
echo "All 7 agents started. PIDs: $(jobs -p)"
echo "Use 'kill $(jobs -p)' to stop all agents."
wait
