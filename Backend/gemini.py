import os
import sys
import google.generativeai as genai

sys.stdout.reconfigure(encoding='utf-8')

def main():
    try:
        api_key = "AIzaSyC43LyfCCqUbguduQWi7c4EmAk6GFs0flw"
        genai.configure(api_key=api_key)

        if len(sys.argv) < 2:
            raise ValueError("No input data provided")

        user_input = sys.argv[1]

        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
        )

        chat_session = model.start_chat(history=[])

        response = chat_session.send_message(user_input)
        clean_response = response.text.replace('*', '')

        print(clean_response)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
