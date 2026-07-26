import { ChatGroq } from "@langchain/groq";
import { vectorStore } from "../utils/upload.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

export const AiAgent = async (req, res) => {
  const { input } = req.body;

  const docs = await vectorStore.similaritySearch(input, 3);

  const context = docs.map((d) => d.pageContent).join("\n\n");

  try {
    const response = await llm.invoke([
      new SystemMessage(`You are Zahoor Ahmad's personal AI assistant.

You are friendly, professional, and conversational.

RULES:

1. If the user greets you (hello, hi, hey, good morning, etc.), greet them naturally.

2. If the user asks casual conversation like:
- How are you?
- Thanks
- Bye
respond naturally.

3. Assume every question is about Zahoor Ahmad unless another person is mentioned.

4. Use ONLY the retrieved context when answering questions about Zahoor Ahmad.

5. If the answer is not available in the retrieved context, reply:

"I couldn't find that information about Zahoor Ahmad."

6. Never invent information.

Context:
${context}`),
      new HumanMessage(input),
    ]);
    return res.status(200).json({
      ai: response.content,
    });
  } catch (error) {
    console.log(error);
  }
};
