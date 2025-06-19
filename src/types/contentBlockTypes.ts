// Types for content blocks used in AI services and rendering

export interface RawContentBlockDelta {
  id?: string;
  type?: string;
  text?: string;
  [key: string]: any; // Allow additional properties
}

export interface InputJSONDelta {
  id?: string;
  type?: string;
  text?: string;
  [key: string]: any; // Allow additional properties
}
