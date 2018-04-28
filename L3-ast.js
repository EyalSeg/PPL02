"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var value_1 = require("./value");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Type value constructors for disjoint types
exports.makeProgram = function (exps) { return ({ tag: "Program", exps: exps }); };
exports.makeDefineExp = function (v, val) {
    return ({ tag: "DefineExp", var: v, val: val });
};
exports.makeNumExp = function (n) { return ({ tag: "NumExp", val: n }); };
exports.makeBoolExp = function (b) { return ({ tag: "BoolExp", val: b }); };
exports.makeStrExp = function (s) { return ({ tag: "StrExp", val: s }); };
exports.makePrimOp = function (op) { return ({ tag: "PrimOp", op: op }); };
exports.makeVarRef = function (v) { return ({ tag: "VarRef", var: v }); };
exports.makeVarDecl = function (v) { return ({ tag: "VarDecl", var: v }); };
exports.makeAppExp = function (rator, rands) {
    return ({ tag: "AppExp", rator: rator, rands: rands });
};
// L2
exports.makeIfExp = function (test, then, alt) {
    return ({ tag: "IfExp", test: test, then: then, alt: alt });
};
exports.makeProcExp = function (args, body) {
    return ({ tag: "ProcExp", args: args, body: body });
};
exports.makeBinding = function (v, val) {
    return ({ tag: "Binding", var: v, val: val });
};
exports.makeLetExp = function (bindings, body) {
    return ({ tag: "LetExp", bindings: bindings, body: body });
};
// L3
exports.makeLitExp = function (val) {
    return ({ tag: "LitExp", val: val });
};
exports.makeLetStarExp = function (bindings, body) {
    return ({ tag: "LetStarExp", bindings: bindings, body: body });
};
// Type predicates for disjoint types
exports.isProgram = function (x) { return x.tag === "Program"; };
exports.isDefineExp = function (x) { return x.tag === "DefineExp"; };
exports.isNumExp = function (x) { return x.tag === "NumExp"; };
exports.isBoolExp = function (x) { return x.tag === "BoolExp"; };
exports.isStrExp = function (x) { return x.tag === "StrExp"; };
exports.isPrimOp = function (x) { return x.tag === "PrimOp"; };
exports.isVarRef = function (x) { return x.tag === "VarRef"; };
exports.isVarDecl = function (x) { return x.tag === "VarDecl"; };
exports.isAppExp = function (x) { return x.tag === "AppExp"; };
// L2
exports.isIfExp = function (x) { return x.tag === "IfExp"; };
exports.isProcExp = function (x) { return x.tag === "ProcExp"; };
exports.isBinding = function (x) { return x.tag === "Binding"; };
exports.isLetExp = function (x) { return x.tag === "LetExp"; };
// l3
exports.isLitExp = function (x) { return x.tag === "LitExp"; };
exports.isLetStarExp = function (x) { return x.tag === "LetStarExp"; };
// Type predicates for type unions
exports.isExp = function (x) { return exports.isDefineExp(x) || exports.isCExp(x); };
exports.isAtomicExp = function (x) {
    return exports.isNumExp(x) || exports.isBoolExp(x) || exports.isStrExp(x) ||
        exports.isPrimOp(x) || exports.isVarRef(x);
};
exports.isCompoundExp = function (x) {
    return exports.isAppExp(x) || exports.isIfExp(x) || exports.isProcExp(x) || exports.isLitExp(x) || exports.isLetExp(x);
};
exports.isCExp = function (x) {
    return exports.isAtomicExp(x) || exports.isCompoundExp(x);
};
// ========================================================
// Error handling
exports.isError = function (x) { return x instanceof Error; };
// Type predicate that warrants that an array does not contain errors.
// Needed for safeFL
exports.hasNoError = function (x) { return ramda_1.filter(exports.isError, x).length === 0; };
exports.getErrorMessages = function (x) {
    return ramda_1.map(function (x) { return JSON.stringify(x.message); }, ramda_1.filter(exports.isError, x)).join("\n");
};
// Make a safe version of f: apply f to x but check if x is an error before applying it.
exports.safeF = function (f) { return function (x) {
    if (exports.isError(x))
        return x;
    else
        return f(x);
}; };
// Same as safeF but for a function that accepts an array of values
// NOTE: we must use an annotation of the form Array<T1 | Error> instead of (T1 | Error)[]
// this is a syntactic restriction of TypeScript.
exports.safeFL = function (f) {
    return function (xs) {
        return exports.hasNoError(xs) ? f(xs) : Error(exports.getErrorMessages(xs));
    };
};
// A useful type predicate for homegeneous lists
exports.allT = function (isT, x) { return ramda_1.all(isT, x); };
// ========================================================
// Parsing utilities
exports.isEmpty = function (x) { return x.length === 0; };
exports.isArray = function (x) { return x instanceof Array; };
exports.isString = function (x) { return typeof x === "string"; };
exports.isNumber = function (x) { return typeof x === "number"; };
exports.isBoolean = function (x) { return typeof x === "boolean"; };
// s-expression returns strings quoted as "a" as [String: 'a'] objects
// to distinguish them from symbols - which are encoded as 'a'
// These are constructed using the new String("a") constructor
// and can be distinguished from regular strings based on the constructor.
exports.isSexpString = function (x) {
    return !exports.isString(x) && x.constructor && x.constructor.name === "String";
};
// A weird method to check that a string is a string encoding of a number
exports.isNumericString = function (x) { return JSON.stringify(+x) === x; };
// List operations similar to car/cdr/cadr in Scheme
exports.first = function (x) { return x[0]; };
exports.second = function (x) { return x[1]; };
exports.rest = function (x) { return x.slice(1); };
// ========================================================
// Parsing
var p = require("s-expression");
exports.parseL3 = function (x) {
    return exports.parseL3Sexp(p(x));
};
exports.parseL3Sexp = function (sexp) {
    return exports.isEmpty(sexp) ? Error("Parse: Unexpected empty") :
        exports.isArray(sexp) ? parseL3Compound(sexp) :
            exports.isString(sexp) ? parseL3Atomic(sexp) :
                exports.isSexpString(sexp) ? parseL3Atomic(sexp) :
                    Error("Parse: Unexpected type " + sexp);
};
var parseL3Compound = function (sexps) {
    return exports.isEmpty(sexps) ? Error("Unexpected empty sexp") :
        (exports.first(sexps) === "L3") ? parseProgram(ramda_1.map(exports.parseL3Sexp, exports.rest(sexps))) :
            (exports.first(sexps) === "define") ? parseDefine(exports.rest(sexps)) :
                exports.parseL3CExp(sexps);
};
var parseProgram = function (es) {
    return exports.isEmpty(es) ? Error("Empty program") :
        exports.allT(exports.isExp, es) ? exports.makeProgram(es) :
            exports.hasNoError(es) ? Error("Program cannot be embedded in another program - " + es) :
                Error(exports.getErrorMessages(es));
};
var parseDefine = function (es) {
    return (es.length !== 2) ? Error("define should be (define var val) - " + es) :
        !exports.isString(es[0]) ? Error("Expected (define <var> <CExp>) - " + es[0]) :
            exports.safeF(function (val) { return exports.makeDefineExp(exports.makeVarDecl(es[0]), val); })(exports.parseL3CExp(es[1]));
};
exports.parseL3CExp = function (sexp) {
    return exports.isArray(sexp) ? parseL3CompoundCExp(sexp) :
        exports.isString(sexp) ? parseL3Atomic(sexp) :
            exports.isSexpString(sexp) ? parseL3Atomic(sexp) :
                Error("Unexpected type" + sexp);
};
var parseL3CompoundCExp = function (sexps) {
    return exports.isEmpty(sexps) ? Error("Unexpected empty") :
        exports.first(sexps) === "if" ? parseIfExp(sexps) :
            exports.first(sexps) === "lambda" ? parseProcExp(sexps) :
                exports.first(sexps) === "let" ? parseLetExp(sexps) :
                    exports.first(sexps) === "let*" ? parseLetStarExp(sexps) :
                        exports.first(sexps) === "quote" ? exports.parseLitExp(sexps) :
                            parseAppExp(sexps);
};
var parseAppExp = function (sexps) {
    return exports.safeFL(function (cexps) { return exports.makeAppExp(exports.first(cexps), exports.rest(cexps)); })(ramda_1.map(exports.parseL3CExp, sexps));
};
var parseIfExp = function (sexps) {
    return exports.safeFL(function (cexps) { return exports.makeIfExp(cexps[0], cexps[1], cexps[2]); })(ramda_1.map(exports.parseL3CExp, exports.rest(sexps)));
};
var parseProcExp = function (sexps) {
    return exports.safeFL(function (body) { return exports.makeProcExp(ramda_1.map(exports.makeVarDecl, sexps[1]), body); })(ramda_1.map(exports.parseL3CExp, exports.rest(exports.rest(sexps))));
};
var parseDecls = function (sexps) {
    return exports.allT(exports.isString, sexps) ? ramda_1.map(exports.makeVarDecl, sexps) :
        Error("VarDecl must be a string - " + sexps);
};
// LetExp ::= (let (<binding>*) <cexp>+)
var parseLetExp = function (sexps) {
    return sexps.length < 3 ? Error("Expected (let (<binding>*) <cexp>+) - " + sexps) :
        safeMakeLetExp(parseBindings(sexps[1]), ramda_1.map(exports.parseL3CExp, sexps.slice(2)));
};
var safeMakeLetExp = function (bindings, body) {
    return exports.isError(bindings) ? bindings :
        exports.hasNoError(body) ? exports.makeLetExp(bindings, body) :
            Error(exports.getErrorMessages(body));
};
var parseLetStarExp = function (sexps) {
    return sexps.length < 3 ? Error("Expected (let (<binding>*) <cexp>+) - " + sexps) :
        safeMakeLetStarExp(parseBindings(sexps[1]), ramda_1.map(exports.parseL3CExp, sexps.slice(2)));
};
var safeMakeLetStarExp = function (bindings, body) {
    return exports.isError(bindings) ? bindings :
        exports.hasNoError(body) ? exports.makeLetStarExp(bindings, body) :
            Error(exports.getErrorMessages(body));
};
var parseBindings = function (pairs) {
    return safeMakeBindings(parseDecls(ramda_1.map(exports.first, pairs)), ramda_1.map(exports.parseL3CExp, ramda_1.map(exports.second, pairs)));
};
var safeMakeBindings = function (decls, vals) {
    return exports.isError(decls) ? decls :
        exports.hasNoError(vals) ? ramda_1.zipWith(exports.makeBinding, decls, vals) :
            Error(exports.getErrorMessages(vals));
};
var parseL3Atomic = function (sexp) {
    return sexp === "#t" ? exports.makeBoolExp(true) :
        sexp === "#f" ? exports.makeBoolExp(false) :
            exports.isNumericString(sexp) ? exports.makeNumExp(+sexp) :
                exports.isSexpString(sexp) ? exports.makeStrExp(sexp.toString()) :
                    isPrimitiveOp(sexp) ? exports.makePrimOp(sexp) :
                        exports.makeVarRef(sexp);
};
/*
    ;; <prim-op>  ::= + | - | * | / | < | > | = | not |  eq? | string=?
    ;;                  | cons | car | cdr | list? | number?
    ;;                  | boolean? | symbol? | string?      ##### L3
*/
var isPrimitiveOp = function (x) {
    return x === "+" ||
        x === "-" ||
        x === "*" ||
        x === "/" ||
        x === ">" ||
        x === "<" ||
        x === "=" ||
        x === "not" ||
        x === "eq?" ||
        x === "string=?" ||
        x === "cons" ||
        x === "car" ||
        x === "cdr" ||
        x === "list?" ||
        x === "number?" ||
        x === "boolean?" ||
        x === "symbol?" ||
        x === "string?";
};
exports.parseLitExp = function (sexps) {
    return exports.safeF(exports.makeLitExp)(exports.parseSExp(exports.second(sexps)));
};
// x is the output of p (sexp parser)
exports.parseSExp = function (x) {
    return x === "#t" ? true :
        x === "#f" ? false :
            exports.isNumericString(x) ? +x :
                exports.isSexpString(x) ? x.toString() :
                    exports.isString(x) ? value_1.makeSymbolSExp(x) :
                        x.length === 0 ? value_1.makeEmptySExp() :
                            exports.isArray(x) ? value_1.makeCompoundSExp(ramda_1.map(exports.parseSExp, x)) :
                                Error("Bad literal expression: " + x);
};
//# sourceMappingURL=L3-ast.js.map