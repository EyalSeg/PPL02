"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./L3-ast");
var L3_ast_2 = require("./L3-ast");
var L3_ast_3 = require("./L3-ast");
var L3_ast_4 = require("./L3-ast");
var L3_ast_5 = require("./L3-ast");
var L1_ast_1 = require("./L1-ast");
exports.rewriteLetStar = function (cexp) {
    if (!L3_ast_1.isLetStarExp(cexp))
        return Error("expected let* exp ");
    var letStar = cexp;
    //to do check if bindings are 0
    if (letStar.bindings.length == 1)
        return L3_ast_1.makeLetExp(letStar.bindings, letStar.body);
    var bindingHead = [letStar.bindings[0]];
    // Make a let* with all bindings except the first, recursively turn it into a let
    // append it to a let binding the first bind only
    var nestedLetStar = L3_ast_1.makeLetStarExp(letStar.bindings.slice(1), letStar.body);
    var nestedLet = exports.rewriteLetStar(nestedLetStar);
    if (L3_ast_2.isError(nestedLet))
        return nestedLet;
    return L3_ast_1.makeLetExp(bindingHead, [nestedLet]);
};
exports.rewriteAllLetStar = function (cexp) {
    return L3_ast_2.isError(cexp) ? cexp :
        L3_ast_1.isBinding(cexp) ? rewriteAllLetStarBinding(cexp) :
            L3_ast_3.isExp(cexp) ? rewriteAllLetStarExp(cexp) :
                L3_ast_3.isProgram(cexp) ? L3_ast_1.makeProgram(ramda_1.map(rewriteAllLetStarExp, cexp.exps)) :
                    cexp;
};
var rewriteAllLetStarBinding = function (bind) {
    return L3_ast_1.makeBinding(bind.var, rewriteAllLetStarCExp(bind.val));
};
var rewriteAllLetStarExp = function (exp) {
    return L3_ast_3.isCExp(exp) ? rewriteAllLetStarCExp(exp) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_1.makeDefineExp(exp.var, rewriteAllLetStarCExp(exp.val)) :
            exp;
};
var rewriteLetStar_Nested = function (letStarExp) {
    var body_rewritten = letStarExp.body.map(function (x) { return rewriteAllLetStarCExp(x); });
    if (L1_ast_1.hasError(body_rewritten))
        return new Error(L3_ast_2.getErrorMessages(body_rewritten));
    var newBindings = letStarExp.bindings.map(function (bind) { return exports.rewriteAllLetStar(bind); });
    var letexp = exports.rewriteLetStar(L3_ast_1.makeLetStarExp(newBindings, body_rewritten));
    return letexp;
};
var rewriteAllLetStarCExp = function (exp) {
    var returnval = L3_ast_1.isAtomicExp(exp) ? exp :
        L3_ast_3.isLitExp(exp) ? exp :
            L3_ast_3.isIfExp(exp) ? L3_ast_4.makeIfExp(rewriteAllLetStarCExp(exp.test), rewriteAllLetStarCExp(exp.then), rewriteAllLetStarCExp(exp.alt)) :
                L3_ast_3.isAppExp(exp) ? L3_ast_4.makeAppExp(rewriteAllLetStarCExp(exp.rator), ramda_1.map(rewriteAllLetStarCExp, exp.rands)) :
                    L3_ast_3.isProcExp(exp) ? L3_ast_4.makeProcExp(exp.args, ramda_1.map(rewriteAllLetStarCExp, exp.body)) :
                        L3_ast_3.isLetExp(exp) ? L3_ast_1.makeLetExp(exp.bindings.map(function (bind) { return rewriteAllLetStarBinding(bind); }), ramda_1.map(rewriteAllLetStarCExp, exp.body)) :
                            L3_ast_1.isLetStarExp(exp) ? rewriteLetStar_Nested(exp) :
                                exp;
    return returnval;
};
console.log(JSON.stringify(exports.rewriteAllLetStar(L3_ast_5.parseL3("(let* ((x (let* ((y 5)) y)) (z 7)) (+ x (let* ((t 12)) t)))")), null, 4));
// MOM, LOOK AT ME! I'M A CODE MONKEY
//     __,__
//     .--.  .-"     "-.  .--.
//    / .. \/  .-. .-.  \/ .. \
//   | |  '|  /   Y   \  |'  | |
//   | \   \  \ 0 | 0 /  /   / |
//    \ '- ,\.-"`` ``"-./, -' /
//     `'-' /_   ^ ^   _\ '-'`
//     .--'|  \._ _ _./  |'--.
//   /`    \   \.-.  /   /    `\
//  /       '._/  |-' _.'       \
// /          ;  /--~'   |       \
// /        .'\|.-\--.     \       \
// /   .'-. /.-.;\  |\|'~'-.|\       \
// \       `-./`|_\_/ `     `\'.      \
// '.      ;     ___)        '.`;    /
//  '-.,_ ;     ___)          \/   /
//   \   ``'------'\       \   `  /
//    '.    \       '.      |   ;/_
// jgs  ___>     '.       \_ _ _/   ,  '--.
// .'   '.   .-~~~~~-. /     |--'`~~-.  \
// // / .---'/  .-~~-._/ / / /---..__.'  /
// ((_(_/    /  /      (_(_(_(---.__    .'
//        | |     _              `~~`
//        | |     \'.
//         \ '....' |
//          '.,___.'
//# sourceMappingURL=L3-rewrite.js.map