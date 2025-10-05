import operator
from config import app_config
from langgraph.graph import StateGraph, START, END
from typing_extensions import Annotated, TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from exoplanet_pipeline_subgraph import exoplanet_pipeline
from prompts import *

# Initializing models
router = app_config.routing_model
conversation_agent = app_config.conversation_model

# Prompt Templates
router_prompt = ChatPromptTemplate.from_messages([
    ("system", ROUTER_PROMPT),
    ("placeholder", "{messages}"),  # Include conversation history
    ("user", "{user_input}")
])
router_chain = router_prompt | router

conversation_prompt = ChatPromptTemplate.from_messages([
    ("system", CONVERSATION_AGENT_PROMPT),
    ("placeholder", "{messages}"),  # Include conversation history
    ("user", "{user_input}")
])
conversation_chain = conversation_prompt | conversation_agent

# General Graph State
class MainWorkflowState(TypedDict):
    messages: Annotated[list, operator.add] # Accumulated messages (short term memory)
    user_input: str # Raw user input
    attached_table: str | None # Optional uploaded table containing vectors
    response: str # Final response to user
    routing_decision: bool # True for exoplanet pipeline, False for conversation

# Nodes logic
def routing_node(state: MainWorkflowState) -> MainWorkflowState:
    """Classify user intent and determine routing path"""

    # Get conversation history (excluding current input)
    messages = state.get("messages", [])

    # Invoke router LLM with user input and history
    routing_decision = router_chain.invoke({
        "messages": messages,
        "user_input": state["user_input"]
    })

    # Convert routing decision to boolean
    decision_text = routing_decision.content.strip().lower()
    is_exoplanet = any(keyword in decision_text for keyword in ["exoplanet", "detection", "predict"])

    # Add current user input to messages
    return {
        "messages": [HumanMessage(content=state["user_input"])],
        "routing_decision": is_exoplanet
    }

# Conversation node
def conversation_node(state: MainWorkflowState) -> MainWorkflowState:
    """Handle conversational queries"""

    # Get conversation history
    messages = state.get("messages", [])

    response = conversation_chain.invoke({
        "messages": messages,
        "user_input": state["user_input"]
    })

    # Add AI response to messages and set response
    return {
        "messages": [AIMessage(content=response.content)],
        "response": response.content
    }

# Exoplanet Detection Pipeline node
def exoplanet_pipeline_node(state: MainWorkflowState) -> MainWorkflowState:
    """Wrapper that converts MainState ↔ ExoplanetPipelineState"""
    
    # Convert MainState → PipelineState
    pipeline_input = {
        "user_input": state["user_input"], # Pass through
        "attached_table": state.get("attached_table"),  # Pass through (safe access)
        "vector_list": [],  # Will be populated by parse_vectors_node
        "output_json_list": [], # Will be populated by exoplanet_detection_node
        "transcribed_response": None  # Will be populated by json_transcription_node
    }
    
    # Run the pipeline
    pipeline_result = exoplanet_pipeline.invoke(pipeline_input)
    
    # Add AI response to messages and convert PipelineState → MainState
    return {
        "messages": [AIMessage(content=pipeline_result["transcribed_response"])],
        "response": pipeline_result["transcribed_response"]
    }

# Router node
def routing_logic(state: MainWorkflowState) -> str:
    """Determine next node based on routing decision boolean"""
    
    routing_decision = state.get("routing_decision", False)
    
    # True -> exoplanet pipeline, False -> conversation
    return "exoplanet_detection" if routing_decision else "conversation"

# Graph Builder
workflow_builder = StateGraph(MainWorkflowState)

# Nodes
workflow_builder.add_node("routing", routing_node)
workflow_builder.add_node("conversation", conversation_node)
workflow_builder.add_node("exoplanet_detection", exoplanet_pipeline_node)

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
workflow_builder.add_edge("exoplanet_detection", END)
workflow_builder.add_edge("conversation", END)

main_workflow = workflow_builder.compile()

# For persistent memory across sessions (uncomment to enable)
# from langgraph.checkpoint.memory import MemorySaver
# memory = MemorySaver()
# main_workflow = workflow_builder.compile(checkpointer=memory)

# # Invoke with thread_id for persistence
# config = {"configurable": {"thread_id": "user-123"}}
# result = main_workflow.invoke(initial_state, config=config)