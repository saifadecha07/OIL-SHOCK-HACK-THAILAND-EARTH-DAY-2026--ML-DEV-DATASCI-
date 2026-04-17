from __future__ import annotations

"""
Legacy wrapper kept for compatibility.

Despite the filename, this entrypoint no longer creates mock data. It now routes
to the real-data dataset build pipeline.
"""

import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml_engine.pipelines.build_dataset import main


if __name__ == "__main__":
    main()
