import operator
from config import app_config
from langgraph.graph import StateGraph, START, END
from typing_extensions import Annotated, TypedDict
from langchain_core.prompts import ChatPromptTemplate
from exoplanet_pipeline_subgraph import exoplanet_pipeline

# Initializing models
router = app_config.routing_model
conversation_agent = app_config.conversation_model

# Prompt Templates
conversation_prompt = ChatPromptTemplate.from_messages([
    ("system", ""),
    ("user", "{user_input}")
])
conversation_chain = conversation_prompt | conversation_agent

# General Graph State
class MainWorkflowState(TypedDict):
    messages: Annotated[list, operator.add] # Accumulated messages (short term memory)
    user_input: str # Raw user input
    attached_table: str | None # Optional uploaded table containing vectors
    response: str # Final response to user

# Nodes logic
def routing_node(state: MainWorkflowState) -> MainWorkflowState:
    pass

# Conversation node
def conversation_node(state: MainWorkflowState) -> MainWorkflowState:
    """Handle conversational queries"""    
    response = conversation_chain.invoke({"user_input": state["user_input"]})
    state["response"] = response.content
    return state

# Exoplanet Detection Pipeline node
def exoplanet_pipeline_node(state: MainWorkflowState) -> MainWorkflowState:
    """Wrapper that converts MainState ↔ ExoplanetPipelineState"""
    
    # Convert MainState → PipelineState
    pipeline_input = {
        "user_input": state["user_input"], # Pass through
        "attached_table": state["attached_table"],  # Pass through
        "vector_list": [],  # Will be populated by parse_vectors_node
        "output_json_list": [], # Will be populated by exoplanet_detection_node
        "transcribed_response": None  # Will be populated by json_transcription_node
    }
    
    # Run the pipeline
    pipeline_result = exoplanet_pipeline.invoke(pipeline_input)
    
    # Convert PipelineState → MainState
    return {
        "response": pipeline_result["transcribed_response"]
    }

# Router node
def routing_logic(state: MainWorkflowState) -> str:
    """Determine which pathway to take based on input"""
    from functions import parse_vector
    import pandas as pd
    import io

    user_input = state.get("user_input", "")
    attached_table = state.get("attached_table")

    # Check if there's vector data (either in input or CSV)
    has_vector_data = False

    # Check for CSV data
    if attached_table:
        try:
            df = pd.read_csv(io.StringIO(attached_table))
            if len(df.columns) == 122:  # Check if it looks like vector data
                has_vector_data = True
        except:
            pass

    # Check for vector in user input
    if user_input:
        vector, error = parse_vector(user_input)
        if vector is not None:
            has_vector_data = True

    # Return routing decision
    return "exoplanet_detection" if has_vector_data else "conversation"

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

# Compiled Graph
# from langgraph.checkpoint.memory import MemorySaver
# memory = MemorySaver()
# main_workflow = workflow_builder.compile(checkpointer=memory)

# # Invoke with thread_id for persistence
# config = {"configurable": {"thread_id": "user-123"}}
# result = main_workflow.invoke(initial_state, config=config)