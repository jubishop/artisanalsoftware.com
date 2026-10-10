"""Verify the application checks that bin/check --full runs, with simulated tools."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1]


class CheckApplicationTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix="artisanal application checks ")
        self.addCleanup(temporary.cleanup)
        base = Path(temporary.name)
        self.repo = base / "checkout"
        (self.repo / "bin").mkdir(parents=True)
        shutil.copy2(SOURCE / "bin/check-application", self.repo / "bin/check-application")
        (self.repo / "tests").mkdir()
        self.events = base / "events.jsonl"
        for name in ("first", "second"):
            (self.repo / "tests" / f"test_{name}.py").write_text(
                "import json, os, unittest\n"
                "class Probe(unittest.TestCase):\n"
                "    def test_probe(self):\n"
                "        with open(os.environ['CHECK_EVENTS'], 'a') as stream:\n"
                f"            stream.write(json.dumps(['{name}']) + '\\n')\n"
                "        self.assertNotIn('FAIL_PYTHON', os.environ)\n")
        self.tools = base / "tools"
        self.tools.mkdir()
        (self.tools / "python3").symlink_to(sys.executable)
        npm = self.tools / "npm"
        npm.write_text("#!" + sys.executable + "\n"
                       "import json, os, sys\n"
                       "with open(os.environ['CHECK_EVENTS'], 'a') as stream:\n"
                       "    stream.write(json.dumps(['npm', os.getcwd(), *sys.argv[1:]]) + '\\n')\n"
                       "sys.exit(int(os.environ.get('APPLICATION_EXIT', '0')))\n")
        npm.chmod(0o755)
        self.env = {key: value for key, value in os.environ.items() if key not in {"FAIL_PYTHON", "APPLICATION_EXIT"}}
        self.env.update(PATH=str(self.tools), CHECK_EVENTS=str(self.events), PYTHONDONTWRITEBYTECODE="1")

    def check(self, **extra):
        return subprocess.run([str(self.repo / "bin/check-application")], cwd=self.repo / "bin",
                              env=self.env | extra, text=True, capture_output=True, timeout=60)

    def recorded(self):
        return [json.loads(line) for line in self.events.read_text().splitlines()] if self.events.exists() else []

    def test_runs_python_tests_then_npm_test_at_the_root(self):
        result = self.check()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.recorded(), [["first"], ["second"], ["npm", str(self.repo.resolve()), "test"]])

    def test_failures_propagate_and_stop_later_commands(self):
        result = self.check(FAIL_PYTHON="1")
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("npm", [event[0] for event in self.recorded()])
        self.events.unlink()
        result = self.check(APPLICATION_EXIT="23")
        self.assertEqual(result.returncode, 23, result.stderr)

    def test_missing_npm_fails_with_runtime_guidance(self):
        (self.tools / "npm").unlink()
        result = self.check()
        self.assertEqual(result.returncode, 1)
        self.assertIn("Cannot run application checks:", result.stderr)
        self.assertIn("Select Node 24 or later (the latest LTS) and run npm ci.", result.stderr)


if __name__ == "__main__":
    unittest.main()
