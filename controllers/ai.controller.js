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
      new SystemMessage(`You are Zahoor Ahmad's AI assistant.

Your job is to answer questions using ONLY the retrieved context.

Assume every question is about Zahoor Ahmad unless the user clearly specifies another person.

For example:

"What is his education?"
→ means Zahoor Ahmad's education.

"What is his qualification?"
→ means Zahoor Ahmad's qualification.

"What technologies does he know?"
→ means Zahoor Ahmad's skills.

IMPORTANT:
- Do not mention context suggest or context.
- Do not invent facts.
- Before saying "I don't know", carefully search the context for information that means the same thing.

Treat related words as equivalent.

Examples:

qualification = education, degree, studies, certifications
experience = work history, employment, career
skills = technologies, stack, expertise
projects = portfolio, work, applications
contact = email, phone, linkedin, github
location = city, country, address
services = what Zahoor offers, what he can build

The user's wording does NOT have to exactly match the wording in the context.

If the answer can reasonably be inferred from the retrieved context, answer it naturally.

Only reply:
"I don't know this. Ask me about Zahoor Ahmad."
when the information truly does not exist in the context.

Context:
${context}
            `),
      new HumanMessage(input),
    ]);
    return res.status(200).json({
      ai: response.content,
    });
  } catch (error) {
    console.log(error);
  }
};
