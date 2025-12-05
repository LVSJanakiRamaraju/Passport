import subprocess
import json
import sys

def run_tests():
    """Run pytest and capture results"""
    result = subprocess.run(
        ["pytest", "test_api.py", "-v", "--tb=short", "--json-report", "--json-report-file=test_results.json"],
        capture_output=True,
        text=True
    )
    
    # Parse output
    output_lines = result.stdout.split('\n')
    
    tests = []
    for line in output_lines:
        if '::test_' in line:
            if 'PASSED' in line:
                test_name = line.split('::')[1].split(' ')[0]
                tests.append({"name": test_name, "status": "PASSED"})
            elif 'FAILED' in line:
                test_name = line.split('::')[1].split(' ')[0]
                tests.append({"name": test_name, "status": "FAILED"})
    
    return {
        "total": len(tests),
        "passed": len([t for t in tests if t["status"] == "PASSED"]),
        "failed": len([t for t in tests if t["status"] == "FAILED"]),
        "tests": tests,
        "output": result.stdout
    }

if __name__ == "__main__":
    results = run_tests()
    print(json.dumps(results, indent=2))
