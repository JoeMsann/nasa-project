from typing import TypedDict
from config import app_config
from langgraph.graph import StateGraph, START, END
from functions import clean_query
import pandas as pd
import io

# Initializing models
vector_parser = app_config.reasoning_model
exoplanet_detector = app_config.exoplanet_detection_model
json_transcriber_agent = app_config.reasoning_model

# Pipeline State
class State(TypedDict):
    user_input: str # Raw user input
    attached_table: str | None # Optional uploaded table containing vectors
    vector_list: list[str] # list of 122-vectors as strings
    output_json_list: list[dict] # list of JSON outputs for each input vector
    transcribed_response: str # Final human-readable response

# Vector Parsing node
def parse_vectors_node(state: State) -> State:
    """Parse CSV string into list of vector strings"""   
    vector_list = []
    
    # 1. Parse CSV if it exists
    csv_content = state.get("attached_table")
    if csv_content:
        df = pd.read_csv(io.StringIO(csv_content))
        csv_vectors = [",".join(map(str, row)) for row in df.values]
        vector_list.extend(csv_vectors)

    # 2. Parse vector from user input
    user_input = state.get("user_input", "")
    if user_input:
        parsed_vector = clean_query(user_input)
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
        result = exoplanet_detector.predict(
            input_vector=vector_str,
            api_name="/predict"
        )
        output_json_list.append(result)
    
    return {
        "output_json_list": output_json_list
    }

# JSON transcription node
def json_transcription_node(state: State) -> State:
    """Convert JSON results to human-readable text"""
    json_list = state["output_json_list"]
    
    # Example transcription
    total = len(json_list)
    exoplanets = sum(1 for j in json_list if j.get("is_exoplanet"))
    
    response = f"Analyzed {total} vectors. Found {exoplanets} potential exoplanets."
    
    return {
        "transcribed_response": response
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
