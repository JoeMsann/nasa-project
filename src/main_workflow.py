from config import app_config
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict
import json
from langchain_core.prompts import ChatPromptTemplate
from functions import clean_query

# Initializing models
router = app_config.reasoning_model
conversation_agent = app_config.conversation_model
exoplanet_detector = app_config.exoplanet_detection_model
json_transcriber_agent = app_config.reasoning_model

# Prompt Templates
conversation_prompt = ChatPromptTemplate.from_messages([
    ("system", ""),
    ("user", "{user_input}")
])
conversation_chain = conversation_prompt | conversation_agent

# General Graph State
class MainWorkflowState(TypedDict):
    user_input: str
    input_vector: str
    response: str

# Private Graph State between exoplanet detection and json transcriber
class PrivateWorkflowState(TypedDict):
    output_json: json

# Nodes logic
def routing_node(state: MainWorkflowState) -> MainWorkflowState:
    pass

# Conversation node
def conversation_node(state: MainWorkflowState) -> MainWorkflowState:
    """Handle conversational queries"""    
    response = conversation_chain.invoke({"user_input": state["user_input"]})
    state["response"] = response.content
    return state

# Exoplanet Detection node
def exoplanet_detection_node(state: MainWorkflowState) -> PrivateWorkflowState:
    """Handle exoplanet detection from input vector"""
    
    # Extract 122-Vector from user input
    user_query = state["user_input"]
    input_vector = clean_query(user_query)

    output_json = exoplanet_detector.predict(
        input_vector=input_vector,
        api_name="/predict"
    )
    return {
        "output_json": output_json
    }

# JSON transcription node
def json_transcription_node(state: PrivateWorkflowState) -> MainWorkflowState:
    """Transcribe JSON output to human-readable text"""
    output_json = state["output_json"]
    pass

# Router node
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