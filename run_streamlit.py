#!/usr/bin/env python3
"""
Simple script to run the Streamlit app with proper environment setup
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()

    # Check for required environment variables
    required_vars = ['GROQ_API_KEY', 'HF_TOKEN']
    missing_vars = []

    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these in your .env file")
        return 1

    print("✅ Environment variables loaded successfully")
    print("🚀 Starting Streamlit app...")

    # Run Streamlit
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "streamlit_app.py",
            "--server.address", "localhost",
            "--server.port", "8505"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Streamlit app stopped")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running Streamlit: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())