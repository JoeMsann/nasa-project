from config import app_config
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict
import json

# Initializing models
router = app_config.reasoning_model
conversation_agent = app_config.conversation_model
exoplanet_detector = app_config.exoplanet_detection_model
json_transcriber_agent = app_config.reasoning_model

# General Graph State
class MainWorkflowState(TypedDict):
    input_query: str
    input_vector: str
    response: str

# Private Graph State between exoplanet detection and json transcriber
class PrivateWorkflowState(TypedDict):
    input_vector: str
    output_json: json

# Nodes logic
def routing_node(state: MainWorkflowState) -> MainWorkflowState:
    pass

def conversation_node(state: MainWorkflowState) -> MainWorkflowState:
    pass

def exoplanet_detection_node(state: MainWorkflowState) -> PrivateWorkflowState:
    pass

def json_transcription_node(state: PrivateWorkflowState) -> MainWorkflowState:
    pass

def routing_logic(state: MainWorkflowState) -> str:
    pass

# Graph Builder
workflow_builder = StateGraph(MainWorkflowState)

# Nodes
workflow_builder.add_node("routing", routing_node)
workflow_builder.add_node("exoplanet_detection", exoplanet_detection_node)
workflow_builder.add_node("conversation", conversation_node)
workflow_builder.add_node("json_to_text", json_transcription_node)

# Edges
workflow_builder.add_edge(START, "routing")
workflow_builder.add_conditional_edges(
    "routing",
    routing_logic,
    {
        "conversation": "conversation",
        "exoplanet_detection": "exoplanet_detection",
    },
)
workflow_builder.add_edge("exoplanet_detection", "json_to_text")
workflow_builder.add_edge("json_to_text", END)
workflow_builder.add_edge("conversation", END)

# Compiled Graph
main_workflow = workflow_builder.compile()