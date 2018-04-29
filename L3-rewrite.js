"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var L3_ast_1 = require("./L3-ast");
var L3_ast_2 = require("./L3-ast");
var L3_ast_3 = require("./L3-ast");
var L3_ast_4 = require("./L3-ast");
var L3_ast_5 = require("./L3-ast");
exports.rewriteLetStar = function (cexp) {
    if (!L3_ast_1.isLetStarExp(cexp))
        return Error("expected let* exp ");
    var letStar = cexp;
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
        L3_ast_1.isBinding(cexp) ? cexp :
            L3_ast_3.isExp(cexp) ? rewriteAllLetStarExp(cexp) :
                L3_ast_3.isProgram(cexp) ? L3_ast_1.makeProgram(ramda_1.map(rewriteAllLetStarExp, cexp.exps)) :
                    cexp;
};
var rewriteAllLetStarExp = function (exp) {
    return L3_ast_3.isCExp(exp) ? rewriteAllLetStarCExp(exp) :
        L3_ast_3.isDefineExp(exp) ? L3_ast_1.makeDefineExp(exp.var, rewriteAllLetStarCExp(exp.val)) :
            exp;
};
var rewriteAllLetStarCExp = function (exp) {
    return L3_ast_1.isAtomicExp(exp) ? exp :
        L3_ast_3.isLitExp(exp) ? exp :
            L3_ast_3.isIfExp(exp) ? L3_ast_4.makeIfExp(rewriteAllLetStarCExp(exp.test), rewriteAllLetStarCExp(exp.then), rewriteAllLetStarCExp(exp.alt)) :
                L3_ast_3.isAppExp(exp) ? L3_ast_4.makeAppExp(rewriteAllLetStarCExp(exp.rator), ramda_1.map(rewriteAllLetStarCExp, exp.rands)) :
                    L3_ast_3.isProcExp(exp) ? L3_ast_4.makeProcExp(exp.args, ramda_1.map(rewriteAllLetStarCExp, exp.body)) :
                        L3_ast_3.isLetExp(exp) ? L3_ast_1.makeLetExp(exp.bindings, ramda_1.map(rewriteAllLetStarCExp, exp.body)) :
                            L3_ast_1.isLetStarExp(exp) ? exports.rewriteLetStar(exp) :
                                exp;
};
console.log(JSON.stringify(exports.rewriteLetStar(L3_ast_5.parseL3("(let* ((x 5) (y x) (z y)) (+ 1 2))")), null, 4));
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