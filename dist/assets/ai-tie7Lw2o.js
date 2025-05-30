var t,e,n,s,o,i;(e=t||(t={})).STRING="STRING",e.NUMBER="NUMBER",e.INTEGER="INTEGER",e.BOOLEAN="BOOLEAN",e.ARRAY="ARRAY",e.OBJECT="OBJECT",(s=n||(n={})).LANGUAGE_UNSPECIFIED="language_unspecified",s.PYTHON="python",(i=o||(o={})).OUTCOME_UNSPECIFIED="outcome_unspecified",i.OUTCOME_OK="outcome_ok",i.OUTCOME_FAILED="outcome_failed",i.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded";
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const a=["user","model","function","system"];var r,c,d,l,u,h,f,E,p,g,C,m,y,O;(c=r||(r={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",c.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",c.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",c.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",c.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",(l=d||(d={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",l.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",l.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",l.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",l.BLOCK_NONE="BLOCK_NONE",(h=u||(u={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",h.NEGLIGIBLE="NEGLIGIBLE",h.LOW="LOW",h.MEDIUM="MEDIUM",h.HIGH="HIGH",(E=f||(f={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",E.SAFETY="SAFETY",E.OTHER="OTHER",(g=p||(p={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",g.STOP="STOP",g.MAX_TOKENS="MAX_TOKENS",g.SAFETY="SAFETY",g.RECITATION="RECITATION",g.LANGUAGE="LANGUAGE",g.OTHER="OTHER",(m=C||(C={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",m.RETRIEVAL_QUERY="RETRIEVAL_QUERY",m.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",m.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",m.CLASSIFICATION="CLASSIFICATION",m.CLUSTERING="CLUSTERING",(O=y||(y={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",O.AUTO="AUTO",O.ANY="ANY",O.NONE="NONE";
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _ extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class v extends _{constructor(t,e){super(t),this.response=e}}class T extends _{constructor(t,e,n,s){super(t),this.status=e,this.statusText=n,this.errorDetails=s}}class I extends _{}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var R,N;(N=R||(R={})).GENERATE_CONTENT="generateContent",N.STREAM_GENERATE_CONTENT="streamGenerateContent",N.COUNT_TOKENS="countTokens",N.EMBED_CONTENT="embedContent",N.BATCH_EMBED_CONTENTS="batchEmbedContents";class A{constructor(t,e,n,s,o){this.model=t,this.task=e,this.apiKey=n,this.stream=s,this.requestOptions=o}toString(){var t,e;const n=(null===(t=this.requestOptions)||void 0===t?void 0:t.apiVersion)||"v1beta";let s=`${(null===(e=this.requestOptions)||void 0===e?void 0:e.baseUrl)||"https://generativelanguage.googleapis.com"}/${n}/${this.model}:${this.task}`;return this.stream&&(s+="?alt=sse"),s}}async function S(t){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",function(t){const e=[];return(null==t?void 0:t.apiClient)&&e.push(t.apiClient),e.push("genai-js/0.15.0"),e.join(" ")}(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let s=null===(e=t.requestOptions)||void 0===e?void 0:e.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new I(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(const[t,e]of s.entries()){if("x-goog-api-key"===t)throw new I(`Cannot set reserved header name ${t}`);if("x-goog-api-client"===t)throw new I(`Header name ${t} can only be set using the apiClient field`);n.append(t,e)}}return n}async function w(t,e,n,s,o,i,a=fetch){const{url:r,fetchOptions:c}=await async function(t,e,n,s,o,i){const a=new A(t,e,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},b(i)),{method:"POST",headers:await S(a),body:o})}}(t,e,n,s,o,i);return async function(t,e,n=fetch){let s;try{s=await n(t,e)}catch(o){!function(t,e){let n=t;t instanceof T||t instanceof I||(n=new _(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack);throw n}(o,t)}s.ok||await async function(t,e){let n,s="";try{const e=await t.json();s=e.error.message,e.error.details&&(s+=` ${JSON.stringify(e.error.details)}`,n=e.error.details)}catch(o){}throw new T(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${s}`,t.status,t.statusText,n)}(s,t);return s}(r,c,a)}function b(t){const e={};if((null==t?void 0:t.timeout)>=0){const n=new AbortController,s=n.signal;setTimeout((()=>n.abort()),t.timeout),e.signal=s}return e}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),H(t.candidates[0]))throw new v(`${D(t)}`,t);return function(t){var e,n,s,o;const i=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(const a of null===(o=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```python\n"+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}(t)}if(t.promptFeedback)throw new v(`Text not available. ${D(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),H(t.candidates[0]))throw new v(`${D(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),x(t)[0]}if(t.promptFeedback)throw new v(`Function call not available. ${D(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),H(t.candidates[0]))throw new v(`${D(t)}`,t);return x(t)}if(t.promptFeedback)throw new v(`Function call not available. ${D(t)}`,t)},t}function x(t){var e,n,s,o;const i=[];if(null===(n=null===(e=t.candidates)||void 0===e?void 0:e[0].content)||void 0===n?void 0:n.parts)for(const a of null===(o=null===(s=t.candidates)||void 0===s?void 0:s[0].content)||void 0===o?void 0:o.parts)a.functionCall&&i.push(a.functionCall);return i.length>0?i:void 0}const L=[p.RECITATION,p.SAFETY,p.LANGUAGE];function H(t){return!!t.finishReason&&L.includes(t.finishReason)}function D(t){var e,n,s;let o="";if(t.candidates&&0!==t.candidates.length||!t.promptFeedback){if(null===(s=t.candidates)||void 0===s?void 0:s[0]){const e=t.candidates[0];H(e)&&(o+=`Candidate was blocked due to ${e.finishReason}`,e.finishMessage&&(o+=`: ${e.finishMessage}`))}}else o+="Response was blocked",(null===(e=t.promptFeedback)||void 0===e?void 0:e.blockReason)&&(o+=` due to ${t.promptFeedback.blockReason}`),(null===(n=t.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(o+=`: ${t.promptFeedback.blockReasonMessage}`);return o}function G(t){return this instanceof G?(this.v=t,this):new G(t)}function U(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,o=n.apply(t,e||[]),i=[];return s={},a("next"),a("throw"),a("return"),s[Symbol.asyncIterator]=function(){return this},s;function a(t){o[t]&&(s[t]=function(e){return new Promise((function(n,s){i.push([t,e,n,s])>1||r(t,e)}))})}function r(t,e){try{(n=o[t](e)).value instanceof G?Promise.resolve(n.value.v).then(c,d):l(i[0][2],n)}catch(s){l(i[0][3],s)}var n}function c(t){r("next",t)}function d(t){r("throw",t)}function l(t,e){t(e),i.shift(),i.length&&r(i[0][0],i[0][1])}}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const F=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function P(t){const e=function(t){const e=t.getReader();return new ReadableStream({start(t){let n="";return s();function s(){return e.read().then((({value:e,done:o})=>{if(o)return n.trim()?void t.error(new _("Failed to parse stream")):void t.close();n+=e;let i,a=n.match(F);for(;a;){try{i=JSON.parse(a[1])}catch(r){return void t.error(new _(`Error parsing JSON response: "${a[1]}"`))}t.enqueue(i),n=n.substring(a[0].length),a=n.match(F)}return s()}))}}})}(t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))),[n,s]=e.tee();return{stream:B(n),response:$(s)}}async function $(t){const e=[],n=t.getReader();for(;;){const{done:t,value:s}=await n.read();if(t)return M(K(e));e.push(s)}}function B(t){return U(this,arguments,(function*(){const e=t.getReader();for(;;){const{value:t,done:n}=yield G(e.read());if(n)break;yield yield G(M(t))}}))}function K(t){const e=t[t.length-1],n={promptFeedback:null==e?void 0:e.promptFeedback};for(const s of t){if(s.candidates)for(const t of s.candidates){const e=t.index;if(n.candidates||(n.candidates=[]),n.candidates[e]||(n.candidates[e]={index:t.index}),n.candidates[e].citationMetadata=t.citationMetadata,n.candidates[e].finishReason=t.finishReason,n.candidates[e].finishMessage=t.finishMessage,n.candidates[e].safetyRatings=t.safetyRatings,t.content&&t.content.parts){n.candidates[e].content||(n.candidates[e].content={role:t.content.role||"user",parts:[]});const s={};for(const o of t.content.parts)o.text&&(s.text=o.text),o.functionCall&&(s.functionCall=o.functionCall),o.executableCode&&(s.executableCode=o.executableCode),o.codeExecutionResult&&(s.codeExecutionResult=o.codeExecutionResult),0===Object.keys(s).length&&(s.text=""),n.candidates[e].content.parts.push(s)}}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Y(t,e,n,s){return P(await w(e,R.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s))}async function k(t,e,n,s){const o=await w(e,R.GENERATE_CONTENT,t,!1,JSON.stringify(n),s);return{response:M(await o.json())}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(t){if(null!=t)return"string"==typeof t?{role:"system",parts:[{text:t}]}:t.text?{role:"system",parts:[t]}:t.parts?t.role?t:{role:"system",parts:t.parts}:void 0}function j(t){let e=[];if("string"==typeof t)e=[{text:t}];else for(const n of t)"string"==typeof n?e.push({text:n}):e.push(n);return function(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,o=!1;for(const i of t)"functionResponse"in i?(n.parts.push(i),o=!0):(e.parts.push(i),s=!0);if(s&&o)throw new _("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new _("No content is provided for sending chat message.");if(s)return e;return n}(e)}function J(t){let e;if(t.contents)e=t;else{e={contents:[j(t)]}}return t.systemInstruction&&(e.systemInstruction=q(t.systemInstruction)),e}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const V=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],X={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const W="SILENT_ERROR";class Q{constructor(t,e,n,s){this.model=e,this.params=n,this.requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,(null==n?void 0:n.history)&&(!function(t){let e=!1;for(const n of t){const{role:t,parts:s}=n;if(!e&&"user"!==t)throw new _(`First content should be with role 'user', got ${t}`);if(!a.includes(t))throw new _(`Each item should include role field. Got ${t} but valid roles are: ${JSON.stringify(a)}`);if(!Array.isArray(s))throw new _("Content should have 'parts' property with an array of Parts");if(0===s.length)throw new _("Each Content should have at least one part");const o={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const e of s)for(const t of V)t in e&&(o[t]+=1);const i=X[t];for(const e of V)if(!i.includes(e)&&o[e]>0)throw new _(`Content with role '${t}' can't contain '${e}' part`);e=!0}}(n.history),this._history=n.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t){var e,n,s,o,i,a;await this._sendPromise;const r=j(t),c={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(o=this.params)||void 0===o?void 0:o.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,r]};let d;return this._sendPromise=this._sendPromise.then((()=>k(this._apiKey,this.model,c,this.requestOptions))).then((t=>{var e;if(t.response.candidates&&t.response.candidates.length>0){this._history.push(r);const n=Object.assign({parts:[],role:"model"},null===(e=t.response.candidates)||void 0===e?void 0:e[0].content);this._history.push(n)}else{const e=D(t.response);e&&console.warn(`sendMessage() was unsuccessful. ${e}. Inspect response object for details.`)}d=t})),await this._sendPromise,d}async sendMessageStream(t){var e,n,s,o,i,a;await this._sendPromise;const r=j(t),c={safetySettings:null===(e=this.params)||void 0===e?void 0:e.safetySettings,generationConfig:null===(n=this.params)||void 0===n?void 0:n.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(o=this.params)||void 0===o?void 0:o.toolConfig,systemInstruction:null===(i=this.params)||void 0===i?void 0:i.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,r]},d=Y(this._apiKey,this.model,c,this.requestOptions);return this._sendPromise=this._sendPromise.then((()=>d)).catch((t=>{throw new Error(W)})).then((t=>t.response)).then((t=>{if(t.candidates&&t.candidates.length>0){this._history.push(r);const e=Object.assign({},t.candidates[0].content);e.role||(e.role="model"),this._history.push(e)}else{const e=D(t);e&&console.warn(`sendMessageStream() was unsuccessful. ${e}. Inspect response object for details.`)}})).catch((t=>{t.message!==W&&console.error(t)})),d}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class z{constructor(t,e,n){this.apiKey=t,e.model.includes("/")?this.model=e.model:this.model=`models/${e.model}`,this.generationConfig=e.generationConfig||{},this.safetySettings=e.safetySettings||[],this.tools=e.tools,this.toolConfig=e.toolConfig,this.systemInstruction=q(e.systemInstruction),this.cachedContent=e.cachedContent,this.requestOptions=n||{}}async generateContent(t){var e;const n=J(t);return k(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},n),this.requestOptions)}async generateContentStream(t){var e;const n=J(t);return Y(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},n),this.requestOptions)}startChat(t){var e;return new Q(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(e=this.cachedContent)||void 0===e?void 0:e.name},t),this.requestOptions)}async countTokens(t){const e=function(t,e){var n;let s={model:null==e?void 0:e.model,generationConfig:null==e?void 0:e.generationConfig,safetySettings:null==e?void 0:e.safetySettings,tools:null==e?void 0:e.tools,toolConfig:null==e?void 0:e.toolConfig,systemInstruction:null==e?void 0:e.systemInstruction,cachedContent:null===(n=null==e?void 0:e.cachedContent)||void 0===n?void 0:n.name,contents:[]};const o=null!=t.generateContentRequest;if(t.contents){if(o)throw new I("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=t.contents}else if(o)s=Object.assign(Object.assign({},s),t.generateContentRequest);else{const e=j(t);s.contents=[e]}return{generateContentRequest:s}}(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent});return async function(t,e,n,s){return(await w(e,R.COUNT_TOKENS,t,!1,JSON.stringify(n),s)).json()}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this.apiKey,this.model,e,this.requestOptions)}async embedContent(t){const e=function(t){if("string"==typeof t||Array.isArray(t))return{content:j(t)};return t}(t);return async function(t,e,n,s){return(await w(e,R.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}(this.apiKey,this.model,e,this.requestOptions)}async batchEmbedContents(t){return async function(t,e,n,s){const o=n.requests.map((t=>Object.assign(Object.assign({},t),{model:e})));return(await w(e,R.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:o}),s)).json()}(this.apiKey,this.model,t,this.requestOptions)}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(t){this.apiKey=t}getGenerativeModel(t,e){if(!t.model)throw new _("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new z(this.apiKey,t,e)}getGenerativeModelFromCachedContent(t,e){if(!t.name)throw new I("Cached content must contain a `name` field.");if(!t.model)throw new I("Cached content must contain a `model` field.");const n={model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t};return new z(this.apiKey,n,e)}}export{Z as G,d as H,r as a};
//# sourceMappingURL=ai-tie7Lw2o.js.map
