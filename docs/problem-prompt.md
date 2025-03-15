Background: I have this Chat component. It is meant to interact with a LLM. When it opens,
- it shows up a greeting. 
- User enter a prompt (we will refer to as userQuery). 
- This goes to the backend.
- The backend runs a pipeline for prompt optimization. 
- For each step, it should stream back through websocket to the client. 

Current Behavior: 
Both the userQuery and the bot reply gets updated with streamed data. Gibberish data is also being streamed back. 

Expected behavior: 
The client should now see a new bubble, being updated with the current step, so it looks like something is happening. 
When the pipeline finishes and the final response is streamed, it should be streamed on the client side as the chat response, in a single bubble. Only the answer is to be streamed.

Task:
- in portfolio.next
  - analyze @/component/Chat
  - analyze @/hooks/useWebSocketChat
  - analyze @/context/ChatContext
- in portfolio.node
  - analyze .src/services/wsChatService
  - analyze .src/services/pipelineService
  - analyze .src/services/ollamaService
  - analyze .src/services/llmService
  - analyze .src/services/embeddingService
  - analyze .src/services/dataFetcherService
  - analyze .src/utils/generatePrompt.js
  - analyze .src/utils/queryUtils.js
  - analyze .src/utils/prompts.js

You should get a full understanding of the e2e process. Then, you should be able to fix the issue so it works with the expected behaviour.

My suspicion is that generateResponse and generateResponseStream are misused. generateResponse should support a format parameter (json or text) so that when we do the final query, we can ask to stream pure text. The pipeline should return the format as part of the response. The frontend should behave differently on the type.

Specific rules:
- If you change something on the backend, you need to consider the other scripts that use the functions you change. There can be no orphan scripts, they should still all work.

Suggested changes:
- in generateResponseStream function : always enfore the "json" format too. Wrap the prompt with necessary instructions so we get a response in a static format : { "data" : string, end: boolean, newParagraph : boolean} . 
  - "end" is false until streaming is complete, then it is true. 
  - "newParagraph" is true when a new paragraph is starting, otherwise is false. 
  - "data" contains the streamed data (the LLM response). 
- in wsChatService, the client opens the connection, and rely on the received data to determine wheter to
a) update the last "ai" entry
b) add a new entry based on the "newParagraph" property 
c) response ends when "end" is true