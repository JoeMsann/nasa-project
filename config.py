import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from gradio_client import Client

class Config:
    """
    Configuration class to hold API keys and other parameters.
    """
    def __init__(self):
        """
        Initializes the configuration by loading environment variables and LLM models.
        """
        load_dotenv()
        self.groq_api_key: str = os.getenv("GROQ_API_KEY")
        self.langsmith_api_key: str = os.getenv("LANGSMITH_API_KEY")
        self.hf_token: str = os.getenv("HF_TOKEN")
        
        # Initialize models
        # Routing - GPT OSS 20b
        self.routing_model = ChatGroq(
            model="openai/gpt-oss-20b",
            api_key=self.groq_api_key
        )

        # Exoplanet Detection Model
        self.exoplanet_detection_model = Client("chadiawar977/Nasa_space" , self.hf_token)

        # Conversation - Kimi K2 Instruct
        self.conversation_model = ChatGroq(
            model="moonshotai/kimi-k2-instruct-0905",
            temperature=1,
            api_key=self.groq_api_key
        )
       
        # Reasoning - GPT OSS 120b
        self.reasoning_model = ChatGroq(
            model="openai/gpt-oss-120b",
            temperature=0,
            api_key=self.groq_api_key
        )

app_config = Config()