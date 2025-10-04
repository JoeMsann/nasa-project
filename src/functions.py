import re
from typing import List, Optional, Tuple
from config import app_config

def parse_vector(input_string: str) -> Tuple[Optional[List[float]], Optional[str]]:
    """
    Parse and validate a 121-element vector from user input.
    
    Args:
        input_string: String containing numbers separated by commas, spaces, or other delimiters
        
    Returns:
        Tuple of (vector, error_message)
        - If successful: (list of 121 floats, None)
        - If failed: (None, error description)
    """
    try:
        # Extract all numbers (including decimals and scientific notation) from the input string
        # This regex matches integers, floats, and scientific notation (e.g., 1, 1.0, 0.5, .5, 2.45e+06, 2.23e-02)
        number_pattern = r'-?\d*\.?\d+(?:[eE][+-]?\d+)?'
        matches = re.findall(number_pattern, input_string)
        
        if not matches:
            return None, "No numbers found in input string"
        
        # Convert to floats
        vector = []
        for match in matches:
            try:
                num = float(match)
                vector.append(num)
            except ValueError:
                return None, f"Invalid number format: '{match}'"
        
        return vector, None
        
    except Exception as e:
        return None, f"Unexpected error during parsing: {str(e)}"

def format_vector(vector: List[float]) -> str:
    """
    Format a vector into the standard string format.
    
    Args:
        vector: List of floats
        
    Returns:
        Comma-separated string representation
    """
    return ", ".join(str(v) for v in vector)

def clean_query(input_string: str, verbose: bool = True) -> Optional[str]:
    """
    Main function to clean and validate vector input.
    
    Args:
        input_string: Raw user input containing vector data
        verbose: If True, print error messages
        
    Returns:
        Formatted vector string if successful, None otherwise
    """
    vector, error = parse_vector(input_string)
    
    if error:
        if verbose:
            print(f"Error: {error}")
        return None
    
    return format_vector(vector)

def choose_model(vector_str: str):
    """Choose the appropriate model based on vector size"""
    vector_length = len(vector_str.split(','))

    if vector_length == app_config.kepler.vector_size:
        return app_config.kepler
    elif vector_length == app_config.k2.vector_size:
        return app_config.k2
    else:
        # Return error info for unsupported vector size
        return {
            "error": f"Unsupported vector size: {vector_length}. Expected {app_config.kepler.vector_size} or {app_config.k2.vector_size}",
            "success": False
        }