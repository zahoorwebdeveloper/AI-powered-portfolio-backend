import { Annotation } from '@langchain/langgraph'
const State = Annotation.Root({
    prompt:Annotation,
    AiMsg:Annotation
})

export default State