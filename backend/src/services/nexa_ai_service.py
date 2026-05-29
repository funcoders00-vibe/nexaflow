from openai import OpenAI
import os
import json
from typing import List, Dict, Any

class NexaAIService:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY", "")
        self.is_mock = not self.api_key or self.api_key == "mock_nvidia_api_key"
        
        if not self.is_mock:
            self.client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=self.api_key
            )
        else:
            self.client = None

    def _call_llm(self, messages: List[Dict[str, str]], temperature: float = 0.2, top_p: float = 0.7) -> str:
        """Invokes Llama-3.1-70B model or falls back to mock rules."""
        if self.is_mock:
            return self._generate_mock_completion(messages)

        try:
            completion = self.client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=messages,
                temperature=temperature,
                top_p=top_p,
                max_tokens=1024,
                stream=False
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"[NexaAIService] NVIDIA LLM API error: {e}. Falling back to mock engine.")
            return self._generate_mock_completion(messages)

    def generate_chat_response(self, user_query: str, context_hits: List[Dict[str, Any]], history: List[Dict[str, str]]) -> Dict[str, Any]:
        """Runs the conversation with context and history inputs."""
        # 1. Format dynamic context docs
        context_str = ""
        sources = []
        
        for idx, hit in enumerate(context_hits):
            entity_type = hit.get("type", "Info")
            name = hit.get("name") or hit.get("project") or hit.get("client") or "Record"
            score = hit.get("search_score", 1.0)
            text_content = hit.get("text_content", "")
            
            context_str += f"[{idx+1}] {text_content}\n"
            sources.append({
                "type": entity_type,
                "name": name,
                "score": round(score, 4)
            })

        if not context_str:
            context_str = "No specific database context matching this query was found."

        # 2. Build prompts
        system_prompt = (
            "You are NexaFlow AI Assistant, a premium, intelligent corporate operational copilot for the NexaFlow SaaS Dashboard.\n"
            "You help managers, administrators, and developers analyze projects, client statuses, finances/payments, task completion rates, and team productivity.\n\n"
            "Here is the retrieved context from the organization's database matching the user's inquiry:\n"
            "---------------------\n"
            f"{context_str}\n"
            "---------------------\n\n"
            "Guidelines:\n"
            "1. Speak in a helpful, analytical, and professional tone.\n"
            "2. Structure your replies beautifully. Use markdown headings, lists, bold text, or markdown tables for lists of payments, tasks, budgets or employee stats.\n"
            "3. Use the context provided above to answer the user's questions. State facts exactly. If the context does not contain the answer, answer based on general knowledge or politely guide the user on how they can input/onboard clients/projects in the dashboard.\n"
            "4. Keep your responses precise, executive, and structured.\n"
        )

        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add current query
        messages.append({"role": "user", "content": user_query})

        # 3. Call LLM
        reply = self._call_llm(messages)
        
        return {
            "response": reply,
            "sources": sources
        }

    def generate_session_title(self, first_query: str) -> str:
        """Generates a brief 3-5 word title for a chat thread based on the first message."""
        if self.is_mock:
            words = first_query.split()
            return " ".join(words[:4]) + ("..." if len(words) > 4 else "")
            
        try:
            prompt = (
                "Create a brief 3-5 word title summarizing the following query. Do NOT use quotes or any markdown tags. "
                f"Query: {first_query}"
            )
            completion = self.client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[
                    {"role": "system", "content": "You are a brief title generation assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=20
            )
            title = completion.choices[0].message.content.strip()
            # Clean up if assistant put quotes around it
            if title.startswith('"') and title.endswith('"'):
                title = title[1:-1]
            return title
        except Exception:
            words = first_query.split()
            return " ".join(words[:4]) + ("..." if len(words) > 4 else "")

    def _generate_mock_completion(self, messages: List[Dict[str, str]]) -> str:
        """Fallback mock generator matching keywords against retrieved context inside system prompt."""
        # Find the system prompt containing the context docs
        system_msg = next((msg["content"] for msg in messages if msg["role"] == "system"), "")
        user_msg = messages[-1]["content"].lower()

        # Parse context lines
        context_lines = []
        if "---------------------" in system_msg:
            try:
                raw_ctx = system_msg.split("---------------------")[1].split("---------------------")[0].strip()
                context_lines = [line.strip() for line in raw_ctx.split("\n") if line.strip()]
            except Exception:
                pass

        if "revenue" in user_msg or "finance" in user_msg or "payment" in user_msg or "budget" in user_msg:
            # Filter payment docs
            payment_docs = [l for l in context_lines if "Payment" in l or "Project" in l]
            if payment_docs:
                doc_list = "\n".join([f"- {d}" for d in payment_docs])
                return (
                    "### NexaFlow Financial Overview (RAG Simulated Output)\n\n"
                    "Based on retrieved financial logs, here are the matching records:\n\n"
                    f"{doc_list}\n\n"
                    "Let me know if you would like me to calculate total project budgets or project payments."
                )
            return "No financial matching logs found. Please use the **Finances** dashboard section to record payments."

        elif "employee" in user_msg or "team" in user_msg or "productivity" in user_msg or "salary" in user_msg:
            emp_docs = [l for l in context_lines if "Employee" in l]
            if emp_docs:
                doc_list = "\n".join([f"- {d}" for d in emp_docs])
                return (
                    "### Team Productivity & Allocation (RAG Simulated Output)\n\n"
                    "I retrieved the following employee record details:\n\n"
                    f"{doc_list}\n\n"
                    "Let me know if you need productivity optimizations or performance recommendations."
                )
            return "I couldn't locate any employee records in the matching context. You can view them in the database logs."

        elif "task" in user_msg or "status" in user_msg or "active" in user_msg or "project" in user_msg:
            proj_docs = [l for l in context_lines if "Project" in l or "Task" in l]
            if proj_docs:
                doc_list = "\n".join([f"- {d}" for d in proj_docs])
                return (
                    "### Project Tracking & Task Status (RAG Simulated Output)\n\n"
                    "Here is the active project and task status breakdown matching your search:\n\n"
                    f"{doc_list}\n\n"
                    "I recommend updating deadlines via the **Tasks** or **Projects** modules to synchronize task pipelines."
                )
            return "No matching projects or tasks were found in the search context. Onboard projects to see real-time updates."

        return (
            "### Hello! I am your NexaFlow Assistant\n\n"
            "I'm equipped with **RAG Knowledge Base** indexing and **Session Chat Memory**.\n\n"
            "I can help you monitor team productivity, compile financial revenue breakdowns, track project pipelines, and summarize tasks.\n\n"
            "Here is the current context I've retrieved:\n" + 
            ("\n".join([f"- {d}" for d in context_lines[:3]]) if context_lines else "None") + 
            "\n\nHow can I help you today?"
        )
