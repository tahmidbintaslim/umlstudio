import { encode, decode } from "plantuml-encoder";

export type Format = "svg" | "png" | "txt";

export const PLANTUML_SERVER = (
  process.env.NEXT_PUBLIC_PLANTUML_SERVER || "https://www.plantuml.com/plantuml"
).replace(/\/$/, "");

export const encodeUml = (src: string) => encode(src);
export const decodeUml = (enc: string) => decode(enc);
export const renderUrl = (src: string, format: Format) =>
  `${PLANTUML_SERVER}/${format}/${encode(src)}`;
