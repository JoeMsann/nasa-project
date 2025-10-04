import re
from typing import List, Optional, Tuple

def parse_vector(input_string: str) -> Tuple[Optional[List[float]], Optional[str]]:
    """
    Parse and validate a 122-element vector from user input.
    
    Args:
        input_string: String containing numbers separated by commas, spaces, or other delimiters
        
    Returns:
        Tuple of (vector, error_message)
        - If successful: (list of 122 floats, None)
        - If failed: (None, error description)
    """
    try:
        # Extract all numbers (including decimals) from the input string
        # This regex matches integers and floats (e.g., 1, 1.0, 0.5, .5)
        number_pattern = r'-?\d*\.?\d+'
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
        
        # Validate vector length
        if len(vector) != 122:
            return None, f"Vector length mismatch: expected 122, got {len(vector)}"
        
        # Validate range [0.0, 1.0]
        out_of_range = [i for i, v in enumerate(vector) if v < 0.0 or v > 1.0]
        if out_of_range:
            return None, f"Values out of range [0.0, 1.0] at indices: {out_of_range[:5]}{'...' if len(out_of_range) > 5 else ''}"
        
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

