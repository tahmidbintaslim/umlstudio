import { StreamLanguage } from "@codemirror/language";

// Lightweight PlantUML highlighter: directives, keywords, strings, colors, arrows, comments.
const KEYWORDS = new Set(
  ("actor participant boundary control entity database collections queue usecase class interface abstract enum " +
    "annotation package namespace node folder frame cloud component rectangle note end title skin skinparam as of " +
    "left right top bottom over activate deactivate destroy alt else opt loop par break critical group ref box " +
    "if then elseif endif while endwhile repeat fork start stop return state autonumber hide show header footer " +
    "legend endlegend newpage direction to project starts lasts happens at")
    .split(" "),
);

export const plantuml = StreamLanguage.define<{ inBlockComment: boolean }>({
  name: "plantuml",
  startState: () => ({ inBlockComment: false }),
  token(stream, state) {
    if (state.inBlockComment) {
      if (stream.skipTo("'/")) { stream.match("'/"); state.inBlockComment = false; } else stream.skipToEnd();
      return "comment";
    }
    if (stream.match("/'")) { state.inBlockComment = true; return "comment"; }
    if (stream.sol() && stream.match(/^\s*'.*/)) return "comment";
    if (stream.match(/^@\w+/)) return "meta";
    if (stream.match(/^!\w+/)) return "processingInstruction";
    if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) return "string";
    if (stream.match(/^#[\w]+/)) return "atom";
    if (stream.match(/^[-.=<>|*o\\/[\]#]{2,}/)) return "operator";
    if (stream.match(/^:/)) { stream.skipToEnd(); return "string"; } // message labels
    if (stream.match(/^\w+/)) return KEYWORDS.has(stream.current().toLowerCase()) ? "keyword" : "variableName";
    stream.next();
    return null;
  },
  languageData: { commentTokens: { line: "'" } },
});
