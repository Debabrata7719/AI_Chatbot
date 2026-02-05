from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

template = """
Here is the conversation history: {context}

Question: {question}

Answer:
"""

prompt = PromptTemplate.from_template(template)

model = OllamaLLM(model="phi")
chain = prompt | model

context = ""   # global memory


def get_bot_response(user_input: str) -> str:
    global context

    if user_input is None:
        return "Please send a message."

    user_text = str(user_input).strip()
    if not user_text:
        return "Please send a message."

    user_text_lower = user_text.lower()
    if "your name" in user_text_lower or "who are you" in user_text_lower:
        return "My name is DebAI, your personal AI assistant!"
    if "who made you " in user_text_lower or "who created you" in user_text_lower:
        return "Debabrata is my owner !"
    result = chain.invoke({"context": context, "question": user_text})
    bot_response = result.content if hasattr(result, "content") else str(result)

    context += f"\nUser: {user_text}\nDebAI: {bot_response}"

    return bot_response
