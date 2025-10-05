import streamlit as st
import sys
import os
import pandas as pd
import json
from io import StringIO

# Add src directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from main_workflow import main_workflow, MainWorkflowState
from functions import clean_query

st.set_page_config(
    page_title="NASA Exoplanet Detection",
    page_icon="🪐",
    layout="wide"
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add welcome message
    st.session_state.messages.append({
        "role": "assistant",
        "content": "Hello! I'm your NASA Exoplanet Detection Assistant 🪐\n\nI can help you with:\n- Analyzing 122-element vectors for exoplanet detection\n- Uploading and processing CSV files with multiple vectors\n- Answering questions about exoplanet detection methods\n\nHow can I assist you today?"
    })

def main():
    st.title("🪐 NASA Exoplanet Detection Assistant")

    # Sidebar for tools
    with st.sidebar:
        # File upload in sidebar
        st.header("📁 Upload CSV Data")
        uploaded_file = st.file_uploader(
            "Choose a CSV file with vectors",
            type=['csv'],
            help="Each row should contain 122 numerical values between 0.0 and 1.0"
        )

        if uploaded_file is not None:
            # Display file info
            df = pd.read_csv(uploaded_file)
            st.write(f"📊 **{uploaded_file.name}**")
            st.write(f"Shape: {df.shape}")

            if st.button("📈 Analyze CSV", type="primary"):
                csv_string = uploaded_file.getvalue().decode("utf-8")
                add_message_to_chat("user", f"Analyze the uploaded CSV file: {uploaded_file.name}")
                process_message(f"Please analyze this CSV data for exoplanets", csv_string)

        st.divider()

        # Clear chat button
        if st.button("🗑️ Clear Chat"):
            st.session_state.messages = []
            st.session_state.messages.append({
                "role": "assistant",
                "content": "Hello! I'm your NASA Exoplanet Detection Assistant 🪐\n\nI can help you with:\n- Analyzing 122-element vectors for exoplanet detection\n- Uploading and processing CSV files with multiple vectors\n- Answering questions about exoplanet detection methods\n\nHow can I assist you today?"
            })
            st.rerun()

    # Main chat interface
    st.header("💬 Chat with the Assistant")

    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat input
    if prompt := st.chat_input("Ask me anything about exoplanet detection or paste your 122-element vector..."):
        # Add user message to chat history
        add_message_to_chat("user", prompt)

        # Process the message
        process_message(prompt)

def add_message_to_chat(role: str, content: str):
    """Add a message to the chat history"""
    st.session_state.messages.append({"role": role, "content": content})

def process_message(user_input: str, csv_data: str = None):
    """Process user message through the main workflow and add response to chat"""

    with st.chat_message("assistant"):
        with st.spinner("💭 Thinking..."):
            try:
                # Prepare state for main workflow
                state = MainWorkflowState(
                    messages=[],
                    user_input=user_input,
                    attached_table=csv_data,
                    response=""
                )

                # Run through main workflow
                result = main_workflow.invoke(state)

                if result["response"]:
                    response = result["response"]
                    st.markdown(response)

                    # Add assistant response to chat history
                    add_message_to_chat("assistant", response)
                else:
                    error_msg = "I couldn't generate a response. Please try rephrasing your question or check your data format."
                    st.error(error_msg)
                    add_message_to_chat("assistant", error_msg)

            except Exception as e:
                error_msg = f"I encountered an error: {str(e)}"
                if "vector" in str(e).lower():
                    error_msg += "\n\nPlease ensure your vector data has exactly 122 values between 0.0 and 1.0."

                st.error(error_msg)
                add_message_to_chat("assistant", error_msg)

    # Add information section at the bottom
    with st.expander("ℹ️ About this system"):
        st.markdown("""
        This NASA Exoplanet Detection System uses machine learning to analyze stellar data and identify potential exoplanets.

        **Features:**
        - **Vector Analysis**: Input 122-element vectors representing stellar measurements
        - **Batch Processing**: Upload CSV files with multiple vectors for batch analysis
        - **Conversational Interface**: Ask questions about exoplanet detection methods

        **Data Requirements:**
        - Vectors must contain exactly 122 numerical values
        - All values should be between 0.0 and 1.0
        - CSV files should have each vector as a row with 122 columns

        **How it works:**
        1. Input data is validated and cleaned
        2. Vectors are processed through a pre-trained ML model
        3. Results indicate probability of exoplanet presence
        4. Summary statistics are generated for batch processing

        **Example vector input:**
        ```
        0.1, 0.2, 0.3, 0.4, ... (122 comma-separated values)
        ```
        """)

if __name__ == "__main__":
    main()