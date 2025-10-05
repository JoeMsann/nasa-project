from typing import TypedDict
from config import app_config
from langgraph.graph import StateGraph, START, END
from functions import clean, choose_model_api
from prompts import JSON_TRANSCRIBER_PROMPT
import pandas as pd
import io

# Initializing models
vector_parser = app_config.reasoning_model
exoplanet_model = app_config.exoplanet_model
json_transcriber_agent = app_config.reasoning_model

# Pipeline State
class State(TypedDict):
    user_input: str # Raw user input
    attached_table: str | None # Optional uploaded table containing vectors
    vector_list: list[str] # list of 121-vectors as strings
    output_json_list: list[dict] # list of JSON outputs for each input vector
    transcribed_response: str # Final human-readable response

# Vector Parsing node
def parse_vectors_node(state: State) -> State:
    """Parse CSV string into list of vector strings"""   
    vector_list = []
    
    # 1. Parse CSV if it exists
    attached_table = state.get("attached_table", "")
    if attached_table:
        # Split by newline and filter out empty lines
        lines = [line.strip() for line in attached_table.split('\n') if line.strip()]
        print(f"Number of vectors found in table: {len(lines)}")
        
        for line in lines:
            # Each line should be a comma-separated string of numbers
            if line:  # Skip empty lines
                vector_list.append(clean(line))

    # 2. Parse vector from user input
    user_input = state.get("user_input", "")
    print(f"User Input: {user_input}")
    if user_input:
        parsed_vector = clean(user_input)
        if parsed_vector:
            vector_list.append(parsed_vector)
            
    return {
        "vector_list": vector_list
    }

# Exoplanet Detection node
def exoplanet_detection_node(state: State) -> State:
    """Handle exoplanet detection for each vector"""

    vector_list = state["vector_list"]
    output_json_list = []

    for vector_str in vector_list:
        model_api = choose_model_api(vector_str)

        # Check if model selection returned an error
        if isinstance(model_api, dict) and "error" in model_api:
            output_json_list.append(model_api)
            continue

        result = exoplanet_model.predict(
            input_vector=vector_str,
            api_name=model_api
        )
        output_json_list.append(result)
    
    return {
        "output_json_list": output_json_list
    }

# JSON transcription node
def json_transcription_node(state: State) -> State:
    """Convert JSON results to human-readable text using the JSON transcriber agent"""
    json_list = state["output_json_list"]

    # Use the JSON transcriber agent with the proper prompt
    response = json_transcriber_agent.invoke([
        JSON_TRANSCRIBER_PROMPT,
        {"role": "user", "content": str(json_list)}
    ])

    return {
        "transcribed_response": response.content
    }

# Graph Builder
exoplanet_pipeline_builder = StateGraph(State)

# Nodes
exoplanet_pipeline_builder.add_node("vector_parsing", parse_vectors_node)
exoplanet_pipeline_builder.add_node("exoplanet_detection", exoplanet_detection_node)
exoplanet_pipeline_builder.add_node("json_to_text", json_transcription_node)

# Edges
exoplanet_pipeline_builder.add_edge(START, "vector_parsing")
exoplanet_pipeline_builder.add_edge("vector_parsing", "exoplanet_detection")
exoplanet_pipeline_builder.add_edge("exoplanet_detection", "json_to_text")
exoplanet_pipeline_builder.add_edge("json_to_text", END)

# Compiled Graph
exoplanet_pipeline = exoplanet_pipeline_builder.compile()

# initial_state = {
#     "user_input": "1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0",
#     "attached_table": None,
#     "vector_list": [],
#     "output_json_list": [],
#     "transcribed_response": ""
# }

# result = exoplanet_pipeline.invoke(initial_state)
# print(result)