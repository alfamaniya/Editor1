// #javascript-parser.js: فایل javascript parser مربوط به بخش javascript پروژه
import {
  JAVASCRIPT_CONTEXTUAL_KEYWORDS, JAVASCRIPT_KEYWORDS, JAVASCRIPT_LITERAL_KEYWORDS,
  JAVASCRIPT_OPERATORS, JAVASCRIPT_REGEX_PREFIX_KEYWORDS, JAVASCRIPT_RESERVED_WORDS
} from "./javascript-rules.js";

function normalizeSource(value) {
  if (typeof value !== "string") throw new TypeError("JavaScript source must be a string.");
  return value.replace(/\r\n?/g, "\n");
}
function cp(source, index) { return String.fromCodePoint(source.codePointAt(index)); }
function isStart(source, index) {
  return index < source.length && /^[$_\p{ID_Start}]$/u.test(cp(source, index));
}
function isContinue(source, index) {
  return index < source.length && /^[$_\u200C\u200D\p{ID_Continue}]$/u.test(cp(source, index));
}
function readIdentifier(source, index) {
  let i = index;
  if (source[i] === "\\" && source[i + 1] === "u") {
    if (source[i + 2] === "{") {
      const close = source.indexOf("}", i + 3);
      if (close >= 0) i = close + 1;
    } else i = Math.min(source.length, i + 6);
  } else i += cp(source, i).length;
  while (i < source.length) {
    if (source[i] === "\\" && source[i + 1] === "u") {
      if (source[i + 2] === "{") {
        const close = source.indexOf("}", i + 3);
        if (close < 0) break;
        i = close + 1;
      } else i = Math.min(source.length, i + 6);
    } else if (isContinue(source, i)) i += cp(source, i).length;
    else break;
  }
  return i;
}
const NUMBER = /^(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*n?|0[bB][01](?:_?[01])*n?|0[oO][0-7](?:_?[0-7])*n?|(?:\d(?:_?\d)*)?\.?\d(?:_?\d)*(?:[eE][+-]?\d(?:_?\d)*)?n?)/;
const OPEN = new Map([["(",")"],["[","]"],["{","}"]]);
const CLOSE = new Map([[")","("],["]","["],["}","{"]]);
const TRIVIA = new Set(["whitespace","line-comment","block-comment","invalid-comment"]);
const isTrivia = token => TRIVIA.has(token.type);

function regexMayStart(previous) {
  if (!previous) return true;
  if (previous.type === "keyword" && JAVASCRIPT_REGEX_PREFIX_KEYWORDS.has(previous.value)) return true;
  if (["identifier","number","bigint","string","template","regex","literal","private-identifier"].includes(previous.type)) return false;
  return ![")","]","}","++","--"].includes(previous.value);
}
function scanQuoted(source, start, quote) {
  let i = start + 1, closed = false;
  while (i < source.length) {
    if (source[i] === "\\") { i += Math.min(2, source.length - i); continue; }
    if (source[i] === quote) { i++; closed = true; break; }
    if (source[i] === "\n") break;
    i++;
  }
  return { end: i, closed };
}
function scanTemplate(source, start) {
  let i = start + 1, closed = false;
  while (i < source.length) {
    if (source[i] === "\\") { i += Math.min(2, source.length - i); continue; }
    if (source[i] === "\`") { i++; closed = true; break; }
    i++;
  }
  return { end: i, closed };
}
function scanRegex(source, start) {
  let i = start + 1, inClass = false, closed = false;
  while (i < source.length && source[i] !== "\n") {
    if (source[i] === "\\") { i += Math.min(2, source.length - i); continue; }
    if (source[i] === "[") inClass = true;
    else if (source[i] === "]") inClass = false;
    else if (source[i] === "/" && !inClass) { i++; closed = true; break; }
    i++;
  }
  if (closed) while (i < source.length && isContinue(source, i)) i += cp(source, i).length;
  return { end: i, closed };
}

/** JavaScript tokenizer. Offsets are zero-based UTF-16 ranges. */
export function tokenizeJavaScript(input) {
  const source = normalizeSource(input), tokens = [];
  let i = 0, previous = null;
  const add = (type, start, end) => {
    const token = { type, start, end, value: source.slice(start, end) };
    tokens.push(token);
    if (!TRIVIA.has(type)) previous = token;
  };
  while (i < source.length) {
    const start = i, char = source[i];
    if (/\s/u.test(char)) {
      while (i < source.length && /\s/u.test(source[i])) i++;
      add("whitespace", start, i); continue;
    }
    if (source.startsWith("//", i)) {
      i += 2; while (i < source.length && source[i] !== "\n") i++;
      add("line-comment", start, i); continue;
    }
    if (source.startsWith("/*", i)) {
      const close = source.indexOf("*/", i + 2);
      i = close < 0 ? source.length : close + 2;
      add(close < 0 ? "invalid-comment" : "block-comment", start, i); continue;
    }
    if (char === "'" || char === '"') {
      const result = scanQuoted(source, i, char);
      i = result.end; add(result.closed ? "string" : "invalid-string", start, i); continue;
    }
    if (char === "\`") {
      const result = scanTemplate(source, i);
      i = result.end; add(result.closed ? "template" : "invalid-template", start, i); continue;
    }
    if (char === "/" && regexMayStart(previous) && source[i + 1] !== "=") {
      const result = scanRegex(source, i);
      if (result.closed) { i = result.end; add("regex", start, i); continue; }
    }
    if (char === "#" && isStart(source, i + 1)) {
      i = readIdentifier(source, i + 1); add("private-identifier", start, i); continue;
    }
    if ((char === "\\" && source[i + 1] === "u") || isStart(source, i)) {
      i = readIdentifier(source, i);
      const word = source.slice(start, i);
      const type = JAVASCRIPT_LITERAL_KEYWORDS.has(word) ? "literal"
        : JAVASCRIPT_KEYWORDS.has(word) ? "keyword"
        : JAVASCRIPT_RESERVED_WORDS.has(word) ? "reserved-word"
        : JAVASCRIPT_CONTEXTUAL_KEYWORDS.has(word) ? "contextual-keyword" : "identifier";
      add(type, start, i); continue;
    }
    const number = source.slice(i).match(NUMBER);
    if (number && number[0]) {
      i += number[0].length;
      add(number[0].endsWith("n") ? "bigint" : "number", start, i); continue;
    }
    if (source.startsWith("...", i)) { i += 3; add("operator", start, i); continue; }
    const operator = JAVASCRIPT_OPERATORS.find(item => source.startsWith(item, i));
    if (operator) { i += operator.length; add("operator", start, i); continue; }
    if ("{}()[];,.?:~".includes(char)) { i++; add("punctuator", start, i); continue; }
    if ("+-*/%=&|^!<>".includes(char)) { i++; add("operator", start, i); continue; }
    i++; add("invalid", start, i);
  }
  return tokens;
}

export class JavaScriptParser {
  parse(input, context = {}) {
    const source = normalizeSource(input);
    const tokens = tokenizeJavaScript(source);
    const sig = tokens.filter(token => !isTrivia(token));
    const errors = [], pairs = new Map(), stack = [];
    for (let i = 0; i < sig.length; i++) {
      const value = sig[i].value;
      if (OPEN.has(value)) stack.push({ value, index: i });
      else if (CLOSE.has(value)) {
        const top = stack[stack.length - 1];
        if (top && top.value === CLOSE.get(value)) {
          stack.pop(); pairs.set(top.index, i); pairs.set(i, top.index);
        } else errors.push({ code: "UNMATCHED_CLOSING_DELIMITER", message: "Closing delimiter has no matching opener.", start: sig[i].start, end: sig[i].end });
      }
    }
    for (const item of stack) errors.push({
      code: "UNCLOSED_DELIMITER", message: "Opening delimiter has no matching closer.",
      start: sig[item.index].start, end: sig[item.index].end
    });

    let i = 0;
    const cur = () => sig[i] || null;
    const is = value => cur()?.value === value;
    const raw = (a,b) => a < b ? source.slice(sig[a].start, sig[b - 1].end) : "";
    const make = (type,a,b,extra={}) => ({
      type, start: sig[a]?.start ?? source.length,
      end: b > a ? sig[b - 1].end : (sig[a]?.start ?? source.length), ...extra
    });
    const pair = opener => {
      if (!is(opener)) return null;
      const start = i, close = pairs.get(i);
      if (close === undefined) { i++; return { start, end:i, closed:false }; }
      i = close + 1; return { start, end:i, closed:true };
    };
    const hasNewline = (a,b) => source.slice(a.end,b.start).includes("\n");
    const canEnd = token => token && (
      ["identifier","private-identifier","number","bigint","string","template","regex","literal"].includes(token.type) ||
      [")","]","}","++","--"].includes(token.value)
    );
    const canStart = token => token && (
      ["identifier","private-identifier","number","bigint","string","template","regex","literal","keyword"].includes(token.type) ||
      ["{",";"].includes(token.value)
    );
    const consumeStatement = () => {
      const from = i;
      while (i < sig.length) {
        const token = cur(), prev = sig[i - 1];
        if (token.value === "}") break;
        if (token.value === ";") { i++; break; }
        if (prev && hasNewline(prev,token) && canEnd(prev) && canStart(token) &&
            !["else","catch","finally","while"].includes(token.value)) break;
        if (OPEN.has(token.value) && pairs.has(i)) { i = pairs.get(i) + 1; continue; }
        i++;
      }
      return { from, to:i };
    };
    const expression = (a,b) => make("Expression",a,b,{ raw:raw(a,b).replace(/;$/,"").trim() });

    const parseBlock = () => {
      const open = cur(), from = i++;
      const body = [];
      while (i < sig.length && !is("}")) {
        const before = i, statement = parseStatement();
        if (statement) body.push(statement);
        if (before === i) {
          const bad = cur(); i++;
          errors.push({ code:"PARSER_STALLED", message:"Parser skipped an unrecognized token.", start:bad.start, end:bad.end });
        }
      }
      if (is("}")) {
        const close = cur(); i++;
        return { type:"BlockStatement", body, start:open.start, end:close.end };
      }
      errors.push({ code:"UNCLOSED_BLOCK", message:"Code block is missing its closing brace.", start:open.start, end:source.length });
      return { type:"BlockStatement", body, start:open.start, end:source.length };
    };

    const parseParams = () => {
      const p = pair("(");
      if (!p) return null;
      const end = p.closed ? p.end - 1 : p.end;
      return { type:"ParameterList", raw:raw(p.start + 1,end), start:sig[p.start].start, end:p.closed ? sig[p.end - 1].end : source.length };
    };

    const parseFunction = declaration => {
      const from = i;
      if (is("async")) i++;
      if (is("function")) i++;
      let generator = false;
      if (is("*")) { generator = true; i++; }
      const name = cur()?.type === "identifier" ? sig[i++].value : null;
      const params = is("(") ? parseParams() : null;
      const body = is("{") ? parseBlock() : null;
      if (!body) errors.push({ code:"MISSING_FUNCTION_BODY", message:"Function body is missing.", start:sig[from].start, end:params?.end ?? source.length });
      return { type:declaration ? "FunctionDeclaration":"FunctionExpression", name, generator, async:raw(from,i).startsWith("async"), params, body, start:sig[from].start, end:body?.end ?? params?.end ?? sig[i - 1]?.end ?? source.length };
    };

    const parseClass = declaration => {
      const from = i++;
      const name = cur()?.type === "identifier" ? sig[i++].value : null;
      const header = i;
      while (i < sig.length && !is("{")) {
        if (OPEN.has(cur().value) && pairs.has(i)) i = pairs.get(i) + 1;
        else i++;
      }
      const heritage = raw(header,i).trim(), members = [];
      let end = sig[i - 1]?.end ?? sig[from].end;
      if (is("{")) {
        const open = cur(); i++;
        while (i < sig.length && !is("}")) {
          if (is(";")) { i++; continue; }
          const memberStart = i;
          if (is("static") && sig[i + 1]?.value === "{") {
            const staticStart = i++;
            const staticBody = parseBlock();
            members.push({ type:"StaticBlock", body:staticBody, start:sig[staticStart].start, end:staticBody?.end ?? sig[staticStart].end });
            continue;
          }
          let p = i, hasInitializer = false;
          while (p < sig.length && ![";","}"].includes(sig[p].value)) {
            if (sig[p].value === "=") hasInitializer = true;
            if (sig[p].value === "(" && !hasInitializer) break;
            if (OPEN.has(sig[p].value) && pairs.has(p)) p = pairs.get(p) + 1;
            else p++;
          }
          if (sig[p]?.value === "(" && !hasInitializer && pairs.has(p)) {
            const close = pairs.get(p);
            let bodyStart = close + 1;
            while (bodyStart < sig.length && !["{",";","}"].includes(sig[bodyStart].value)) bodyStart++;
            const key = raw(memberStart,p).trim(), params = raw(p + 1,close);
            i = bodyStart;
            const body = is("{") ? parseBlock() : null;
            members.push({ type:"MethodDefinition", key, params, body, start:sig[memberStart].start, end:body?.end ?? sig[Math.max(memberStart,i-1)].end });
          } else {
            i = memberStart;
            const field = consumeStatement();
            if (field.to === field.from) i++;
            members.push(make("PropertyDefinition",field.from,field.to,{raw:raw(field.from,field.to).replace(/;$/,"").trim()}));
          }
        }
        if (is("}")) end = sig[i++].end;
        else errors.push({ code:"UNCLOSED_CLASS_BODY", message:"Class body is missing its closing brace.", start:open.start, end:source.length });
      } else errors.push({ code:"MISSING_CLASS_BODY", message:"Class body is missing.", start:sig[from].start, end:source.length });
      return { type:declaration ? "ClassDeclaration":"ClassExpression", name, heritage, body:members, start:sig[from].start, end };
    };

    const parseVariable = () => {
      const from = i, kind = cur().value;
      i++;
      const consumed = consumeStatement(), end = consumed.to > consumed.from && sig[consumed.to-1].value === ";" ? consumed.to-1 : consumed.to;
      const ranges = []; let start = consumed.from, p = consumed.from;
      while (p < end) {
        if (OPEN.has(sig[p].value) && pairs.has(p)) { p = pairs.get(p) + 1; continue; }
        if (sig[p].value === ",") { ranges.push([start,p]); start = p+1; }
        p++;
      }
      if (start < end) ranges.push([start,end]);
      const declarations = ranges.map(([a,b]) => {
        let eq = -1, q = a;
        while (q < b) {
          if (OPEN.has(sig[q].value) && pairs.has(q)) { q = pairs.get(q)+1; continue; }
          if (sig[q].value === "=") { eq=q; break; }
          q++;
        }
        return make("VariableDeclarator",a,b,{id:raw(a,eq<0?b:eq).trim(),init:eq<0?null:raw(eq+1,b).trim()});
      });
      return make("VariableDeclaration",from,consumed.to,{kind,declarations});
    };

    const parseCondition = () => {
      const p = pair("(");
      if (!p) {
        errors.push({code:"MISSING_CONDITION",message:"Expected a parenthesized condition.",start:cur()?.start??source.length,end:cur()?.end??source.length});
        return null;
      }
      const end = p.closed ? p.end-1 : p.end;
      return {type:"Condition",raw:raw(p.start+1,end),start:sig[p.start].start,end:p.closed?sig[p.end-1].end:source.length};
    };

    const parseControl = keyword => {
      const from = i++;
      if (keyword === "do") {
        const body = parseStatement();
        let test = null;
        if (is("while")) { i++; test = parseCondition(); if (is(";")) i++; }
        return {type:"DoWhileStatement",body,test,start:sig[from].start,end:test?.end??body?.end??sig[from].end};
      }
      if (keyword === "for" && is("await")) i++;
      const test = parseCondition(), body = parseStatement();
      let alternate = null;
      if (keyword === "if" && is("else")) { i++; alternate = parseStatement(); }
      const types = {if:"IfStatement",for:"ForStatement",while:"WhileStatement",with:"WithStatement"};
      return {type:types[keyword],test,consequent:body,alternate,start:sig[from].start,end:alternate?.end??body?.end??test?.end??sig[from].end};
    };

    const parseSwitch = () => {
      const from = i++, discriminant = parseCondition(), cases = [];
      if (!is("{")) return {type:"SwitchStatement",discriminant,cases,start:sig[from].start,end:sig[i-1].end};
      const open = cur(); i++;
      while (i < sig.length && !is("}")) {
        const caseStart = i, isDefault = is("default");
        if (!isDefault && !is("case")) {
          const bad = cur(); i++;
          errors.push({code:"INVALID_SWITCH_CASE",message:"Expected case or default.",start:bad.start,end:bad.end});
          continue;
        }
        i++; const labelStart = i;
        while (i < sig.length && !is(":")) {
          if (OPEN.has(cur().value) && pairs.has(i)) i = pairs.get(i)+1; else i++;
        }
        const test = isDefault ? null : raw(labelStart,i).trim();
        if (is(":")) i++;
        const consequent = [];
        while (i < sig.length && !["case","default","}"].includes(cur().value)) {
          const before = i, stmt = parseStatement(); if (stmt) consequent.push(stmt);
          if (before === i) i++;
        }
        cases.push({type:"SwitchCase",test,consequent,start:sig[caseStart].start,end:consequent.at(-1)?.end??sig[i-1]?.end??open.end});
      }
      const end = is("}") ? sig[i++].end : source.length;
      return {type:"SwitchStatement",discriminant,cases,start:sig[from].start,end};
    };

    const parseTry = () => {
      const from = i++, block = is("{") ? parseBlock() : null;
      let handler = null, finalizer = null;
      if (is("catch")) {
        const start = i++; let param = null;
        if (is("(")) { const p = pair("("); param = raw(p.start+1,p.closed?p.end-1:p.end); }
        const body = is("{") ? parseBlock() : null;
        handler = {type:"CatchClause",param,body,start:sig[start].start,end:body?.end??sig[i-1]?.end??source.length};
      }
      if (is("finally")) { i++; finalizer = is("{") ? parseBlock() : null; }
      return {type:"TryStatement",block,handler,finalizer,start:sig[from].start,end:finalizer?.end??handler?.end??block?.end??sig[from].end};
    };

    const parseModule = () => {
      const from = i, exported = is("export"); i++;
      const isDefault = exported && is("default");
      if (isDefault) {
        i++;
        if (is("function") || (is("async") && sig[i+1]?.value === "function")) {
          const declaration = parseFunction(false);
          return {type:"ExportDefaultDeclaration",declaration,start:sig[from].start,end:declaration.end};
        }
        if (is("class")) {
          const declaration = parseClass(false);
          return {type:"ExportDefaultDeclaration",declaration,start:sig[from].start,end:declaration.end};
        }
      }
      const consumed = consumeStatement();
      const type = exported ? (isDefault ? "ExportDefaultDeclaration" : "ExportDeclaration") : "ImportDeclaration";
      return make(type,from,consumed.to,{raw:raw(from,consumed.to).replace(/;$/,"").trim()});
    };

    const parseStatement = () => {
      const t = cur();
      if (!t) return null;
      if (is("{")) return parseBlock();
      if (is(";")) { i++; return {type:"EmptyStatement",start:t.start,end:t.end}; }
      if (["const","let","var"].includes(t.value)) return parseVariable();
      if (is("function") || (is("async") && sig[i+1]?.value === "function")) return parseFunction(true);
      if (is("class")) return parseClass(true);
      if (["if","for","while","with","do"].includes(t.value)) return parseControl(t.value);
      if (is("switch")) return parseSwitch();
      if (is("try")) return parseTry();
      if (["return","throw","break","continue"].includes(t.value)) {
        const from = i++;
        const next = cur();
        const hasLineTerminator = next && hasNewline(t,next);
        if (hasLineTerminator && t.value === "throw") {
          errors.push({code:"ILLEGAL_LINE_TERMINATOR_AFTER_THROW",message:"A line terminator is not allowed immediately after throw.",start:t.start,end:next.start});
        }
        if (hasLineTerminator) {
          if (is(";")) i++;
          const type = t.value[0].toUpperCase()+t.value.slice(1)+"Statement";
          return {type,argument:null,start:t.start,end:sig[i-1]?.end??t.end};
        }
        const consumed = consumeStatement();
        const type = t.value[0].toUpperCase()+t.value.slice(1)+"Statement";
        return {type,argument:raw(from+1,consumed.to).replace(/;$/,"").trim()||null,start:t.start,end:sig[consumed.to-1]?.end??t.end};
      }
      if (is("debugger")) { i++; if (is(";")) i++; return {type:"DebuggerStatement",start:t.start,end:sig[i-1].end}; }
      if (is("import") || is("export")) return parseModule();
      const consumed = consumeStatement();
      if (consumed.to === consumed.from && i < sig.length && !is("}")) i++;
      return make("ExpressionStatement",consumed.from,consumed.to,{expression:expression(consumed.from,consumed.to)});
    };

    const body = [];
    while (i < sig.length) {
      const before = i, statement = parseStatement();
      if (statement) body.push(statement);
      if (i === before) {
        const bad = cur(); i++;
        errors.push({code:"PARSER_STALLED",message:"Parser skipped an unrecognized token.",start:bad.start,end:bad.end});
      }
    }
    for (const token of tokens) {
      if (token.type.startsWith("invalid-") || token.type === "invalid") {
        errors.push({code:"INVALID_TOKEN",message:"Invalid or unterminated JavaScript token.",start:token.start,end:token.end});
      }
    }
    const sourceType = body.some(statement => ["ImportDeclaration","ExportDeclaration","ExportDefaultDeclaration"].includes(statement.type)) ? "module" : "script";
    return {type:"Program",sourceType,body,tokens,errors,sourceLength:source.length,context};
  }
}

export function parseJavaScript(source, context) {
  return new JavaScriptParser().parse(source, context);
}
export default JavaScriptParser;
