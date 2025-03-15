Objective
Create a Chatbot that works with a LLM pipeline. The flow is 
1. Chatbot greets user (1st bubble)
2. User enters a prompt (2nd bubble)
3. Chatbot sends prompt to backend (3rd bubble with "...")
4. Backend runs a pipeline.
 - Each pipeline step is sent back to the chatbot (they are not stream, only complete answers, one per step)
 - Each pipeline entry replaces the last chatbot bubble (replace 3rd bubble content)
 - When the "final" response starts streaming, add a 4th bubble and stream response into that bubble.

 Constraints
 - use web sockets 
   - on client side, there is a partially working implementation in useWebSocket and ChatContext. You do not need to keep them, but use the same libraries.
   - on the server side, there is a partially working wsChatService that works with that client. Use the same libraries, but no need to keep the existing code. 
   - You can change the responses of the GenerateResponse and GenerateResponseStream if necessary.
   - You can change the pipelineService structure if necessary, but the pipeline steps should remain the same. 
   - The conversion of the userQuery to vector must remain and be the first step. 

User Experience
- Keep the existing look and feel of the chat interface.
- Make this a reusable component (i.e. I may want to use it in other places, not as a popup). 
Task
Create a Chatbot with the provided specifications that works, applying the existing rules of this workspace (SOLID & Clean architecture).