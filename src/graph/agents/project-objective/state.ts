import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export interface LinkedDocument {
  url: string;
  content: string;
  resolvedAt: Date;
}

export const ProjectObjectiveAnnotation = Annotation.Root({
  repoPath: Annotation<string>,

  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  errors: Annotation<string[]>({
    reducer: (current: string[], next: string[]) => [...current, ...next],
    default: () => [],
  }),

  readmeContent: Annotation<string | null>({
    reducer: (_current: string | null, next: string | null) => next,
    default: () => null,
  }),

  linkedDocuments: Annotation<LinkedDocument[]>({
    reducer: (current: LinkedDocument[], next: LinkedDocument[]) => [...current, ...next],
    default: () => [],
  }),

  projectObjective: Annotation<string | null>({
    reducer: (_current: string | null, next: string | null) => next,
    default: () => null,
  }),

  businessArea: Annotation<string | null>({
    reducer: (_current: string | null, next: string | null) => next,
    default: () => null,
  }),
});

export type ProjectObjectiveState = typeof ProjectObjectiveAnnotation.State;
