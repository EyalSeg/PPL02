"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var L1_ast_1 = require("./L1-ast");
var L1_ast_2 = require("./L1-ast");
// Implement the following function:
exports.unparse = function (x) {
    return L1_ast_1.isProgram(x) ? unparseProgram(x) :
        L1_ast_1.isDefineExp(x) ? unparseDefineExp(x) :
            L1_ast_1.isCExp(x) ? unparseCExp(x) :
                '';
};
var unparseProgram = function (x) {
    return x.exps.map(function (exp) { return exports.unparse(exp); })
        .reduce(function (acc, curr) { return acc + curr; });
};
var unparseDefineExp = function (x) {
    return '( define ' + x.var.var + exports.unparse(x.val) + ')';
};
var unparseCExp = function (x) {
    return L1_ast_1.isNumExp(x) ? x.val.toString() :
        L1_ast_1.isBoolExp(x) ? unparseBoolean(x) :
            L1_ast_1.isPrimOp(x) ? x.op :
                L1_ast_1.isVarRef(x) ? x.var :
                    L1_ast_1.isVarDecl(x) ? '(let ' + x.var + ')' :
                        L1_ast_1.isAppExp(x) ? unparseApp(x) :
                            '';
};
var unparseBoolean = function (x) {
    return x.val ? '#t' : '#f';
};
var unparseApp = function (x) {
    var rands = x.rands.map(function (rand) { return exports.unparse(rand); });
    return '(' + unparseCExp(x.rator) +
        rands.reduce(function (acc, curr) { return acc + ' ' + curr; }, '') + ')';
};
console.log(exports.unparse(L1_ast_2.parseL1("(L1 " +
    "(define x 5)" +
    "(+ x 5)" +
    "(+ (+ (- x y) 3) 4)" +
    "(and #t x))")));
//# sourceMappingURL=q6.js.map