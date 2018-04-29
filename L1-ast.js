"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ===========================================================
// AST type models
var assert = require("assert");
var ramda_1 = require("ramda");
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
exports.makePrimOp = function (op) { return ({ tag: "PrimOp", op: op }); };
exports.makeVarRef = function (v) { return ({ tag: "VarRef", var: v }); };
exports.makeVarDecl = function (v) { return ({ tag: "VarDecl", var: v }); };
exports.makeAppExp = function (rator, rands) {
    return ({ tag: "AppExp", rator: rator, rands: rands });
};
// Type predicates for disjoint types
exports.isProgram = function (x) { return x.tag === "Program"; };
exports.isDefineExp = function (x) { return x.tag === "DefineExp"; };
exports.isNumExp = function (x) { return x.tag === "NumExp"; };
exports.isBoolExp = function (x) { return x.tag === "BoolExp"; };
exports.isPrimOp = function (x) { return x.tag === "PrimOp"; };
exports.isVarRef = function (x) { return x.tag === "VarRef"; };
exports.isVarDecl = function (x) { return x.tag === "VarDecl"; };
exports.isAppExp = function (x) { return x.tag === "AppExp"; };
exports.isError = function (x) { return x instanceof Error; };
exports.hasError = function (x) { return ramda_1.filter(exports.isError, x).length > 0; };
// Type predicates for type unions
exports.isExp = function (x) { return exports.isDefineExp(x) || exports.isCExp(x); };
exports.isCExp = function (x) { return exports.isNumExp(x) || exports.isBoolExp(x) || exports.isPrimOp(x) ||
    exports.isVarRef(x) || exports.isVarDecl(x) || exports.isAppExp(x) || exports.isError(x); };
// ========================================================
// Parsing utilities
exports.isEmpty = function (x) { return x.length === 0; };
exports.isArray = function (x) { return x instanceof Array; };
exports.isString = function (x) { return typeof x === "string"; };
exports.isNumericString = function (x) { return JSON.stringify(+x) === x; };
exports.first = function (x) { return x[0]; };
exports.rest = function (x) { return x.slice(1); };
// ========================================================
// Parsing
// Make sure to run "npm install ramda s-expression --save"
var parseSexp = require("s-expression");
exports.parseL1 = function (x) {
    return exports.parseL1Sexp(parseSexp(x));
};
exports.parseL1Sexp = function (sexp) {
    return exports.isEmpty(sexp) ? Error("Unexpected empty") :
        exports.isArray(sexp) ? parseL1Compound(sexp) :
            exports.isString(sexp) ? parseL1Atomic(sexp) :
                Error("Unexpected type" + sexp);
};
// There are type errors which we will address in L3 with more precise
// type definitions for the AST.
var parseL1Compound = function (sexps) {
    // @ts-ignore: type error
    return exports.first(sexps) === "L1" ? exports.makeProgram(ramda_1.map(exports.parseL1Sexp, exports.rest(sexps))) :
        exports.first(sexps) === "define" ? exports.makeDefineExp(exports.makeVarDecl(sexps[1]), parseL1CExp(sexps[2])) :
            parseL1CExp(sexps);
};
var parseL1Atomic = function (sexp) {
    return sexp === "#t" ? exports.makeBoolExp(true) :
        sexp === "#f" ? exports.makeBoolExp(false) :
            exports.isNumericString(sexp) ? exports.makeNumExp(+sexp) :
                isPrimitiveOp(sexp) ? exports.makePrimOp(sexp) :
                    exports.makeVarRef(sexp);
};
var isPrimitiveOp = function (x) {
    return x === "+" ||
        x === "-" ||
        x === "*" ||
        x === "/" ||
        x === ">" ||
        x === "<" ||
        x === "=" ||
        x === "not";
};
var parseL1CExp = function (sexp) {
    return exports.isArray(sexp) ? exports.makeAppExp(parseL1CExp(exports.first(sexp)), ramda_1.map(parseL1CExp, exports.rest(sexp))) :
        exports.isString(sexp) ? parseL1Atomic(sexp) :
            Error("Unexpected type" + sexp);
};
// ========================================================
// Tests
assert(exports.isNumExp(exports.parseL1("1")));
assert(exports.isBoolExp(exports.parseL1("#t")));
assert(exports.isVarRef(exports.parseL1("x")));
assert(exports.isDefineExp(exports.parseL1("(define x 1)")));
{
    var def = exports.parseL1("(define x 1");
    if (exports.isDefineExp(def)) {
        assert(exports.isVarDecl(def.var));
        assert(exports.isNumExp(def.val));
    }
}
assert(exports.isAppExp(exports.parseL1("(> x 1)")));
assert(exports.isAppExp(exports.parseL1("(> (+ x x) (* x x))")));
assert(exports.isProgram(exports.parseL1("(L1 (define x 1) (> (+ x 1) (* x x)))")));
//# sourceMappingURL=L1-ast.js.map