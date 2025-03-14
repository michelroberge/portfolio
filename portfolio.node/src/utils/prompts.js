const DEFAULT_PROMPT = {
    "name": "prompt",
    "template": `You are an AI assistant. Please respond in JSON format. Here is the task: {userQuery}
    # CONTEXT
    {context}

    # RESPONSE FORMAT
    Provide a structured JSON object with:
    - "answer": A detailed response formatted in full paragraphs.
    `,
    "parameters": ["userquery", "context"]
};



const DEFAULT_INTENT_DETECTION = {
    "name": "intent-detection",
    "template": `Given the user query: \"{userQuery}\", classify the intent into one of the following categories: 
                 - 'project_search' (for looking up projects)
                 - 'blog_lookup' (for retrieving blog articles)
                 - 'general_knowledge' (for open-ended questions)
                 Return a JSON object with a single key 'intent' and its value.`,
    "metadata": { "type": "intent-classification" },
    "parameters": ["userquery"]
};

const DEFAULT_METADATA_EXTRACTION = {
    "name": "metadata-extraction",
    "template": `Analyze the user query: \"{userQuery}\" and extract structured metadata. 
                 Identify:
                 - 'category': One of ['projects', 'blogs', 'files', 'pages'] based on context.
                 - 'technologies': Extract technology-related terms.
                 - 'dates': Identify any dates in the query.
                 - 'namedEntities': Identify specific names (organizations, people, frameworks, etc.).
                 Return the result as a structured JSON object with properties category, technology, dates, namedEntities, as string arrays.
                 If there is not enough context, the expectation is to have all props with empty arrays []`,
    "metadata": { "type": "metadata-extraction" }
};

const defaultPrompts = {
    "prompt": DEFAULT_PROMPT,
    "intent-detection": DEFAULT_INTENT_DETECTION,
    "metadata-extraction": DEFAULT_METADATA_EXTRACTION,
    "chat-response": DEFAULT_PROMPT,
};

module.exports = defaultPrompts;
