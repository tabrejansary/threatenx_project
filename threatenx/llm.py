"""LLM layer — the "Mix and Match" strategy with graceful fallback.

Two backends:
  * Gemini 2.5 Flash (``google-generativeai``) for fast, structured worker parsing.
  * Llama 3 70B via Groq for the Incident Commander's high-level reasoning.

Every call is best-effort: if a provider key is missing, the library is absent,
or the API errors, we raise :class:`LLMUnavailable` and the caller falls back to
the seeded canned narrative. This guarantees the demo always completes — the
forensic facts are deterministic; only the prose is model-generated.
"""

from __future__ import annotations

import logging
import os
import warnings

from .config import GEMINI_MODEL, GROQ_MODEL, LLM_GEMINI, LLM_GROQ, AgentProfile

logger = logging.getLogger("threatenx.llm")

# google-generativeai emits FutureWarnings; suppress them to keep logs clean.
warnings.filterwarnings("ignore", category=FutureWarning, module="google.generativeai")

# Generation config: low temperature keeps security reports grounded and consistent.
_TEMPERATURE = 0.4
_MAX_TOKENS = 400


class LLMUnavailable(RuntimeError):
    """Raised when an LLM call cannot be completed (missing key, quota, network, etc.)."""


# ── Gemini 2.5 Flash ──────────────────────────────────────────────────────────

def _gemini_complete(system: str, user: str) -> str:
    """Call Google Gemini and return the response text."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise LLMUnavailable("GEMINI_API_KEY not set — using fallback narrative")
    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system)
        resp = model.generate_content(
            user,
            generation_config={
                "temperature": _TEMPERATURE,
                "max_output_tokens": _MAX_TOKENS,
            },
        )
        text = (getattr(resp, "text", None) or "").strip()
        if not text:
            raise LLMUnavailable("Gemini returned an empty response")
        return text
    except LLMUnavailable:
        raise
    except Exception as exc:  # noqa: BLE001
        exc_str = str(exc)
        # On rate-limit (429), fall back instantly so the demo stays fast.
        if "429" in exc_str or "quota" in exc_str.lower():
            logger.warning("Gemini quota exceeded — falling back to canned narrative")
        raise LLMUnavailable(f"Gemini call failed: {exc}") from exc


# ── Groq / Llama 3 70B ───────────────────────────────────────────────────────

def _groq_complete(system: str, user: str) -> str:
    """Call Groq (Llama 3 70B) and return the response text."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise LLMUnavailable("GROQ_API_KEY not set — using fallback narrative")
    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        resp = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=_TEMPERATURE,
            max_tokens=_MAX_TOKENS,
        )
        text = (resp.choices[0].message.content or "").strip()
        if not text:
            raise LLMUnavailable("Groq returned an empty response")
        return text
    except LLMUnavailable:
        raise
    except Exception as exc:  # noqa: BLE001
        raise LLMUnavailable(f"Groq call failed: {exc}") from exc


# ── Public API ────────────────────────────────────────────────────────────────

def complete(profile: AgentProfile, system: str, user: str) -> str:
    """Route to the agent's configured LLM. Raises :class:`LLMUnavailable` on failure."""
    if profile.llm == LLM_GROQ:
        return _groq_complete(system, user)
    if profile.llm == LLM_GEMINI:
        return _gemini_complete(system, user)
    raise LLMUnavailable(f"Unknown LLM backend {profile.llm!r}")  # pragma: no cover
